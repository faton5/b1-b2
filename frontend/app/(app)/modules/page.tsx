'use client'

import { useEffect, useState, useTransition } from "react"
import { BookOpen, Lock, CheckCircle2, Zap, ChevronRight, ChevronLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { modules } from "@/lib/modules-data"
import { completeModule, getModuleProgress } from "@/lib/progression.actions"
import { useXp } from "@/lib/xp-context"

const statusConfig = {
  done: { label: "Termine", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  available: { label: "Disponible", color: "bg-secondary/20 text-secondary-foreground", icon: BookOpen },
  locked: { label: "Verrouille", color: "bg-muted text-muted-foreground", icon: Lock },
}

export default function ModulesPage() {
  const { addXp } = useXp()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [openedSources, setOpenedSources] = useState<string[]>([])
  const [courseRead, setCourseRead] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([])
  const [syncedModuleIds, setSyncedModuleIds] = useState<number[]>([])
  const [isSyncingModule, startSyncModule] = useTransition()

  const selected = selectedId != null ? modules.find((m) => m.id === selectedId) ?? null : null
  const selectedAlreadyCompleted = selected ? completedModuleIds.includes(selected.id) : false

  const handleOpenSource = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer")
    setOpenedSources((prev) => (prev.includes(href) ? prev : [...prev, href]))
  }

  const handleMarkRead = () => {
    setCourseRead(true)
  }

  const totalSources = selected ? selected.resources.length : 0
  const totalSteps = selected ? 1 : 0
  const doneSources = selected ? openedSources.filter((h) => selected.resources.some((r) => r.href === h)).length : 0
  const stepsDone = selected ? (selectedAlreadyCompleted || courseRead ? 1 : 0) : 0
  const completed = selected ? selectedAlreadyCompleted || courseRead : false

  useEffect(() => {
    let cancelled = false

    getModuleProgress()
      .then((moduleIds) => {
        if (cancelled) return
        setCompletedModuleIds(moduleIds)
        setSyncedModuleIds(moduleIds)
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selected || !completed || completedModuleIds.includes(selected.id)) return

    setCompletedModuleIds((prev) => [...prev, selected.id])
    setCelebrate(true)
    const timerId = setTimeout(() => setCelebrate(false), 2000)
    return () => clearTimeout(timerId)
  }, [completed, completedModuleIds, selected])

  useEffect(() => {
    if (!selected || !completed || syncedModuleIds.includes(selected.id)) return

    startSyncModule(async () => {
      const result = await completeModule({
        moduleId: selected.id,
        moduleTitle: selected.title,
        xpAward: selected.xp,
      })

      setSyncedModuleIds((prev) => (prev.includes(selected.id) ? prev : [...prev, selected.id]))

      if (result?.xpEarned) {
        addXp(result.xpEarned)
      }
    })
  }, [addXp, completed, selected, syncedModuleIds])

  const completedCount = completedModuleIds.length
  const completedRatio = modules.length > 0 ? completedCount / modules.length : 0
  const totalXp = completedModuleIds.reduce((sum, id) => {
    const moduleItem = modules.find((moduleDef) => moduleDef.id === id)
    return sum + (moduleItem?.xp ?? 0)
  }, 0)

  if (!selected) {
    return (
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:space-y-8 sm:p-8">
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-5 py-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950 text-balance">Modules pedagogiques</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 font-medium text-slate-700 sm:text-base">
            Decouvre comment utiliser l&apos;IA de facon eclairee, responsable et utile, sans perdre ton esprit critique.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-6">
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-primary">
              {completedCount} / {modules.length}
            </p>
            <p className="text-xs text-muted-foreground">modules termines</p>
          </div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completedRatio * 100}%` }} />
          </div>
          <div className="text-center sm:text-right">
            <p className="text-2xl font-bold text-foreground">{totalXp} XP</p>
            <p className="text-xs text-muted-foreground">gagnes</p>
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
                  setCourseRead(completedModuleIds.includes(moduleItem.id))
                  setCelebrate(false)
                }}
                className="w-full text-left"
              >
                <Card
                  className={`border-2 transition-shadow ${
                    isLocked ? "border-border opacity-60" : "border-border hover:shadow-md"
                  }`}
                >
                  <CardContent className="flex items-start gap-4 px-4 py-5 sm:px-6">
                    <div className={`flex size-11 flex-shrink-0 items-center justify-center rounded-xl ${cfg.color}`}>
                      <StatusIcon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="leading-snug font-semibold text-foreground">{moduleItem.title}</h3>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                              <CheckCircle2 className="h-3 w-3" />
                              Termine
                            </span>
                          )}
                        </div>
                        {!isLocked && <ChevronRight className="mt-0.5 size-4 flex-shrink-0 text-muted-foreground" />}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{moduleItem.description}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {moduleItem.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground">{moduleItem.duration}</span>
                        <span className="flex items-center gap-0.5 text-xs font-medium text-primary">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card hover:bg-muted"
            onClick={() => setSelectedId(null)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1 rounded-lg bg-slate-50 px-3 py-2">
            <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">{selected.title}</h1>
            <p className="text-sm font-medium text-slate-700">
              Module {selected.id} sur {modules.length} • {selected.duration}
            </p>
          </div>
          <Badge className={`hidden sm:inline-flex ${completed ? "border-green-300 bg-green-100 text-green-700" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
            {completed ? "Module complete" : `${selected.xp} XP`}
          </Badge>
        </div>
        <div className="mx-auto max-w-4xl px-4 pb-3 sm:px-6">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${completed ? "bg-green-500" : "bg-primary"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-8">
        {selected.resources.length > 0 && (
          <Card className="border-sky-100 bg-white/95 p-5 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-slate-900">Etape 1 : ouvrir toutes les sources du module</p>
            <p className="mb-3 text-xs text-slate-600">
              Optionnel : {doneSources} / {totalSources} source{totalSources > 1 ? "s" : ""} consultee{totalSources > 1 ? "s" : ""}.
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              {selected.resources.map((resource) => {
                const opened = openedSources.includes(resource.href)
                return (
                  <li key={resource.href}>
                    <button
                      type="button"
                      onClick={() => handleOpenSource(resource.href)}
                      className={`underline underline-offset-2 ${opened ? "text-green-700" : "text-primary"}`}
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

        <Card className="border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col items-start gap-5 md:flex-row md:gap-6">
            <div className="w-full overflow-hidden rounded-2xl border bg-muted/40 shadow-inner md:w-1/3">
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
                className="h-48 w-full object-cover sm:h-56 md:h-48"
                loading="lazy"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <BookOpen className="h-3 w-3" />
                Module {selected.id} • Niveau {selected.level}
              </div>
              <h2 className="text-xl font-bold text-foreground md:text-2xl">{selected.title}</h2>
              <p className="text-sm leading-relaxed text-slate-700 md:text-base">{selected.description}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {selected.sections.map((section, index) => (
            <Card key={section.title} className="border border-slate-200 bg-white/95 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
                  </div>
                  <div className="space-y-2 border-l-2 border-primary/30 pl-3 text-sm leading-relaxed text-slate-700">
                    {section.content}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-stretch pt-2 sm:justify-end">
          <button
            type="button"
            onClick={handleMarkRead}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition-colors sm:w-auto ${
              courseRead
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-primary bg-white text-primary hover:bg-primary/5"
            }`}
          >
            {courseRead ? "Cours marque comme lu" : "J'ai lu tout le cours"}
          </button>
        </div>

        {celebrate && (
          <div className="space-y-2 text-center">
            <p className="animate-bounce text-lg font-bold text-green-600">Bravo, tu as complete ce module !</p>
            {isSyncingModule ? <p className="text-sm text-slate-600">Enregistrement de l'XP...</p> : null}
          </div>
        )}
      </main>
    </div>
  )
}
