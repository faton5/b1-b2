import json
import os
from dataclasses import dataclass
from urllib import error, request

from app import models


OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_OPENROUTER_MODEL = "mistralai/mistral-small-3.1-24b-instruct:free"


class ChatConfigurationError(RuntimeError):
    pass


class ChatProviderError(RuntimeError):
    pass


@dataclass
class ProviderReply:
    content: str
    model: str


def get_default_model() -> str:
    return os.getenv("OPENROUTER_MODEL", DEFAULT_OPENROUTER_MODEL)


def _normalize_content(content: object) -> str:
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        chunks: list[str] = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                chunks.append(str(item.get("text", "")))
        return "\n".join(chunk for chunk in chunks if chunk).strip()

    return ""


def _build_messages(
    session: models.ChatSession,
    user: models.User,
    current_level: models.RpgLevel,
    monthly_messages_used: int,
    user_message: str,
) -> list[dict[str, str]]:
    messages: list[dict[str, str]] = [
        {"role": "system", "content": session.system_prompt},
        {
            "role": "system",
            "content": (
                "User context:\n"
                f"- display_name: {user.display_name}\n"
                f"- username: {user.username}\n"
                f"- account_tier: {user.account_tier.name}\n"
                f"- level: {current_level.level} ({current_level.title})\n"
                f"- xp: {user.xp}\n"
                f"- ai_awareness_score: {user.ai_awareness_score}\n"
                f"- monthly_messages_used: {monthly_messages_used}\n"
                f"- monthly_message_limit: {user.account_tier.monthly_message_limit}\n"
                "- app_style: RPG-inspired AI awareness platform\n"
                "- objective: help the user understand AI clearly and responsibly"
            ),
        },
    ]

    for message in session.messages:
        messages.append({"role": message.role, "content": message.content})

    messages.append({"role": "user", "content": user_message})
    return messages


def generate_assistant_reply(
    session: models.ChatSession,
    user: models.User,
    current_level: models.RpgLevel,
    monthly_messages_used: int,
    user_message: str,
) -> ProviderReply:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ChatConfigurationError("OPENROUTER_API_KEY is not configured on the backend")

    payload = {
        "model": get_default_model(),
        "messages": _build_messages(
            session=session,
            user=user,
            current_level=current_level,
            monthly_messages_used=monthly_messages_used,
            user_message=user_message,
        ),
        "temperature": float(os.getenv("OPENROUTER_TEMPERATURE", "0.7")),
        "max_tokens": int(os.getenv("OPENROUTER_MAX_TOKENS", "700")),
        "user": str(user.id),
        "session_id": str(session.id),
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "http://localhost:3000"),
        "X-Title": os.getenv("OPENROUTER_APP_NAME", "b1-b2"),
    }

    req = request.Request(
        OPENROUTER_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=45) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise ChatProviderError(f"OpenRouter HTTP {exc.code}: {body}") from exc
    except error.URLError as exc:
        raise ChatProviderError(f"OpenRouter network error: {exc.reason}") from exc

    choices = raw.get("choices") or []
    if not choices:
        raise ChatProviderError("OpenRouter returned no choices")

    message = choices[0].get("message", {})
    content = _normalize_content(message.get("content"))
    if not content:
        raise ChatProviderError("OpenRouter returned an empty assistant message")

    return ProviderReply(content=content, model=str(raw.get("model") or payload["model"]))


def generate_assistant_reply_from_messages(
    messages: list[dict[str, str]],
    model: str | None = None,
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> ProviderReply:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ChatConfigurationError("OPENROUTER_API_KEY is not configured on the backend")

    payload = {
        "model": model or get_default_model(),
        "messages": messages,
        "temperature": temperature if temperature is not None else float(os.getenv("OPENROUTER_TEMPERATURE", "0.7")),
        "max_tokens": max_tokens if max_tokens is not None else int(os.getenv("OPENROUTER_MAX_TOKENS", "700")),
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "http://localhost:3000"),
        "X-Title": os.getenv("OPENROUTER_APP_NAME", "b1-b2"),
    }

    req = request.Request(
        OPENROUTER_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=45) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise ChatProviderError(f"OpenRouter HTTP {exc.code}: {body}") from exc
    except error.URLError as exc:
        raise ChatProviderError(f"OpenRouter network error: {exc.reason}") from exc

    choices = raw.get("choices") or []
    if not choices:
        raise ChatProviderError("OpenRouter returned no choices")

    message = choices[0].get("message", {})
    content = _normalize_content(message.get("content"))
    if not content:
        raise ChatProviderError("OpenRouter returned an empty assistant message")

    return ProviderReply(content=content, model=str(raw.get("model") or payload["model"]))
