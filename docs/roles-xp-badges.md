# Documentation des Rôles, de l'XP et des Badges

## Rôles utilisateur

L'application web frontend gère deux rôles :

- `teacher`
- `student`

Les rôles sont stockés dans la table `users` de la base SQLite frontend.

## Compte professeur

### Conditions de création

Un compte professeur :
- doit être créé avec le type `Compte professeur`
- doit utiliser exactement une adresse `@prof.com`

Le contrôle est effectué :
- dans le formulaire d'inscription
- côté serveur dans `signUp`

## Compte élève

### Conditions de création

Un compte élève :
- utilise le type `Compte eleve`
- doit fournir un code élève valide
- le code doit exister dans `student_invite_codes`
- le code ne doit pas déjà avoir été consommé

## Codes d'invitation élève

Les codes élèves :
- sont générés par un professeur connecté
- sont créés via `generateStudentInviteCode`
- prennent la forme `ELEVE-XXXX-XXXX`
- sont stockés dans `student_invite_codes`

Quand un élève crée son compte :
- le code est lié à `used_by_user_id`
- `used_at` est renseigné

## Visibilité des interfaces

### Professeur

Le professeur peut voir :
- le tableau de bord professeur
- la génération de codes élève
- les réponses et journaux visibles dans ce dashboard

### Élève

L'élève :
- ne voit pas le panel prof
- est redirigé vers `/modules` si un accès direct au dashboard prof est tenté

## Système XP

## Calcul du niveau

Le niveau est calculé à partir de l'XP totale :

```text
niveau = floor(xp / 200) + 1
```

`xp_to_next_level` est stocké dans la base frontend.

## Sources d'XP

### Modules

Action :
- `completeModule`

Règles :
- l'XP du module est attribuée une seule fois
- l'état est enregistré dans `module_completions`

Champs persistés :
- `user_id`
- `module_id`
- `module_title`
- `xp_earned`
- `completed_at`

### Quiz

Action :
- `completeQuiz`

Règle de calcul :

```text
xp = score * 5
```

Le score du quiz est enregistré dans `quiz_completions`.

### Mini-jeux

Action :
- `recordGameSession`

Dans l'UI actuelle du jeu `Detective IA` :

```text
xp = score final * 80
```

La partie est enregistrée dans `game_sessions`.

## Mise à jour de l'XP dans l'interface

L'XP visible dans la sidebar est fournie par :

- `XpProvider`
- `useXp()`
- `SidebarXp`

Effets visibles :
- popup `+XP`
- animation de level up
- mise à jour live après module, quiz ou mini-jeu

## Système de badges

Les badges sont définis dans `frontend/lib/badges.ts`.

Leur état est enregistré dans :
- `user_badges`

Chaque badge a :
- un identifiant
- un nom
- une description
- une condition de déblocage
- une récompense XP affichée
- une icône

## Règles de déblocage

### `premier-pas`

Condition :
- gagner plus de 0 XP

### `apprenti`

Condition :
- atteindre le niveau 3

### `detecteur-ia`

Condition :
- terminer au moins 1 partie du mini-jeu

### `quiz-master`

Condition :
- cumuler 10 bonnes réponses au quiz

### `maitre-detecteur`

Condition :
- atteindre le niveau 10

### `en-feu`

Condition :
- atteindre 1000 XP

### `expert-ia`

Condition :
- compléter tous les modules

### `legende`

Condition :
- atteindre le niveau 25

## Synchronisation des badges

Les badges sont recalculés via :
- `syncBadgesForUser(userId)`

La fonction :
- lit l'XP, le niveau, le total quiz, le total de parties et le total de modules
- calcule les badges débloqués
- insère les nouveaux badges dans `user_badges`

## Persistences concernées

Tables frontend liées à la progression :
- `users`
- `module_completions`
- `quiz_completions`
- `game_sessions`
- `user_badges`

## Limites actuelles

- le système XP/badges de l'application web est géré côté frontend SQLite
- il est distinct du modèle backend FastAPI
- les récompenses XP affichées sur les badges sont descriptives, pas automatiquement réinjectées comme bonus séparé lors du déblocage

