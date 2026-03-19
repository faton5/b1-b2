import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/session"
import sql from "@/lib/db"
import { isTeacherEmail } from "@/lib/roles"

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) redirect("/login")
  if (!isTeacherEmail(user.email)) redirect("/")

  const answers = await sql`
    SELECT
      qa.id,
      qa.quiz_id,
      qa.question_index,
      qa.question_text,
      qa.selected_answer,
      qa.correct_answer,
      qa.is_correct,
      qa.answered_at,
      gs.id AS guest_id,
      gs.class_code
    FROM quiz_answers qa
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
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord enseignant</h1>
        <p className="text-muted-foreground mt-1">Toutes les reponses des eleves (quiz).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dernieres reponses ({answers.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
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
                <tr key={row.id as number} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">{row.answered_at as string}</td>
                  <td className="py-2 pr-3 whitespace-nowrap">Invite #{row.guest_id as number}</td>
                  <td className="py-2 pr-3 min-w-[260px]">{row.question_text as string}</td>
                  <td className="py-2 pr-3">{row.selected_answer as string}</td>
                  <td className="py-2 pr-3">{row.correct_answer as string}</td>
                  <td className="py-2">
                    {Number(row.is_correct) === 1 ? (
                      <span className="text-primary font-medium">Correct</span>
                    ) : (
                      <span className="text-destructive font-medium">Faux</span>
                    )}
                  </td>
                </tr>
              ))}
              {answers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    Aucune reponse pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Derniers echanges chat ({chatTranscripts.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Compte</th>
                <th className="py-2 pr-3">Question</th>
                <th className="py-2 pr-3">Reponse</th>
                <th className="py-2">Modele</th>
              </tr>
            </thead>
            <tbody>
              {chatTranscripts.map((row) => (
                <tr key={row.id as number} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">
                    {row.created_at as string}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {(row.username as string | null) || (row.user_id ? `Invite #${row.user_id}` : "Invite")}
                  </td>
                  <td className="py-2 pr-3 min-w-[260px] whitespace-pre-wrap">
                    {row.user_message as string}
                  </td>
                  <td className="py-2 pr-3 min-w-[260px] whitespace-pre-wrap">
                    {row.assistant_message as string}
                  </td>
                  <td className="py-2 text-muted-foreground whitespace-nowrap">
                    {(row.model as string | null) || "-"}
                  </td>
                </tr>
              ))}
              {chatTranscripts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Aucun echange pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dernieres erreurs chat ({chatFailures.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
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
                <tr key={row.id as number} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">
                    {row.created_at as string}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap font-mono text-xs">
                    {row.request_id as string}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {(row.username as string | null) || (row.user_id ? `Invite #${row.user_id}` : "Invite")}
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">
                    {(row.model as string | null) || "-"}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {(row.status_code as number | null) ?? "-"}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">{row.attempt as number}</td>
                  <td className="py-2 pr-3 min-w-[260px] whitespace-pre-wrap text-destructive">
                    {(row.error_message as string) || (row.provider_message as string | null) || "-"}
                  </td>
                  <td className="py-2 min-w-[260px] whitespace-pre-wrap">
                    {(row.user_message as string | null) || "-"}
                  </td>
                </tr>
              ))}
              {chatFailures.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-muted-foreground">
                    Aucune erreur chat pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
