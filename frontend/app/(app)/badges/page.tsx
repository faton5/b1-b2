import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Trophy, Lock, Star, BookOpen, HelpCircle, Gamepad2, Zap, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const badges = [
  {
    id: 1,
    title: "Premier pas",
    description: "Compléter ton premier module",
    icon: BookOpen,
    color: "text-primary bg-primary/10",
    unlocked: true,
  },
  {
    id: 2,
    title: "Quiz Master",
    description: "Obtenir 100% à un quiz",
    icon: HelpCircle,
    color: "text-secondary-foreground bg-secondary/20",
    unlocked: true,
  },
  {
    id: 3,
    title: "Détecteur",
    description: "Réussir 5 rondes consécutives dans Spot the Fake",
    icon: ShieldCheck,
    color: "text-accent bg-accent/10",
    unlocked: false,
  },
  {
    id: 4,
    title: "Gamer IA",
    description: "Terminer 3 parties de mini-jeux",
    icon: Gamepad2,
    color: "text-primary bg-primary/10",
    unlocked: false,
  },
  {
    id: 5,
    title: "Érudit",
    description: "Compléter tous les modules disponibles",
    icon: Star,
    color: "text-yellow-600 bg-yellow-100",
    unlocked: false,
  },
  {
    id: 6,
    title: "XP Hunter",
    description: "Atteindre 1000 XP",
    icon: Zap,
    color: "text-orange-600 bg-orange-100",
    unlocked: false,
  },
  {
    id: 7,
    title: "Champion",
    description: "Atteindre le niveau 10",
    icon: Trophy,
    color: "text-yellow-600 bg-yellow-100",
    unlocked: false,
  },
]

export default async function BadgesPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const unlocked = badges.filter((b) => b.unlocked).length

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Badges & récompenses</h1>
        <p className="text-muted-foreground mt-1">Débloque des badges en progressant dans DetectIA.</p>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Trophy className="size-6 text-primary" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{unlocked} / {badges.length} badges débloqués</p>
          <p className="text-sm text-muted-foreground">Continue ta progression pour en obtenir plus !</p>
        </div>
        <div className="flex-1 ml-4">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(unlocked / badges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon
          return (
            <Card
              key={badge.id}
              className={cn(
                "transition-shadow",
                badge.unlocked ? "hover:shadow-md" : "opacity-50"
              )}
            >
              <CardContent className="pt-5 pb-5 flex flex-col items-center text-center gap-3">
                <div className={cn(
                  "size-14 rounded-2xl flex items-center justify-center",
                  badge.unlocked ? badge.color : "bg-muted text-muted-foreground"
                )}>
                  {badge.unlocked
                    ? <Icon className="size-7" />
                    : <Lock className="size-6" />
                  }
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{badge.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
                </div>
                {badge.unlocked && (
                  <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full">
                    Débloqué
                  </span>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
