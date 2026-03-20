"use server"

import { getSession } from "@/lib/session"
import sql from "@/lib/db"
import { syncBadgesForUser } from "@/lib/badges"

type AwardXpPayload = {
  amount: number
  source?: string
}

type ProgressResult = {
  xp: number
  level: number
  xpToNextLevel: number
  xpEarned: number
  newlyEarnedBadgeIds: string[]
} | null

type CompleteModulePayload = {
  moduleId: number
  moduleTitle: string
  xpAward: number
}

type CompleteQuizPayload = {
  quizId: string
  score: number
}

type RecordGamePayload = {
  gameId: string
  score: number
  totalRounds: number
  xpAward: number
}

function computeLevel(xp: number): number {
  if (xp <= 0) return 1
  return Math.floor(xp / 200) + 1
}

async function applyXpToCurrentUser(amount: number): Promise<ProgressResult> {
  const xpEarned = Math.floor(amount)
  if (xpEarned <= 0) return null

  const user = await getSession()
  if (!user) return null

  const newXp = user.xp + xpEarned
  const newLevel = computeLevel(newXp)
  const xpToNextLevel = newLevel * 200

  await sql`
    UPDATE users
    SET xp = ${newXp}, level = ${newLevel}, xp_to_next_level = ${xpToNextLevel}
    WHERE id = ${user.id}
  `

  const newlyEarnedBadgeIds = await syncBadgesForUser(user.id)

  return {
    xp: newXp,
    level: newLevel,
    xpToNextLevel,
    xpEarned,
    newlyEarnedBadgeIds,
  }
}

export async function awardXp(payload: AwardXpPayload): Promise<ProgressResult> {
  const amount = Math.floor(payload.amount)
  if (amount <= 0) return null
  return applyXpToCurrentUser(amount)
}

export async function getModuleProgress(): Promise<number[]> {
  const user = await getSession()
  if (!user) return []

  const rows = await sql`
    SELECT module_id
    FROM module_completions
    WHERE user_id = ${user.id}
    ORDER BY module_id ASC
  `

  return rows.map((row) => Number(row.module_id))
}

export async function completeModule(payload: CompleteModulePayload): Promise<ProgressResult> {
  const user = await getSession()
  if (!user) return null

  const existingRows = await sql`
    SELECT id
    FROM module_completions
    WHERE user_id = ${user.id} AND module_id = ${payload.moduleId}
    LIMIT 1
  `

  if (existingRows.length > 0) {
    return null
  }

  await sql`
    INSERT INTO module_completions (user_id, module_id, module_title, xp_earned)
    VALUES (${user.id}, ${payload.moduleId}, ${payload.moduleTitle}, ${payload.xpAward})
  `

  return applyXpToCurrentUser(payload.xpAward)
}

export async function completeQuiz(payload: CompleteQuizPayload): Promise<ProgressResult> {
  const user = await getSession()
  if (!user) return null

  const xpAward = Math.max(0, Math.floor(payload.score) * 5)

  await sql`
    INSERT INTO quiz_completions (user_id, quiz_id, score, xp_earned)
    VALUES (${user.id}, ${payload.quizId}, ${payload.score}, ${xpAward})
  `

  if (xpAward <= 0) {
    await syncBadgesForUser(user.id)
    return null
  }

  return applyXpToCurrentUser(xpAward)
}

export async function recordGameSession(payload: RecordGamePayload): Promise<ProgressResult> {
  const user = await getSession()
  if (!user) return null

  await sql`
    INSERT INTO game_sessions (user_id, guest_id, game_id, score, total_rounds, xp_earned)
    VALUES (${user.id}, ${null}, ${payload.gameId}, ${payload.score}, ${payload.totalRounds}, ${payload.xpAward})
  `

  if (payload.xpAward <= 0) {
    await syncBadgesForUser(user.id)
    return null
  }

  return applyXpToCurrentUser(payload.xpAward)
}
