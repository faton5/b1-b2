from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.db import get_db
from app.services.progression import get_current_level, get_next_level


router = APIRouter(tags=["users"])


def _serialize_user(user: models.User) -> schemas.UserRead:
    return schemas.UserRead(
        id=user.id,
        username=user.username,
        email=user.email,
        display_name=user.display_name,
        bio=user.bio,
        xp=user.xp,
        ai_awareness_score=user.ai_awareness_score,
        created_at=user.created_at,
        updated_at=user.updated_at,
        account_tier=schemas.AccountTierRead.model_validate(user.account_tier),
    )


def _serialize_progress(progress: models.UserQuestProgress) -> schemas.QuestProgressRead:
    return schemas.QuestProgressRead(
        quest=schemas.QuestRead.model_validate(progress.quest),
        status=progress.status,
        score=progress.score,
        completed_at=progress.completed_at,
    )


def _build_dashboard(db: Session, user: models.User) -> schemas.UserDashboardRead:
    levels = crud.list_levels(db)
    current_level = get_current_level(levels, user.xp)
    next_level = get_next_level(levels, user.xp)
    progress_entries = crud.list_user_quest_progress(db, user.id)
    monthly_messages_used = crud.count_user_messages_this_month(db, user.id)
    active_chat_sessions = len(crud.list_user_sessions(db, user.id))

    return schemas.UserDashboardRead(
        user=_serialize_user(user),
        current_level=schemas.RpgLevelRead.model_validate(current_level),
        next_level=schemas.RpgLevelRead.model_validate(next_level) if next_level else None,
        completed_quests=sum(1 for item in progress_entries if item.status == "completed"),
        active_chat_sessions=active_chat_sessions,
        monthly_messages_used=monthly_messages_used,
        monthly_message_limit=user.account_tier.monthly_message_limit,
        quest_progress=[_serialize_progress(item) for item in progress_entries],
    )


@router.get("/users", response_model=list[schemas.UserRead])
def read_users(db: Session = Depends(get_db)) -> list[schemas.UserRead]:
    return [_serialize_user(user) for user in crud.list_users(db)]


@router.post("/users", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)) -> schemas.UserRead:
    account_tier = crud.get_account_tier_by_code(db, payload.account_tier_code)
    if account_tier is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account tier not found")

    user = crud.create_user(db, payload, account_tier)
    return _serialize_user(user)


@router.get("/users/{user_id}", response_model=schemas.UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)) -> schemas.UserRead:
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _serialize_user(user)


@router.patch("/users/{user_id}", response_model=schemas.UserRead)
def patch_user(
    user_id: int,
    payload: schemas.UserUpdate,
    db: Session = Depends(get_db),
) -> schemas.UserRead:
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    account_tier = None
    if payload.account_tier_code:
        account_tier = crud.get_account_tier_by_code(db, payload.account_tier_code)
        if account_tier is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account tier not found")

    updated = crud.update_user(db, user, payload, account_tier)
    return _serialize_user(updated)


@router.get("/users/{user_id}/dashboard", response_model=schemas.UserDashboardRead)
def read_user_dashboard(user_id: int, db: Session = Depends(get_db)) -> schemas.UserDashboardRead:
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _build_dashboard(db, user)


@router.get("/users/{user_id}/chat-sessions", response_model=list[schemas.ChatSessionRead])
def read_user_sessions(user_id: int, db: Session = Depends(get_db)) -> list[schemas.ChatSessionRead]:
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return [
        schemas.ChatSessionRead(
            id=session.id,
            user_id=session.user_id,
            title=session.title,
            system_prompt=session.system_prompt,
            created_at=session.created_at,
            updated_at=session.updated_at,
        )
        for session in crud.list_user_sessions(db, user_id)
    ]


@router.post(
    "/users/{user_id}/quests/{quest_id}/complete",
    response_model=schemas.QuestCompletionResult,
)
def complete_quest(
    user_id: int,
    quest_id: int,
    payload: schemas.QuestCompletionCreate,
    db: Session = Depends(get_db),
) -> schemas.QuestCompletionResult:
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    quest = crud.get_quest(db, quest_id)
    if quest is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quest not found")

    if quest.advanced_only and not user.account_tier.can_access_advanced_quests:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Current account tier cannot access this quest",
        )

    progress = crud.get_user_quest_progress(db, user.id, quest.id)
    already_completed = progress is not None and progress.status == "completed"
    awarded_xp = 0

    if progress is None:
        progress = models.UserQuestProgress(user_id=user.id, quest_id=quest.id)

    progress.status = "completed"
    progress.score = payload.score
    progress.reflection = payload.reflection
    progress.completed_at = datetime.utcnow()
    crud.save_quest_progress(db, progress)

    if not already_completed:
        awarded_xp = quest.xp_reward
        user.xp += quest.xp_reward
        user.ai_awareness_score = min(100, user.ai_awareness_score + max(5, payload.score // 10))
        db.add(user)
        db.commit()
        db.refresh(user)
        user = crud.get_user(db, user.id)  # type: ignore[assignment]

    levels = crud.list_levels(db)
    current_level = get_current_level(levels, user.xp)
    next_level = get_next_level(levels, user.xp)

    return schemas.QuestCompletionResult(
        quest=schemas.QuestRead.model_validate(quest),
        user=_serialize_user(user),
        current_level=schemas.RpgLevelRead.model_validate(current_level),
        next_level=schemas.RpgLevelRead.model_validate(next_level) if next_level else None,
        awarded_xp=awarded_xp,
        already_completed=already_completed,
    )
