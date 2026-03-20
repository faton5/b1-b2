"use server"

import { cookies } from "next/headers"
import { randomBytes } from "crypto"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

const GUEST_COOKIE = "guest_token"

function buildGuestName(): string {
  return "Invite"
}

async function ensureGuest(): Promise<number> {
  const cookieStore = await cookies()
  const token = cookieStore.get(GUEST_COOKIE)?.value

  if (token) {
    const existing = await sql`
      SELECT id FROM guest_students WHERE session_token = ${token} LIMIT 1
    `
    if (existing.length > 0) return existing[0].id as number
  }

  const newToken = randomBytes(24).toString("hex")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  const name = buildGuestName()

  const rows = await sql`
    INSERT INTO guest_students (name, class_code, session_token, expires_at)
    VALUES (${name}, ${null}, ${newToken}, ${expiresAt})
    RETURNING id
  `

  cookieStore.set(GUEST_COOKIE, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return rows[0].id as number
}

export async function recordQuizAnswer(payload: {
  quizId: string
  questionIndex: number
  questionText: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
}) {
  const user = await getSession()
  const guestId = user ? null : await ensureGuest()

  await sql`
    INSERT INTO quiz_answers (
      user_id,
      guest_id,
      quiz_id,
      question_index,
      question_text,
      selected_answer,
      correct_answer,
      is_correct
    )
    VALUES (
      ${user?.id ?? null},
      ${guestId},
      ${payload.quizId},
      ${payload.questionIndex},
      ${payload.questionText},
      ${payload.selectedAnswer},
      ${payload.correctAnswer},
      ${payload.isCorrect}
    )
  `
}
