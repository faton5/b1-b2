export type UserRole = "teacher" | "student"

type RoleLikeUser = {
  role?: string | null
  email?: string | null
} | null | undefined

export function isTeacherEmail(email?: string | null): boolean {
  if (!email) return false
  return /^[^@\s]+@prof\.com$/i.test(email.trim())
}

export function normalizeUserRole(role?: string | null, email?: string | null): UserRole {
  if (role === "teacher" || role === "student") {
    return role
  }

  return isTeacherEmail(email) ? "teacher" : "student"
}

export function isTeacher(user?: RoleLikeUser): boolean {
  if (!user) return false
  return normalizeUserRole(user.role, user.email) === "teacher"
}

export function getDefaultPathForRole(role?: string | null, email?: string | null): string {
  return normalizeUserRole(role, email) === "teacher" ? "/dashboard" : "/modules"
}
