"use server"

import { randomBytes } from "crypto"
import { revalidatePath } from "next/cache"
import sql from "@/lib/db"
import { isTeacher } from "@/lib/roles"
import { getSession } from "@/lib/session"

function buildInviteCode() {
  const raw = randomBytes(4).toString("hex").toUpperCase()
  return `ELEVE-${raw.slice(0, 4)}-${raw.slice(4)}`
}

export async function generateStudentInviteCode() {
  const user = await getSession()
  if (!isTeacher(user)) {
    return
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = buildInviteCode()
    const existing = await sql`SELECT id FROM student_invite_codes WHERE code = ${code} LIMIT 1`
    if (existing.length > 0) {
      continue
    }

    await sql`
      INSERT INTO student_invite_codes (code, teacher_user_id)
      VALUES (${code}, ${user.id})
    `
    revalidatePath("/dashboard")
    return
  }

  throw new Error("Impossible de generer un code eleve unique.")
}
