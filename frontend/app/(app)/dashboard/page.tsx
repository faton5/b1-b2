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
    </div>
  )
}
