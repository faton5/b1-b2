# Guide de Déploiement Docker

## Vue d'ensemble

Le projet utilise 3 services Docker :

- `frontend`
- `backend`
- `nginx`

Nginx joue le rôle de reverse proxy entre le navigateur, le frontend Next.js et le backend FastAPI.

## Fichiers concernés

- `docker-compose.yml`
- `docker-compose.local.yml`
- `frontend/Dockerfile`
- `backend/Dockerfile`
- `backend/nginx/Dockerfile`
- `backend/nginx/nginx.conf`
- `backend/nginx/nginx.local.conf`

## Déploiement standard

Depuis la racine du projet :

```powershell
docker compose up --build -d
```

Arrêter la stack :

```powershell
docker compose down
```

Voir l'état :

```powershell
docker compose ps
```

Voir les logs :

```powershell
docker compose logs -f
```

## Services

### Backend

- image basée sur `python:3.12-slim`
- démarre `uvicorn app.main:app`
- port conteneur : `8000`
- volume : `/app/data`

Variables importantes :
- `DATABASE_URL`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_SITE_URL`
- `OPENROUTER_APP_NAME`
- `OPENROUTER_TEMPERATURE`
- `OPENROUTER_MAX_TOKENS`

### Frontend

- image basée sur `node:22-alpine`
- build via `pnpm build`
- runtime via `pnpm start`
- port conteneur : `3000`
- volume : `/app/data`

Variables importantes :
- `DATABASE_URL`
- `BACKEND_CHAT_URL`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_SITE_URL`
- `OPENROUTER_APP_NAME`
- `OPENROUTER_TEMPERATURE`
- `OPENROUTER_MAX_TOKENS`

### Nginx

- image basée sur `nginx:1.27-alpine`
- reverse proxy du frontend et du backend
- port exposé par défaut : `80`

## Ports

### `docker-compose.yml`

- `backend` : `${BACKEND_PORT:-8000}:8000`
- `frontend` : pas de port host direct
- `nginx` : `80:80`

Accès principal :
- [http://localhost](http://localhost)

Backend direct si exposé :
- [http://localhost:8000](http://localhost:8000)

### `docker-compose.local.yml`

- `frontend` : `3001:3000`
- `nginx` : `8080:80`

Accès local :
- [http://localhost:3001](http://localhost:3001)
- [http://localhost:8080](http://localhost:8080)

## Routage Nginx

Routes principales :
- `/` vers le frontend
- `/api/chat` vers le frontend
- `/api/*` vers le backend
- `/health` vers le backend
- `/docs` vers le backend

## Variables d'environnement

Exemples fournis :
- `frontend/.env.example`
- `backend/.env.example`

Exemple minimal :

```env
OPENROUTER_API_KEY=replace_me
OPENROUTER_MODEL=mistralai/mistral-small-3.1-24b-instruct:free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_APP_NAME=DetectIA
OPENROUTER_TEMPERATURE=0.7
OPENROUTER_MAX_TOKENS=700
```

## Données persistées

Deux volumes Docker sont déclarés :

- `backend-data`
- `frontend-data`

Important :
- le frontend et le backend utilisent chacun leur propre volume
- même si les deux pointent vers `/app/data/app.db`, ce ne sont pas le même fichier SQLite

Conséquence :
- les données frontend et backend ne sont pas fusionnées automatiquement

## Démarrage recommandé

### 1. Préparer la clé OpenRouter

Définir `OPENROUTER_API_KEY` dans l'environnement Docker.

### 2. Lancer la stack

```powershell
docker compose up --build -d
```

### 3. Vérifier la santé du backend

```powershell
curl http://localhost/health
```

### 4. Ouvrir l'application

- [http://localhost](http://localhost)

## Notes d'exploitation

- aucune `healthcheck` Docker n'est définie dans les compose files
- `depends_on` gère seulement l'ordre de démarrage, pas la readiness applicative
- Nginx est configuré en HTTP simple, sans TLS
- le frontend Next.js nécessite `node --experimental-sqlite`, déjà intégré dans les scripts npm et l'image Docker

