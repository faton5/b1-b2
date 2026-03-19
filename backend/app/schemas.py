from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AccountTierRead(BaseModel):
    id: int
    code: str
    name: str
    description: str
    monthly_message_limit: int
    can_access_advanced_quests: bool

    model_config = ConfigDict(from_attributes=True)


class RpgLevelRead(BaseModel):
    id: int
    level: int
    title: str
    min_xp: int
    badge: str

    model_config = ConfigDict(from_attributes=True)


class QuestRead(BaseModel):
    id: int
    slug: str
    title: str
    theme: str
    description: str
    difficulty: str
    xp_reward: int
    advanced_only: bool

    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: str | None = Field(default=None, max_length=255)
    display_name: str = Field(min_length=1, max_length=100)
    bio: str | None = None


class UserCreate(UserBase):
    account_tier_code: str = Field(default="explorer", min_length=3, max_length=50)


class UserUpdate(BaseModel):
    email: str | None = Field(default=None, max_length=255)
    display_name: str | None = Field(default=None, min_length=1, max_length=100)
    bio: str | None = None
    account_tier_code: str | None = Field(default=None, min_length=3, max_length=50)


class UserRead(BaseModel):
    id: int
    username: str
    email: str | None
    display_name: str
    bio: str | None
    xp: int
    ai_awareness_score: int
    created_at: datetime
    updated_at: datetime
    account_tier: AccountTierRead


class QuestProgressRead(BaseModel):
    quest: QuestRead
    status: str
    score: int | None
    completed_at: datetime | None


class UserDashboardRead(BaseModel):
    user: UserRead
    current_level: RpgLevelRead
    next_level: RpgLevelRead | None
    completed_quests: int
    active_chat_sessions: int
    monthly_messages_used: int
    monthly_message_limit: int
    quest_progress: list[QuestProgressRead]


class QuestCompletionCreate(BaseModel):
    score: int = Field(ge=0, le=100)
    reflection: str | None = None


class QuestCompletionResult(BaseModel):
    quest: QuestRead
    user: UserRead
    current_level: RpgLevelRead
    next_level: RpgLevelRead | None
    awarded_xp: int
    already_completed: bool


class ChatSessionCreate(BaseModel):
    user_id: int
    title: str | None = Field(default=None, max_length=150)


class ChatSessionRead(BaseModel):
    id: int
    user_id: int
    title: str
    system_prompt: str
    created_at: datetime
    updated_at: datetime


class ChatMessageCreate(BaseModel):
    content: str = Field(min_length=1)


class ChatMessageRead(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime


class ChatSessionDetailRead(BaseModel):
    session: ChatSessionRead
    messages: list[ChatMessageRead]


class ChatExchangeRead(BaseModel):
    session: ChatSessionRead
    user_message: ChatMessageRead
    assistant_message: ChatMessageRead
    provider_model: str
    monthly_messages_used: int
    monthly_message_limit: int


class ChatRelayMessage(BaseModel):
    role: str
    content: str


class ChatRelayRequest(BaseModel):
    messages: list[ChatRelayMessage]
    model: str | None = None
    temperature: float | None = None
    max_tokens: int | None = None


class ChatRelayResponse(BaseModel):
    reply: str
    model: str


class ChatSystemPromptRead(BaseModel):
    version: str
    prompt: str
    default_model: str
