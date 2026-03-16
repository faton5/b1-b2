import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { BookOpen, HelpCircle, Gamepad2, Trophy, Star, Zap, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const modules = [
  {
    title: "Qu'est-ce que l'IA ?",
    description: "Comprends les bases de l'intelligence artificielle et comment elle génère du contenu.",
    href: "/modules",
    icon: BookOpen,
    xp: 100,
    done: true,
  },
  {
    title: "Deepfakes & images",
    description: "Apprends à repérer les images et vidéos manipulées par l'IA.",
    href: "/modules",
    icon: BookOpen,
    xp: 150,
    done: false,
  },
  {
    title: "Textes générés par IA",
    description: "Détecte les textes écrits automatiquement et les indices qui les trahissent.",
    href: "/modules",
    icon: BookOpen,
    xp: 150,
    done: false,
  },
]

const quickActions = [
  { label: "Faire un quiz", href: "/quiz", icon: HelpCircle, color: "bg-primary/10 text-primary" },
  { label: "Jouer", href: "/games", icon: Gamepad2, color: "bg-secondary/20 text-secondary-foreground" },
  { label: "Mes badges", href: "/badges", icon: Trophy, color: "bg-accent/10 text-accent" },
]

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const xpToNextLevel = user.level * 200
  const xpPercent = Math.min(100, Math.round((user.xp / xpToNextLevel) * 100))

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Bonjour, {user.username} !
        </h1>
        <p className="text-muted-foreground mt-1">Voici ton tableau de bord. Continue ta progression.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Star className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Niveau {user.level}</p>
              <p className="text-sm text-muted-foreground">Ton niveau actuel</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Zap className="size-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{user.xp} XP</p>
              <p className="text-sm text-muted-foreground">{xpToNextLevel - user.xp} XP avant le prochain niveau</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Target className="size-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{xpPercent}%</p>
              <p className="text-sm text-muted-foreground">Progression vers niveau {user.level + 1}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress bar */}
      <Card>
        <CardContent className="pt-5 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Progression — Niveau {user.level}</span>
            <span className="text-muted-foreground">{user.xp} / {xpToNextLevel} XP</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Plus que {xpToNextLevel - user.xp} XP pour atteindre le niveau {user.level + 1} !</p>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="pt-5 flex items-center gap-4">
                  <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="size-5" />
                  </div>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">{label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Modules récents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Modules</h2>
          <Link href="/modules" className="text-sm text-primary hover:underline font-medium">Voir tout</Link>
        </div>
        <div className="space-y-3">
          {modules.map((mod) => (
            <Link key={mod.title} href={mod.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="pt-4 pb-4 flex items-center gap-4">
                  <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${mod.done ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <BookOpen className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">{mod.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground flex-shrink-0">
                    <Zap className="size-3 text-primary" />
                    {mod.xp} XP
                  </div>
                  {mod.done && (
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                      Terminé
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
