from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import constants, crud, schemas
from app.db import get_db
from app.services.chat import (
    ChatConfigurationError,
    ChatProviderError,
    generate_assistant_reply,
    get_default_model,
)
from app.services.progression import get_current_level


router = APIRouter(tags=["chat"])


@router.get("/chat/system-prompt", response_model=schemas.ChatSystemPromptRead)
def read_chat_system_prompt() -> schemas.ChatSystemPromptRead:
    return schemas.ChatSystemPromptRead(
        version=constants.SYSTEM_PROMPT_VERSION,
        prompt=constants.SYSTEM_PROMPT.strip(),
        default_model=get_default_model(),
    )


@router.post("/chat/sessions", response_model=schemas.ChatSessionRead, status_code=status.HTTP_201_CREATED)
def create_session(payload: schemas.ChatSessionCreate, db: Session = Depends(get_db)) -> schemas.ChatSessionRead:
    user = crud.get_user(db, payload.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    title = payload.title or f"{user.display_name} chat"
    session = crud.create_chat_session(
        db=db,
        user_id=user.id,
        title=title,
        system_prompt=constants.SYSTEM_PROMPT.strip(),
    )
    return schemas.ChatSessionRead(
        id=session.id,
        user_id=session.user_id,
        title=session.title,
        system_prompt=session.system_prompt,
        created_at=session.created_at,
        updated_at=session.updated_at,
    )


@router.get("/chat/sessions/{session_id}", response_model=schemas.ChatSessionDetailRead)
def read_session(session_id: int, db: Session = Depends(get_db)) -> schemas.ChatSessionDetailRead:
    session = crud.get_chat_session(db, session_id)
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found")

    return schemas.ChatSessionDetailRead(
        session=schemas.ChatSessionRead(
            id=session.id,
            user_id=session.user_id,
            title=session.title,
            system_prompt=session.system_prompt,
            created_at=session.created_at,
            updated_at=session.updated_at,
        ),
        messages=[
            schemas.ChatMessageRead(
                id=message.id,
                role=message.role,
                content=message.content,
                created_at=message.created_at,
            )
            for message in session.messages
        ],
    )


@router.post("/chat/sessions/{session_id}/messages", response_model=schemas.ChatExchangeRead)
def send_message(
    session_id: int,
    payload: schemas.ChatMessageCreate,
    db: Session = Depends(get_db),
) -> schemas.ChatExchangeRead:
    session = crud.get_chat_session(db, session_id)
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found")

    user = crud.get_user(db, session.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    monthly_messages_used = crud.count_user_messages_this_month(db, user.id)
    if monthly_messages_used >= user.account_tier.monthly_message_limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Monthly message limit reached for this account tier",
        )

    levels = crud.list_levels(db)
    current_level = get_current_level(levels, user.xp)

    user_message = crud.add_chat_message(db, session, "user", payload.content)
    try:
        provider_reply = generate_assistant_reply(
            session=session,
            user=user,
            current_level=current_level,
            monthly_messages_used=monthly_messages_used + 1,
            user_message=payload.content,
        )
    except ChatConfigurationError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc
    except ChatProviderError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    assistant_message = crud.add_chat_message(db, session, "assistant", provider_reply.content)

    return schemas.ChatExchangeRead(
        session=schemas.ChatSessionRead(
            id=session.id,
            user_id=session.user_id,
            title=session.title,
            system_prompt=session.system_prompt,
            created_at=session.created_at,
            updated_at=session.updated_at,
        ),
        user_message=schemas.ChatMessageRead(
            id=user_message.id,
            role=user_message.role,
            content=user_message.content,
            created_at=user_message.created_at,
        ),
        assistant_message=schemas.ChatMessageRead(
            id=assistant_message.id,
            role=assistant_message.role,
            content=assistant_message.content,
            created_at=assistant_message.created_at,
        ),
        provider_model=provider_reply.model,
        monthly_messages_used=monthly_messages_used + 1,
        monthly_message_limit=user.account_tier.monthly_message_limit,
    )
