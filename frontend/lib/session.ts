import { cookies } from "next/headers"
import sql from "@/lib/db"

export type SessionUser = {
  id: number
  username: string
  email: string
  role: string
  level: number
  xp: number
  avatar: string | null
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  if (!token) return null

  const rows = await sql`
    SELECT u.id, u.username, u.email, u.role, u.level, u.xp, u.avatar
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > CURRENT_TIMESTAMP
    LIMIT 1
  `

  return rows[0] as SessionUser | undefined ?? null
}
