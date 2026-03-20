import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateStudentInviteCode } from "@/lib/admin.actions"
import sql from "@/lib/db"
import { isTeacher } from "@/lib/roles"
import { getSession } from "@/lib/session"

type DashboardRow = Record<string, unknown>

function buildAccountLabel(row: DashboardRow) {
  const username = row.username as string | null
  const email = row.email as string | null
  const guestName = row.guest_name as string | null
  const guestId = row.guest_id as number | null
  const classCode = row.class_code as string | null

  if (username) return username
  if (email) return email
  if (guestName) return classCode ? `${guestName} (${classCode})` : guestName
  if (guestId) return `Invite #${guestId}`
  return "Invite"
}

function CollapsibleText({
  text,
  tone = "default",
}: {
  text: string
  tone?: "default" | "error"
}) {
  const normalized = text.replace(/\s+/g, " ").trim()
  const preview = normalized.length > 140 ? `${normalized.slice(0, 140).trim()}...` : normalized
  const bodyClassName =
    tone === "error"
      ? "rounded-lg border border-red-200 bg-red-50 px-3 py-2 whitespace-pre-wrap text-red-700"
      : "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 whitespace-pre-wrap text-slate-700"

  if (normalized.length <= 140) {
    return <div className={bodyClassName}>{text}</div>
  }

  return (
    <details className="group min-w-[260px]">
      <summary className="list-none cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 marker:hidden">
        <div className="flex items-start justify-between gap-3 text-slate-700">
          <span>{preview}</span>
          <span className="text-xs font-medium text-primary group-open:hidden">Voir plus</span>
          <span className="hidden text-xs font-medium text-primary group-open:inline">Replier</span>
        </div>
      </summary>
      <div className={`${bodyClassName} mt-2`}>{text}</div>
    </details>
  )
}

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) redirect("/login")
  if (!isTeacher(user)) redirect("/modules")

  const inviteCodes = await sql`
    SELECT
      sic.id,
      sic.code,
      sic.created_at,
      sic.used_at,
      u.username,
      u.email
    FROM student_invite_codes sic
    LEFT JOIN users u ON u.id = sic.used_by_user_id
    WHERE sic.teacher_user_id = ${user.id}
    ORDER BY sic.created_at DESC
    LIMIT 50
  `

  const answers = await sql`
    SELECT
      qa.id,
      qa.user_id,
      qa.quiz_id,
      qa.question_index,
      qa.question_text,
      qa.selected_answer,
      qa.correct_answer,
      qa.is_correct,
      qa.answered_at,
      u.username,
      u.email,
      gs.id AS guest_id,
      gs.name AS guest_name,
      gs.class_code
    FROM quiz_answers qa
    LEFT JOIN users u ON u.id = qa.user_id
    LEFT JOIN guest_students gs ON gs.id = qa.guest_id
    ORDER BY qa.answered_at DESC
    LIMIT 200
  `

  const chatTranscripts = await sql`
    SELECT
      ct.id,
      ct.user_id,
      ct.user_message,
      ct.assistant_message,
      ct.model,
      ct.created_at,
      u.username,
      u.email
    FROM chat_transcripts ct
    LEFT JOIN users u ON u.id = ct.user_id
    ORDER BY ct.created_at DESC
    LIMIT 200
  `

  const chatFailures = await sql`
    SELECT
      cf.id,
      cf.request_id,
      cf.user_id,
      cf.user_message,
      cf.model,
      cf.attempt,
      cf.status_code,
      cf.error_message,
      cf.provider_message,
      cf.created_at,
      u.username,
      u.email
    FROM chat_failures cf
    LEFT JOIN users u ON u.id = cf.user_id
    ORDER BY cf.created_at DESC
    LIMIT 100
  `

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <div className="mx-auto max-w-6xl space-y-6 px-8 py-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord enseignant</h1>
          <p className="mt-1 text-slate-600">
            Suivi des comptes eleves, des quiz et des reponses generees par l&apos;IA.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-slate-200 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Codes eleves</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">Generer un nouvel identifiant eleve</p>
                  <p className="text-sm text-slate-600">
                    Partage ensuite ce code avec l&apos;eleve pour qu&apos;il puisse creer son compte.
                  </p>
                </div>
                <form action={generateStudentInviteCode}>
                  <Button type="submit">Generer un code</Button>
                </form>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-600">
                      <th className="py-2 pr-3">Code</th>
                      <th className="py-2 pr-3">Cree le</th>
                      <th className="py-2 pr-3">Statut</th>
                      <th className="py-2">Utilise par</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inviteCodes.map((row) => (
                      <tr key={row.id as number} className="border-b border-slate-100 align-top">
                        <td className="py-2 pr-3 font-mono text-xs font-semibold text-slate-900">
                          {row.code as string}
                        </td>
                        <td className="py-2 pr-3 whitespace-nowrap text-slate-600">{row.created_at as string}</td>
                        <td className="py-2 pr-3">
                          {row.used_at ? (
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                              Utilise
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                              Disponible
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-slate-700">
                          {(row.username as string | null) || (row.email as string | null) || "-"}
                        </td>
                      </tr>
                    ))}
                    {inviteCodes.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-500">
                          Aucun code eleve genere pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Resume rapide</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Codes disponibles</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {inviteCodes.filter((row) => !row.used_at).length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Reponses quiz</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{answers.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Logs IA</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{chatTranscripts.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Dernieres reponses ({answers.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Eleve</th>
                  <th className="py-2 pr-3">Question</th>
                  <th className="py-2 pr-3">Reponse</th>
                  <th className="py-2 pr-3">Correction</th>
                  <th className="py-2">Resultat</th>
                </tr>
              </thead>
              <tbody>
                {answers.map((row) => (
                  <tr key={row.id as number} className="border-b border-slate-100 align-top">
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-600">{row.answered_at as string}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-900">{buildAccountLabel(row)}</td>
                    <td className="py-2 pr-3 min-w-[260px]">{row.question_text as string}</td>
                    <td className="py-2 pr-3">{row.selected_answer as string}</td>
                    <td className="py-2 pr-3">{row.correct_answer as string}</td>
                    <td className="py-2">
                      {Number(row.is_correct) === 1 ? (
                        <span className="font-medium text-emerald-700">Correct</span>
                      ) : (
                        <span className="font-medium text-red-700">Faux</span>
                      )}
                    </td>
                  </tr>
                ))}
                {answers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">
                      Aucune reponse pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">
              Derniers echanges chat ({chatTranscripts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Compte</th>
                  <th className="py-2 pr-3">Question</th>
                  <th className="py-2 pr-3">Reponse</th>
                  <th className="py-2">Modele</th>
                </tr>
              </thead>
              <tbody>
                {chatTranscripts.map((row) => (
                  <tr key={row.id as number} className="border-b border-slate-100 align-top">
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-600">{row.created_at as string}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-900">{buildAccountLabel(row)}</td>
                    <td className="py-2 pr-3">
                      <CollapsibleText text={row.user_message as string} />
                    </td>
                    <td className="py-2 pr-3">
                      <CollapsibleText text={row.assistant_message as string} />
                    </td>
                    <td className="py-2 whitespace-nowrap text-slate-600">{(row.model as string | null) || "-"}</td>
                  </tr>
                ))}
                {chatTranscripts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      Aucun echange pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">
              Dernieres erreurs chat ({chatFailures.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Ref</th>
                  <th className="py-2 pr-3">Compte</th>
                  <th className="py-2 pr-3">Modele</th>
                  <th className="py-2 pr-3">Statut</th>
                  <th className="py-2 pr-3">Tentative</th>
                  <th className="py-2 pr-3">Erreur</th>
                  <th className="py-2">Question</th>
                </tr>
              </thead>
              <tbody>
                {chatFailures.map((row) => (
                  <tr key={row.id as number} className="border-b border-slate-100 align-top">
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-600">{row.created_at as string}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{row.request_id as string}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-900">{buildAccountLabel(row)}</td>
                    <td className="py-2 pr-3 whitespace-nowrap text-slate-600">{(row.model as string | null) || "-"}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{(row.status_code as number | null) ?? "-"}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{row.attempt as number}</td>
                    <td className="py-2 pr-3">
                      <CollapsibleText
                        text={((row.error_message as string) || (row.provider_message as string | null) || "-") as string}
                        tone="error"
                      />
                    </td>
                    <td className="py-2">
                      <CollapsibleText text={((row.user_message as string | null) || "-") as string} />
                    </td>
                  </tr>
                ))}
                {chatFailures.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-500">
                      Aucune erreur chat pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
