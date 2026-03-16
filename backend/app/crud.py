from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app import models, schemas


def list_account_tiers(db: Session) -> list[models.AccountTier]:
    return list(db.scalars(select(models.AccountTier).order_by(models.AccountTier.id.asc())).all())


def get_account_tier_by_code(db: Session, code: str) -> models.AccountTier | None:
    return db.scalar(select(models.AccountTier).where(models.AccountTier.code == code))


def list_levels(db: Session) -> list[models.RpgLevel]:
    return list(db.scalars(select(models.RpgLevel).order_by(models.RpgLevel.level.asc())).all())


def list_quests(db: Session) -> list[models.LearningQuest]:
    return list(db.scalars(select(models.LearningQuest).order_by(models.LearningQuest.id.asc())).all())


def get_quest(db: Session, quest_id: int) -> models.LearningQuest | None:
    return db.scalar(select(models.LearningQuest).where(models.LearningQuest.id == quest_id))


def list_users(db: Session) -> list[models.User]:
    query = (
        select(models.User)
        .options(selectinload(models.User.account_tier))
        .order_by(models.User.created_at.asc())
    )
    return list(db.scalars(query).all())


def get_user(db: Session, user_id: int) -> models.User | None:
    query = (
        select(models.User)
        .options(selectinload(models.User.account_tier))
        .where(models.User.id == user_id)
    )
    return db.scalar(query)


def create_user(db: Session, payload: schemas.UserCreate, account_tier: models.AccountTier) -> models.User:
    user = models.User(
        username=payload.username,
        email=payload.email,
        display_name=payload.display_name,
        bio=payload.bio,
        account_tier_id=account_tier.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return get_user(db, user.id)  # type: ignore[return-value]


def update_user(
    db: Session,
    user: models.User,
    payload: schemas.UserUpdate,
    account_tier: models.AccountTier | None = None,
) -> models.User:
    update_data = payload.model_dump(exclude_unset=True)
    update_data.pop("account_tier_code", None)

    for field, value in update_data.items():
        setattr(user, field, value)

    if account_tier is not None:
        user.account_tier_id = account_tier.id

    db.add(user)
    db.commit()
    db.refresh(user)
    return get_user(db, user.id)  # type: ignore[return-value]


def list_user_quest_progress(db: Session, user_id: int) -> list[models.UserQuestProgress]:
    query = (
        select(models.UserQuestProgress)
        .options(selectinload(models.UserQuestProgress.quest))
        .where(models.UserQuestProgress.user_id == user_id)
        .order_by(models.UserQuestProgress.id.asc())
    )
    return list(db.scalars(query).all())


def get_user_quest_progress(
    db: Session,
    user_id: int,
    quest_id: int,
) -> models.UserQuestProgress | None:
    query = (
        select(models.UserQuestProgress)
        .options(selectinload(models.UserQuestProgress.quest))
        .where(
            models.UserQuestProgress.user_id == user_id,
            models.UserQuestProgress.quest_id == quest_id,
        )
    )
    return db.scalar(query)


def save_quest_progress(db: Session, progress: models.UserQuestProgress) -> models.UserQuestProgress:
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress


def list_user_sessions(db: Session, user_id: int) -> list[models.ChatSession]:
    query = (
        select(models.ChatSession)
        .where(models.ChatSession.user_id == user_id)
        .order_by(models.ChatSession.updated_at.desc())
    )
    return list(db.scalars(query).all())


def create_chat_session(
    db: Session,
    user_id: int,
    title: str,
    system_prompt: str,
) -> models.ChatSession:
    session = models.ChatSession(user_id=user_id, title=title, system_prompt=system_prompt)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_chat_session(db: Session, session_id: int) -> models.ChatSession | None:
    query = (
        select(models.ChatSession)
        .options(selectinload(models.ChatSession.messages))
        .where(models.ChatSession.id == session_id)
    )
    return db.scalar(query)


def add_chat_message(
    db: Session,
    session: models.ChatSession,
    role: str,
    content: str,
) -> models.ChatMessage:
    message = models.ChatMessage(session_id=session.id, role=role, content=content)
    session.updated_at = datetime.utcnow()
    db.add(message)
    db.add(session)
    db.commit()
    db.refresh(message)
    return message


def count_user_messages_this_month(db: Session, user_id: int) -> int:
    start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    query = (
        select(func.count(models.ChatMessage.id))
        .join(models.ChatSession, models.ChatMessage.session_id == models.ChatSession.id)
        .where(
            models.ChatSession.user_id == user_id,
            models.ChatMessage.role == "user",
            models.ChatMessage.created_at >= start_of_month,
        )
    )
    return int(db.scalar(query) or 0)
