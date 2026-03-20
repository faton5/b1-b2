# Documentation Technique

## Vue d'ensemble

Le dépôt est organisé en deux applications principales :

- `frontend/` : application Next.js 16, App Router
- `backend/` : API FastAPI

Une troisième couche est utilisée en déploiement :
- `backend/nginx/` : reverse proxy Nginx

## Architecture générale

### Frontend

Le frontend est l'application principale visible par les utilisateurs.

Structure principale :
- `frontend/app/` : routes Next.js
- `frontend/app/(app)/` : routes authentifiées
- `frontend/app/api/` : routes API Next.js
- `frontend/components/` : composants UI
- `frontend/lib/` : logique métier, auth, session, progression, badges, DB

Routes applicatives principales :
- `/login`
- `/signup`
- `/modules`
- `/chat`
- `/quiz`
- `/games`
- `/badges`
- `/dashboard`

### Backend

Le backend FastAPI expose sa propre API.

Structure principale :
- `backend/app/main.py` : entrée FastAPI
- `backend/app/routes/` : routers
- `backend/app/services/` : services métier
- `backend/app/models.py` : modèles SQLAlchemy
- `backend/app/schemas.py` : schémas Pydantic
- `backend/app/db.py` : connexion DB backend

Routers enregistrés :
- `catalog`
- `users`
- `chat`

## Authentification et session frontend

L'authentification web est gérée côté frontend via des server actions.

Fichiers principaux :
- `frontend/lib/auth.actions.ts`
- `frontend/lib/session.ts`
- `frontend/lib/roles.ts`
- `frontend/proxy.ts`

Fonctionnement :
- création de session en base SQLite frontend
- cookie `session_token` côté navigateur
- durée de session : 7 jours
- mot de passe hashé avec `bcryptjs`
- redirection vers `/dashboard` pour les profs
- redirection vers `/modules` pour les élèves

Le middleware/proxy :
- redirige `/login` et `/signup` si la session est valide
- supprime un cookie périmé ou invalide

## Modèle de données frontend

Le frontend utilise `node:sqlite` avec `DatabaseSync`.

Fichier clé :
- `frontend/lib/db.ts`

Tables principales :
- `users`
- `sessions`
- `student_invite_codes`
- `user_badges`
- `quiz_completions`
- `module_completions`
- `guest_students`
- `quiz_answers`
- `game_sessions`
- `chat_transcripts`
- `chat_failures`

Caractéristiques :
- base SQLite locale
- mode WAL
- initialisation lazy
- création de schéma au premier accès

## Server actions frontend

### Auth

Fichier :
- `frontend/lib/auth.actions.ts`

Actions principales :
- `signUp`
- `signIn`
- `signOut`

### Admin professeur

Fichier :
- `frontend/lib/admin.actions.ts`

Action principale :
- `generateStudentInviteCode`

### Progression

Fichier :
- `frontend/lib/progression.actions.ts`

Actions principales :
- `awardXp`
- `getModuleProgress`
- `completeModule`
- `completeQuiz`
- `recordGameSession`

### Badges

Fichier :
- `frontend/lib/badges.ts`

Fonctions principales :
- `syncBadgesForUser`
- `getBadgeStatuses`

## Chat IA

### Route API frontend

Fichier :
- `frontend/app/api/chat/route.ts`

Rôle :
- accepter les messages du chat
- accepter des pièces jointes texte/code
- appeler OpenRouter directement
- ou relayer vers le backend avec `/chat/relay`

Persistance :
- `chat_transcripts`
- `chat_failures`

### Backend chat

Fichiers :
- `backend/app/routes/chat.py`
- `backend/app/services/chat.py`

Rôle :
- créer des sessions de chat backend
- stocker les messages backend
- appeler OpenRouter
- exposer un endpoint stateless `/chat/relay`

## XP et badges

L'XP et les badges de l'application web sont calculés côté frontend.

Sources d'XP :
- modules
- quiz
- mini-jeux

Déclenchement :
- via les server actions de `frontend/lib/progression.actions.ts`

Mise à jour UI :
- via `frontend/lib/xp-context.tsx`
- affichage dans `frontend/components/sidebar-xp.tsx`

## Navigation

### Desktop

Fichier :
- `frontend/components/app-sidebar.tsx`

### Mobile

Fichiers :
- `frontend/components/mobile-nav.tsx`
- `frontend/components/sidebar-nav-link.tsx`
- `frontend/app/(app)/layout.tsx`

## Point technique important

Le dépôt contient aujourd'hui deux couches de persistance séparées :

- une base SQLite frontend pour l'application web réelle
- une base backend SQLAlchemy pour les endpoints FastAPI

En Docker :
- le frontend écrit dans son volume `frontend-data`
- le backend écrit dans son volume `backend-data`

Ils ne partagent donc pas la même base SQLite.

Conséquence :
- un endpoint backend `/users` ne reflète pas automatiquement les comptes créés via le frontend
- l'application utilisateur s'appuie surtout sur la couche frontend

