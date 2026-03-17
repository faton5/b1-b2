"use server"

import { getSession } from "@/lib/session"
import sql from "@/lib/db"

type AwardXpPayload = {
  amount: number
  source?: string
}

type AwardXpResult = {
  xp: number
  level: number
  xpToNextLevel: number
} | null

function computeLevel(xp: number): number {
  if (xp <= 0) return 1
  return Math.floor(xp / 200) + 1
}

export async function awardXp(payload: AwardXpPayload): Promise<AwardXpResult> {
  const amount = Math.floor(payload.amount)
  if (amount <= 0) return null

  const user = await getSession()
  if (!user) return null

  const newXp = user.xp + amount
  const newLevel = computeLevel(newXp)
  const xpToNextLevel = newLevel * 200

  await sql`
    UPDATE users
    SET xp = ${newXp}, level = ${newLevel}, xp_to_next_level = ${xpToNextLevel}
    WHERE id = ${user.id}
  `

  return { xp: newXp, level: newLevel, xpToNextLevel }
}
