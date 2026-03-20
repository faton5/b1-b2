# Documentation API

## Vue d'ensemble

Le dépôt expose deux surfaces HTTP distinctes :

- une route API côté frontend Next.js : `POST /api/chat`
- plusieurs endpoints côté backend FastAPI

Point important :
- la majorité du métier utilisateur côté web passe aujourd'hui par des server actions Next.js, pas par des endpoints REST publics
- les endpoints backend n'exposent pas de mécanisme d'authentification HTTP visible dans le code

## Frontend Next.js

### `POST /api/chat`

But :
- envoyer un message au chat IA
- appeler OpenRouter directement ou relayer vers le backend via `/chat/relay`

Formats acceptés :
- `application/json`
- `multipart/form-data`

Entrée JSON :

```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

Entrée `multipart/form-data` :
- `messages` : JSON stringifié du même format
- `files` : 0 à 3 fichiers

Contraintes :
- historique conservé : 12 messages max
- dernier message utilisateur obligatoire
- dernier message utilisateur : 4000 caractères max
- 3 fichiers max
- 1 Mo max par fichier
- fichiers texte/code uniquement

Extensions acceptées :
- `.txt`
- `.md`
- `.csv`
- `.json`
- `.xml`
- `.html`
- `.css`
- `.js`
- `.jsx`
- `.ts`
- `.tsx`
- `.py`
- `.java`
- `.c`
- `.cpp`
- `.cs`
- `.php`
- `.sql`
- `.yml`
- `.yaml`

Réponse succès `200` :

```json
{
  "reply": "Réponse assistant",
  "model": "provider/model",
  "userMessageContent": "Message réellement envoyé au provider",
  "requestId": "uuid-optionnel"
}
```

Erreurs :
- `400` : payload invalide, absence de message user, message trop long, fichier invalide
- `502` : backend relay indisponible, OpenRouter indisponible, réponse vide

Notes :
- si une session frontend existe, le transcript et les erreurs sont enregistrés en base
- en l'absence de clé OpenRouter frontend valide, la route peut basculer sur le backend relay

## Backend FastAPI

Base :
- pas de préfixe global
- CORS ouvert à `*`

### `GET /health`

But :
- vérifier que le backend répond

Réponse :

```json
{ "status": "ok" }
```

### `GET /account-tiers`

But :
- lister les tiers de compte backend

Réponse :
- tableau d'objets `AccountTierRead`

### `GET /levels`

But :
- lister les niveaux RPG backend

Réponse :
- tableau d'objets `RpgLevelRead`

### `GET /quests`

But :
- lister les quêtes backend

Réponse :
- tableau d'objets `QuestRead`

### `GET /users`

But :
- lister les utilisateurs backend

Réponse :
- tableau d'objets `UserRead`

### `POST /users`

But :
- créer un utilisateur backend

Entrée :

```json
{
  "username": "user1",
  "email": "user@example.com",
  "display_name": "User 1",
  "bio": "Optionnel",
  "account_tier_code": "explorer"
}
```

Réponse succès :
- `201`
- objet `UserRead`

Erreurs :
- `404` : tier introuvable

### `GET /users/{user_id}`

But :
- lire un utilisateur backend

Réponse :
- objet `UserRead`

Erreurs :
- `404` : utilisateur introuvable

### `PATCH /users/{user_id}`

But :
- modifier un utilisateur backend

Entrée :
- payload partiel `UserUpdate`

Réponse :
- objet `UserRead`

Erreurs :
- `404` : utilisateur introuvable
- `404` : tier introuvable

### `GET /users/{user_id}/dashboard`

But :
- lire le dashboard agrégé backend d'un utilisateur

Réponse :
- objet `UserDashboardRead`

Contient notamment :
- `user`
- `current_level`
- `next_level`
- `completed_quests`
- `active_chat_sessions`
- `monthly_messages_used`
- `monthly_message_limit`
- `quest_progress`

### `GET /users/{user_id}/chat-sessions`

But :
- lister les sessions de chat backend d'un utilisateur

Réponse :
- tableau d'objets `ChatSessionRead`

### `POST /users/{user_id}/quests/{quest_id}/complete`

But :
- marquer une quête backend comme complétée
- attribuer de l'XP si c'est la première complétion

Entrée :

```json
{
  "score": 80,
  "reflection": "Optionnel"
}
```

Réponse :
- objet `QuestCompletionResult`

Champs utiles :
- `awarded_xp`
- `already_completed`
- `user`
- `current_level`
- `next_level`

Erreurs :
- `404` : utilisateur introuvable
- `404` : quête introuvable
- `403` : quête avancée non autorisée par le tier

### `GET /chat/system-prompt`

But :
- exposer le prompt système backend

Réponse attendue :

```json
{
  "version": "...",
  "prompt": "...",
  "default_model": "..."
}
```

Note :
- la route existe bien dans le code, mais son implémentation appelle `get_default_model()` sans import explicite dans ce fichier
- elle peut donc échouer au runtime si ce point n'est pas corrigé

### `POST /chat/sessions`

But :
- créer une session de chat backend

Entrée :

```json
{
  "user_id": 1,
  "title": "Optionnel"
}
```

Réponse :
- `201`
- objet `ChatSessionRead`

### `GET /chat/sessions/{session_id}`

But :
- lire une session de chat backend avec ses messages

Réponse :
- objet `ChatSessionDetailRead`

Contient :
- `session`
- `messages`

### `POST /chat/sessions/{session_id}/messages`

But :
- ajouter un message utilisateur à une session backend
- appeler OpenRouter
- enregistrer la réponse assistant

Entrée :

```json
{
  "content": "Bonjour"
}
```

Réponse :
- objet `ChatExchangeRead`

Contient :
- `session`
- `user_message`
- `assistant_message`
- `provider_model`
- `monthly_messages_used`
- `monthly_message_limit`

Erreurs :
- `404` : session introuvable
- `404` : utilisateur introuvable
- `403` : quota mensuel atteint
- `500` : configuration provider invalide
- `502` : erreur OpenRouter

### `POST /chat/relay`

But :
- relayer un échange de chat stateless depuis le frontend

Entrée :

```json
{
  "messages": [
    { "role": "user", "content": "..." }
  ],
  "model": "optionnel",
  "temperature": 0.7,
  "max_tokens": 700
}
```

Réponse :

```json
{
  "reply": "Réponse assistant",
  "model": "provider/model"
}
```

Erreurs :
- `400` : messages absents
- `500` : configuration provider invalide
- `502` : erreur provider

## Remarques d'architecture

- le frontend et le backend exposent chacun leur propre logique de persistance
- l'application web actuelle s'appuie surtout sur la base SQLite du frontend
- le backend FastAPI expose un modèle plus orienté tiers, quêtes, niveaux et sessions de chat
- dans Docker, les volumes frontend et backend sont distincts

