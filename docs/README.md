# Documentation

Ce dossier regroupe la documentation principale du projet.

- [API et endpoints](./api-endpoints.md)
- [Guide utilisateur](./guide-utilisateur.md)
- [Documentation technique](./doc-technique.md)
- [Guide de déploiement Docker](./deploiement-docker.md)
- [Rôles prof/élève et système XP/badges](./roles-xp-badges.md)

## Périmètre

Cette documentation est basée sur le code actuellement présent dans le dépôt.

Point important :
- l'application web utilisée par les utilisateurs repose principalement sur le frontend Next.js et sa base SQLite locale
- le backend FastAPI expose aussi ses propres endpoints et son propre modèle de données
- dans l'état actuel du dépôt, ces deux couches ne partagent pas la même base SQLite dans Docker

