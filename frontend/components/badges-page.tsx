import Link from "next/link"
import { Brain, ChevronLeft, Flame, Lock, Shield, Star, Target, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { BadgeIconName, BadgeStatus } from "@/lib/badges"

type BadgesPageProps = {
  totalXp: number
  earnedBadges: BadgeStatus[]
  lockedBadges: BadgeStatus[]
}

const iconMap: Record<BadgeIconName, typeof Trophy> = {
  star: Star,
  shield: Shield,
  target: Target,
  brain: Brain,
  trophy: Trophy,
  flame: Flame,
  zap: Zap,
}

function formatEarnedDate(value: string | null) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function BadgesPage({ totalXp, earnedBadges, lockedBadges }: BadgesPageProps) {
  const allBadges = [...earnedBadges, ...lockedBadges]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-amber-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Button asChild variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
            <Link href="/modules" aria-label="Retour aux modules">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Badges & Recompenses</h1>
            <p className="text-sm text-slate-600">Voir tous tes succes et defis</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-sky-200 bg-white/95 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Badges obtenus</p>
                <p className="mt-2 text-4xl font-bold text-sky-700">{earnedBadges.length}</p>
                <p className="mt-1 text-xs text-slate-500">sur {allBadges.length}</p>
              </div>
              <Trophy className="h-12 w-12 text-sky-300" />
            </div>
          </Card>

          <Card className="border-violet-200 bg-white/95 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">XP gagnes</p>
                <p className="mt-2 text-4xl font-bold text-violet-700">{totalXp.toLocaleString("fr-FR")}</p>
                <p className="mt-1 text-xs text-slate-500">XP totaux</p>
              </div>
              <Zap className="h-12 w-12 text-violet-300" />
            </div>
          </Card>

          <Card className="border-amber-200 bg-white/95 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">A debloquer</p>
                <p className="mt-2 text-4xl font-bold text-amber-700">{lockedBadges.length}</p>
                <p className="mt-1 text-xs text-slate-500">badges disponibles</p>
              </div>
              <Lock className="h-12 w-12 text-amber-300" />
            </div>
          </Card>
        </div>

        <div className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-slate-900">Badges Obtenus ({earnedBadges.length})</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {earnedBadges.map((badge) => {
              const Icon = iconMap[badge.icon]
              const earnedDate = formatEarnedDate(badge.earnedDate)

              return (
                <Card
                  key={badge.id}
                  className="cursor-pointer border-2 border-yellow-200 bg-white/95 p-6 text-center shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-sm">
                    <Icon className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="mb-2 font-bold text-slate-900">{badge.name}</h3>
                  <p className="mb-3 text-sm text-slate-700">{badge.description}</p>
                  <div className="mb-3 flex items-center justify-center gap-1 text-sm font-semibold text-yellow-600">
                    <Zap className="h-4 w-4" />
                    +{badge.xpReward} XP
                  </div>
                  <p className="mt-3 border-t border-yellow-100 pt-3 text-xs text-slate-500">
                    {earnedDate ? `Obtenu le ${earnedDate}` : "Badge debloque"}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center gap-2">
            <Lock className="h-6 w-6 text-slate-400" />
            <h2 className="text-2xl font-bold text-slate-900">Badges a debloquer ({lockedBadges.length})</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {lockedBadges.map((badge) => {
              const Icon = iconMap[badge.icon]

              return (
                <Card
                  key={badge.id}
                  className="cursor-not-allowed border-2 border-slate-200 bg-white/90 p-6 text-center opacity-70"
                >
                  <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <Icon className="h-8 w-8 text-slate-500" />
                    <Lock className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-white p-0.5 text-slate-500" />
                  </div>
                  <h3 className="mb-2 font-bold text-slate-800">{badge.name}</h3>
                  <p className="mb-3 text-sm text-slate-700">{badge.description}</p>
                  <div className="mb-3 flex items-center justify-center gap-1 text-sm font-semibold text-slate-600">
                    <Zap className="h-4 w-4" />
                    +{badge.xpReward} XP
                  </div>
                  <p className="mt-3 border-t border-slate-200 pt-3 text-xs font-medium text-slate-600">
                    {badge.requirement}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

        <Card className="mt-12 border-slate-200 bg-white/95 p-8 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-slate-900">Conseils pour debloquer plus de badges</h3>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 font-bold text-sky-600">-</span>
              <span className="text-slate-700">Complete les modules pedagogiques restants pour debloquer "Expert IA"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 font-bold text-sky-600">-</span>
              <span className="text-slate-700">Termine des quiz avec de bonnes reponses pour debloquer "Quiz Master"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 font-bold text-sky-600">-</span>
              <span className="text-slate-700">Progresse vers le niveau 10 pour debloquer "Maitre Detecteur"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 font-bold text-sky-600">-</span>
              <span className="text-slate-700">Joue a Detective IA et cumule de l'XP pour atteindre les badges avances</span>
            </li>
          </ul>
        </Card>

        <div className="mt-8 pb-8">
          <Button asChild className="w-full bg-slate-900 py-6 text-lg text-white hover:bg-slate-800">
            <Link href="/modules">Continuer l&apos;aventure</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
