"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import sql from "@/lib/db"
import { getDefaultPathForRole, isTeacherEmail } from "@/lib/roles"

type AuthActionState = {
  error: string
}

export async function signUp(_: AuthActionState, formData: FormData) {
  const username = String(formData.get("username") || "").trim()
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")
  const accessCode = String(formData.get("accessCode") || "")
    .trim()
    .toUpperCase()
  const requestedRole = formData.get("accountType") === "teacher" ? "teacher" : "student"

  if (!username || !email || !password) {
    return { error: "Tous les champs sont requis." }
  }

  if (requestedRole === "teacher" && !isTeacherEmail(email)) {
    return { error: "Un compte professeur doit obligatoirement utiliser une adresse @prof.com. Gmail, Outlook et les autres domaines sont refuses." }
  }

  let inviteCodeId: number | null = null
  if (requestedRole === "student") {
    if (!accessCode) {
      return { error: "Le code eleve genere par le professeur est requis." }
    }

    const inviteRows = await sql`
      SELECT id
      FROM student_invite_codes
      WHERE code = ${accessCode} AND used_by_user_id IS NULL
      LIMIT 1
    `

    if (inviteRows.length === 0) {
      return { error: "Ce code eleve est invalide ou a deja ete utilise." }
    }

    inviteCodeId = inviteRows[0].id as number
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username} LIMIT 1`
  if (existing.length > 0) {
    return { error: "Cet email ou nom d'utilisateur est deja utilise." }
  }

  const hashed = await bcrypt.hash(password, 10)
  const newUser = await sql`
    INSERT INTO users (username, email, password_hash, role)
    VALUES (${username}, ${email}, ${hashed}, ${requestedRole})
    RETURNING id, role, email
  `

  const userId = newUser[0].id as number

  if (inviteCodeId !== null) {
    await sql`
      UPDATE student_invite_codes
      SET used_by_user_id = ${userId}, used_at = CURRENT_TIMESTAMP
      WHERE id = ${inviteCodeId}
    `
  }

  await createSession(userId)
  redirect(getDefaultPathForRole(newUser[0].role as string, newUser[0].email as string))
}

export async function signIn(_: AuthActionState, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")

  if (!email || !password) {
    return { error: "Tous les champs sont requis." }
  }

  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
  const user = rows[0]
  if (!user) return { error: "Email ou mot de passe incorrect." }

  const valid = await bcrypt.compare(password, user.password_hash as string)
  if (!valid) return { error: "Email ou mot de passe incorrect." }

  await createSession(user.id as number)
  redirect(getDefaultPathForRole(user.role as string | null, user.email as string))
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
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

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
