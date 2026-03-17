"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import sql from "@/lib/db"
import { isTeacherEmail } from "@/lib/roles"

type AuthActionState = {
  error: string
}

export async function signUp(_: AuthActionState, formData: FormData) {
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!username || !email || !password) {
    return { error: "Tous les champs sont requis." }
  }

  if (!isTeacherEmail(email)) {
    return { error: "Compte enseignant requis (@prof.com)." }
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username} LIMIT 1`
  if (existing.length > 0) {
    return { error: "Cet email ou nom d'utilisateur est déjà utilisé." }
  }

  const hashed = await bcrypt.hash(password, 10)
  const newUser = await sql`
    INSERT INTO users (username, email, password_hash)
    VALUES (${username}, ${email}, ${hashed})
    RETURNING id
  `
  const userId = newUser[0].id
  await createSession(userId)
  redirect("/dashboard")
}

export async function signIn(_: AuthActionState, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Tous les champs sont requis." }
  }

  if (!isTeacherEmail(email)) {
    return { error: "Acces reserve aux enseignants (@prof.com)." }
  }

  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
  const user = rows[0]
  if (!user) return { error: "Email ou mot de passe incorrect." }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return { error: "Email ou mot de passe incorrect." }

  await createSession(user.id)
  redirect("/dashboard")
}

export async function signOut() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  if (token) {
    await sql`DELETE FROM sessions WHERE token = ${token}`
  }
  cookieStore.delete("session_token")
  redirect("/login")
}

async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 jours

  await sql`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt})
  `

  const cookieStore = await cookies()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })
}
