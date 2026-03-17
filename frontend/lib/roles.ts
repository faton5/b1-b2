export function isTeacherEmail(email?: string | null): boolean {
  if (!email) return false
  return email.toLowerCase().endsWith("@prof.com")
}
