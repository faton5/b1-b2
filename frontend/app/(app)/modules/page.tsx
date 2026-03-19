'use client'

import { useEffect, useState } from "react"
import { BookOpen, Lock, CheckCircle2, Zap, ChevronRight, ChevronLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { modules } from "@/lib/modules-data"

const statusConfig = {
  done: { label: "Terminé", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  available: { label: "Disponible", color: "bg-secondary/20 text-secondary-foreground", icon: BookOpen },
  locked: { label: "Verrouillé", color: "bg-muted text-muted-foreground", icon: Lock },
}

export default function ModulesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [openedSources, setOpenedSources] = useState<string[]>([])
  const [courseRead, setCourseRead] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([])

  const selected = selectedId != null ? modules.find((m) => m.id === selectedId) ?? null : null

  const handleOpenSource = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer")
    setOpenedSources((prev) => (prev.includes(href) ? prev : [...prev, href]))
  }

  const handleMarkRead = () => {
    setCourseRead(true)
  }

  const totalSources = selected ? selected.resources.length : 0
  const totalSteps = selected ? 1 + totalSources : 0
  const doneSources = selected ? openedSources.filter((h) => selected.resources.some((r) => r.href === h)).length : 0
  const stepsDone = selected ? (courseRead ? 1 : 0) + doneSources : 0
  const completed = selected ? stepsDone >= totalSteps && totalSteps > 0 : false

  useEffect(() => {
    if (!selected || !completed) return

    setCompletedModuleIds((prev) => (prev.includes(selected.id) ? prev : [...prev, selected.id]))
    setCelebrate(true)
    const timerId = setTimeout(() => setCelebrate(false), 2000)
    return () => clearTimeout(timerId)
  }, [selected, completed])

  const completedCount = completedModuleIds.length
  const completedRatio = modules.length > 0 ? completedCount / modules.length : 0
  const totalXp = completedModuleIds.reduce((sum, id) => {
    const moduleItem = modules.find((moduleDef) => moduleDef.id === id)
    return sum + (moduleItem?.xp ?? 0)
  }, 0)

  if (!selected) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Modules pédagogiques</h1>
          <p className="text-muted-foreground mt-1">
            Découvre comment utiliser l&apos;IA de façon éclairée, responsable et utile, sans perdre ton esprit critique ni ta capacité à réfléchir.
          </p>
        </div>

        <div className="flex items-center gap-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {completedCount} / {modules.length}
            </p>
            <p className="text-xs text-muted-foreground">modules terminés</p>
          </div>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${completedRatio * 100}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{totalXp} XP</p>
            <p className="text-xs text-muted-foreground">gagnés</p>
          </div>
        </div>

        <div className="space-y-3">
          {modules.map((moduleItem) => {
            const cfg = statusConfig[moduleItem.status as keyof typeof statusConfig]
            const StatusIcon = cfg.icon
            const isLocked = moduleItem.status === "locked"
            const isCompleted = completedModuleIds.includes(moduleItem.id)

            return (
              <button
                key={moduleItem.id}
                type="button"
                onClick={() => {
                  setSelectedId(moduleItem.id)
                  setOpenedSources([])
                  setCourseRead(false)
                  setCelebrate(false)
                }}
                className="w-full text-left"
              >
                <Card
                  className={`transition-shadow border-2 ${
                    isLocked ? "opacity-60 border-border" : "hover:shadow-md border-border"
                  }`}
                >
                  <CardContent className="pt-5 pb-5 flex items-start gap-4">
                    <div className={`size-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <StatusIcon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground leading-snug">{moduleItem.title}</h3>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 border border-green-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Terminé
                            </span>
                          )}
                        </div>
                        {!isLocked && <ChevronRight className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{moduleItem.description}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {moduleItem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground">{moduleItem.duration}</span>
                        <span className="text-xs flex items-center gap-0.5 text-primary font-medium">
                          <Zap className="size-3" />
                          {moduleItem.xp} XP
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const pct = totalSteps > 0 ? Math.round((stepsDone / totalSteps) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center size-8 rounded-full border border-border bg-card hover:bg-muted"
            onClick={() => setSelectedId(null)}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{selected.title}</h1>
            <p className="text-xs text-gray-600">
              Module {selected.id} sur {modules.length} • {selected.duration}
            </p>
          </div>
          <Badge className={completed ? "bg-green-100 text-green-700 border-green-300" : "bg-blue-100 text-blue-700"}>
            {completed ? "Module complété" : `${selected.xp} XP`}
          </Badge>
        </div>
        <div className="mx-auto max-w-4xl px-6 pb-3">
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${completed ? "bg-green-500" : "bg-primary"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        {selected.resources.length > 0 && (
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-100">
            <p className="text-sm font-semibold text-foreground mb-2">
              Étape 1 : ouvrir toutes les sources du module
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {selected.resources.map((resource) => {
                const opened = openedSources.includes(resource.href)
                return (
                  <li key={resource.href}>
                    <button
                      type="button"
                      onClick={() => handleOpenSource(resource.href)}
                      className={`underline underline-offset-2 ${
                        opened ? "text-green-700" : "text-primary"
                      }`}
                    >
                      {opened ? "✓ " : ""}
                      {resource.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        )}

        <Card className="p-6 bg-white border-blue-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3 rounded-2xl overflow-hidden border bg-muted/40 shadow-inner">
              <img
                src={
                  selected.id === 1
                    ? "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800"
                    : selected.id === 2
                      ? "https://images.pexels.com/photos/6772072/pexels-photo-6772072.jpeg?auto=compress&cs=tinysrgb&w=800"
                      : selected.id === 3
                        ? "https://images.pexels.com/photos/6476180/pexels-photo-6476180.jpeg?auto=compress&cs=tinysrgb&w=800"
                        : selected.id === 4
                          ? "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800"
                          : "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
                alt={selected.title}
                className="w-full h-40 md:h-48 object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <BookOpen className="w-3 h-3" />
                Module {selected.id} • Niveau {selected.level}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{selected.title}</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{selected.description}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {selected.sections.map((section, index) => (
            <Card
              key={section.title}
              className="p-5 bg-white border border-border/60 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3 space-y-2">
                    {section.content}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleMarkRead}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
              courseRead ? "border-green-500 text-green-700 bg-green-50" : "border-primary text-primary bg-primary/5"
            }`}
          >
            {courseRead ? "Cours marqué comme lu" : "J'ai lu tout le cours"}
          </button>
        </div>

        {celebrate && (
          <p className="text-center text-lg font-bold text-green-600 animate-bounce">
            🎉 Bravo, tu as complété ce module !
          </p>
        )}
      </main>
    </div>
  )
}
