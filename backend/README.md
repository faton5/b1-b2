# Python backend

Backend for an RPG-style AI awareness web app.

It includes:

- users and account tiers
- RPG levels based on XP
- learning quests about AI awareness
- chat sessions with a predefined system prompt
- SQLite persistence for user data and conversations

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Database

By default, the API uses a local SQLite database:

```bash
sqlite:///./app.db
```

Override it with:

```bash
set DATABASE_URL=sqlite:///./custom.db
```

## OpenRouter / Mistral config

The chat endpoint now calls OpenRouter directly.

Required:

```bash
set OPENROUTER_API_KEY=your_key_here
```

Optional:

```bash
set OPENROUTER_MODEL=mistralai/mistral-small-3.1-24b-instruct:free
set OPENROUTER_SITE_URL=http://localhost:3000
set OPENROUTER_APP_NAME=b1-b2
set OPENROUTER_TEMPERATURE=0.7
set OPENROUTER_MAX_TOKENS=700
```

## Main routes

- `GET /health`
- `GET /account-tiers`
- `GET /levels`
- `GET /quests`
- `GET /users`
- `POST /users`
- `GET /users/{user_id}`
- `PATCH /users/{user_id}`
- `GET /users/{user_id}/dashboard`
- `GET /users/{user_id}/chat-sessions`
- `POST /users/{user_id}/quests/{quest_id}/complete`
- `GET /chat/system-prompt`
- `POST /chat/sessions`
- `GET /chat/sessions/{session_id}`
- `POST /chat/sessions/{session_id}/messages`

## Example flow

1. Create a user.
2. Fetch the user dashboard to get account tier, level, and quest progress.
3. Create a chat session for that user.
4. Send messages through the chat endpoint and the backend will call OpenRouter with the system prompt.
5. Mark quests as completed to grant XP and level up the user.
