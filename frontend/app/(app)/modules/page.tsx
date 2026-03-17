"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Lock, CheckCircle2, Zap, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { awardXp } from "@/lib/progression.actions"
import { useXp } from "@/lib/xp-context"

const modules = [
  {
    id: 1,
    title: "Qu'est-ce que l'IA générative ?",
    description: "Découvre ce qu'est l'intelligence artificielle, comment elle fonctionne et pourquoi elle peut être utilisée pour créer de fausses informations.",
    xp: 100,
    duration: "10 min",
    level: 1,
    status: "done",
    tags: ["Introduction", "Bases"],
  },
  {
    id: 2,
    title: "Deepfakes : images et vidéos",
    description: "Apprends à identifier les images et vidéos manipulées par des algorithmes d'IA, et les indices visuels qui les trahissent.",
    xp: 150,
    duration: "15 min",
    level: 1,
    status: "available",
    tags: ["Images", "Vidéos"],
  },
  {
    id: 3,
    title: "Textes générés par IA",
    description: "Détecte les articles, posts et messages écrits automatiquement par des modèles de langage comme ChatGPT.",
    xp: 150,
    duration: "15 min",
    level: 2,
    status: "available",
    tags: ["Texte", "ChatGPT"],
  },
  {
    id: 4,
    title: "Audio et voix synthétiques",
    description: "Comprends comment l'IA peut cloner une voix et créer de faux enregistrements audio convaincants.",
    xp: 200,
    duration: "20 min",
    level: 3,
    status: "locked",
    tags: ["Audio", "Clonage vocal"],
  },
  {
    id: 5,
    title: "Désinformation à grande échelle",
    description: "Explore comment les fausses informations générées par IA se propagent sur les réseaux sociaux et leur impact sur la société.",
    xp: 250,
    duration: "20 min",
    level: 4,
    status: "locked",
    tags: ["Société", "Réseaux sociaux"],
  },
]

const statusConfig = {
  done: { label: "Terminé", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  available: { label: "Disponible", color: "bg-secondary/20 text-secondary-foreground", icon: BookOpen },
  locked: { label: "Verrouillé", color: "bg-muted text-muted-foreground", icon: Lock },
}

export default function ModulesPage() {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const { addXp } = useXp()
  const [moduleStates, setModuleStates] = useState(() =>
    modules.map((mod) => ({ ...mod }))
  )
  const [awardedIds, setAwardedIds] = useState(() => new Set<number>())

  const completedCount = useMemo(() => {
    return moduleStates.filter((mod) => mod.status === "done").length
  }, [moduleStates])

  const totalXp = useMemo(() => {
    return moduleStates.reduce((sum, mod) => (mod.status === "done" ? sum + mod.xp : sum), 0)
  }, [moduleStates])

  function handleCompleteModule(moduleId: number) {
    const module = moduleStates.find((mod) => mod.id === moduleId)
    if (!module || module.status !== "available") return
    if (awardedIds.has(moduleId)) return

    setModuleStates((prev) =>
      prev.map((mod) => (mod.id === moduleId ? { ...mod, status: "done" } : mod))
    )

    setAwardedIds((prev) => {
      const next = new Set(prev)
      next.add(moduleId)
      return next
    })

    addXp(module.xp)
    startTransition(() => {
      awardXp({ amount: module.xp, source: `module:${module.id}` })
      router.refresh()
    })
  }
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Modules pédagogiques</h1>
        <p className="text-muted-foreground mt-1">Progresse dans les modules pour gagner de l'XP et débloquer de nouveaux contenus.</p>
      </div>

      {/* Progress summary */}
      <div className="flex items-center gap-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{completedCount} / {modules.length}</p>
          <p className="text-xs text-muted-foreground">modules terminés</p>
        </div>
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(completedCount / modules.length) * 100}%` }} />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{totalXp} XP</p>
          <p className="text-xs text-muted-foreground">gagnés</p>
        </div>
      </div>

      {/* Module list */}
      <div className="space-y-3">
        {moduleStates.map((mod) => {
          const cfg = statusConfig[mod.status as keyof typeof statusConfig]
          const StatusIcon = cfg.icon
          const isLocked = mod.status === "locked"
          const canComplete = mod.status === "available"

          return (
            <Card
              key={mod.id}
              className={`transition-shadow ${isLocked ? "opacity-60" : "hover:shadow-md"}`}
            >
              <CardContent className="pt-5 pb-5 flex items-start gap-4">
                <div className={`size-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                  <StatusIcon className="size-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground leading-snug">{mod.title}</h3>
                    {!isLocked && (
                      <ChevronRight className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {mod.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground">{mod.duration}</span>
                    <span className="text-xs flex items-center gap-0.5 text-primary font-medium">
                      <Zap className="size-3" />
                      {mod.xp} XP
                    </span>
                  </div>
                </div>
                {canComplete && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleCompleteModule(mod.id)}
                      className="text-xs font-semibold text-primary hover:text-primary/80"
                    >
                      Terminer
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
