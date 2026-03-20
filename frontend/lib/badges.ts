import { modules } from "@/lib/modules-data"
import sql from "@/lib/db"

export type BadgeIconName = "star" | "shield" | "target" | "brain" | "trophy" | "flame" | "zap"

export type BadgeDefinition = {
  id: string
  name: string
  description: string
  requirement: string
  xpReward: number
  icon: BadgeIconName
}

export type BadgeStatus = BadgeDefinition & {
  earned: boolean
  earnedDate: string | null
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "premier-pas",
    name: "Premier Pas",
    description: "Gagner ses premiers XP.",
    requirement: "Gagner au moins 1 XP",
    xpReward: 100,
    icon: "star",
  },
  {
    id: "apprenti",
    name: "Apprenti",
    description: "Atteindre le niveau 3.",
    requirement: "Niveau 3 requis",
    xpReward: 150,
    icon: "shield",
  },
  {
    id: "detecteur-ia",
    name: "Detecteur d'IA",
    description: "Terminer une partie de Detective IA.",
    requirement: "1 partie terminee",
    xpReward: 200,
    icon: "target",
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Cumuler 10 bonnes reponses au quiz.",
    requirement: "10 bonnes reponses cumulees",
    xpReward: 250,
    icon: "brain",
  },
  {
    id: "maitre-detecteur",
    name: "Maitre Detecteur",
    description: "Atteindre le niveau 10.",
    requirement: "Niveau 10 requis",
    xpReward: 500,
    icon: "trophy",
  },
  {
    id: "en-feu",
    name: "En Feu",
    description: "Depasser les 1000 XP.",
    requirement: "1000 XP requis",
    xpReward: 400,
    icon: "flame",
  },
  {
    id: "expert-ia",
    name: "Expert IA",
    description: "Completer tous les modules.",
    requirement: "Tous les modules requis",
    xpReward: 600,
    icon: "zap",
  },
  {
    id: "legende",
    name: "Legende",
    description: "Atteindre le niveau 25.",
    requirement: "Niveau 25 requis",
    xpReward: 1000,
    icon: "trophy",
  },
]

type ProgressSnapshot = {
  xp: number
  level: number
  totalQuizCorrect: number
  totalGames: number
  totalModules: number
}

async function getProgressSnapshot(userId: number): Promise<ProgressSnapshot> {
  const userRows = await sql`
    SELECT xp, level
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `
  const user = userRows[0]

  const quizRows = await sql`
    SELECT COALESCE(SUM(score), 0) AS total_score
    FROM quiz_completions
    WHERE user_id = ${userId}
  `

  const gameRows = await sql`
    SELECT COUNT(*) AS total_games
    FROM game_sessions
    WHERE user_id = ${userId}
  `

  const moduleRows = await sql`
    SELECT COUNT(*) AS total_modules
    FROM module_completions
    WHERE user_id = ${userId}
  `

  return {
    xp: Number(user?.xp ?? 0),
    level: Number(user?.level ?? 1),
    totalQuizCorrect: Number(quizRows[0]?.total_score ?? 0),
    totalGames: Number(gameRows[0]?.total_games ?? 0),
    totalModules: Number(moduleRows[0]?.total_modules ?? 0),
  }
}

function computeUnlockedBadgeIds(snapshot: ProgressSnapshot): string[] {
  const unlocked = new Set<string>()

  if (snapshot.xp > 0) unlocked.add("premier-pas")
  if (snapshot.level >= 3) unlocked.add("apprenti")
  if (snapshot.totalGames >= 1) unlocked.add("detecteur-ia")
  if (snapshot.totalQuizCorrect >= 10) unlocked.add("quiz-master")
  if (snapshot.level >= 10) unlocked.add("maitre-detecteur")
  if (snapshot.xp >= 1000) unlocked.add("en-feu")
  if (snapshot.totalModules >= modules.length) unlocked.add("expert-ia")
  if (snapshot.level >= 25) unlocked.add("legende")

  return [...unlocked]
}

export async function syncBadgesForUser(userId: number): Promise<string[]> {
  const snapshot = await getProgressSnapshot(userId)
  const unlockedBadgeIds = computeUnlockedBadgeIds(snapshot)
  const existingRows = await sql`
    SELECT badge_id
    FROM user_badges
    WHERE user_id = ${userId}
  `
  const existingBadgeIds = new Set(existingRows.map((row) => String(row.badge_id)))
  const newlyEarned: string[] = []

  for (const badgeId of unlockedBadgeIds) {
    if (existingBadgeIds.has(badgeId)) {
      continue
    }

    await sql`
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (${userId}, ${badgeId})
    `
    newlyEarned.push(badgeId)
  }

  return newlyEarned
}

export async function getBadgeStatuses(userId: number): Promise<BadgeStatus[]> {
  await syncBadgesForUser(userId)

  const earnedRows = await sql`
    SELECT badge_id, earned_at
    FROM user_badges
    WHERE user_id = ${userId}
  `

  const earnedMap = new Map<string, string>()
  for (const row of earnedRows) {
    earnedMap.set(String(row.badge_id), String(row.earned_at))
  }

  return BADGE_DEFINITIONS.map((badge) => ({
    ...badge,
    earned: earnedMap.has(badge.id),
    earnedDate: earnedMap.get(badge.id) ?? null,
  }))
}
