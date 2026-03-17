'use client'

import { useState } from "react"
import { BookOpen, Lock, CheckCircle2, Zap, ChevronRight, ChevronLeft, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { modules } from "@/lib/modules-data"

const statusConfig = {
  done: { label: "Terminé", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  available: { label: "Disponible", color: "bg-secondary/20 text-secondary-foreground", icon: BookOpen },
  locked: { label: "Verrouillé", color: "bg-muted text-muted-foreground", icon: Lock },
}

export default function ModulesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [openedResources, setOpenedResources] = useState<string[]>([])
  const [courseDone, setCourseDone] = useState(false)

  const selected = selectedId != null ? modules.find((m) => m.id === selectedId) ?? null : null

  const totalResources = selected?.resources.length ?? 0
  const doneResources = selected
    ? selected.resources.filter((r) => openedResources.includes(r.href)).length
    : 0
  const stepsTotal = (selected ? 1 : 0) + totalResources // 1 = cours lu + chaque ressource
  const stepsDone = (selected && courseDone ? 1 : 0) + doneResources
  const progress = stepsTotal > 0 ? Math.round((stepsDone / stepsTotal) * 100) : 0

  if (!selected) {
    // Vue liste
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
            <p className="text-2xl font-bold text-primary">1 / {modules.length}</p>
            <p className="text-xs text-muted-foreground">modules terminés</p>
          </div>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(1 / modules.length) * 100}%` }} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">100 XP</p>
            <p className="text-xs text-muted-foreground">gagnés</p>
          </div>
        </div>

        <div className="space-y-3">
          {modules.map((mod) => {
            const cfg = statusConfig[mod.status as keyof typeof statusConfig]
            const StatusIcon = cfg.icon
            const isLocked = mod.status === "locked"

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  setSelectedId(mod.id)
                  setOpenedResources([])
                  setCourseDone(false)
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
                        <h3 className="font-semibold text-foreground leading-snug">{mod.title}</h3>
                        {!isLocked && <ChevronRight className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mod.description}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {mod.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium"
                          >
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
                  </CardContent>
                </Card>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Vue cours plein écran
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      <header className="border-b border-blue-100 bg-white/60 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => setSelectedId(null)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{selected.title}</h1>
            <p className="text-xs text-gray-600">
              Module {selected.id} sur {modules.length}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Progress value={progress} className="h-2 w-40 bg-gray-100" />
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              {progress}% complété
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        {/* Sources en haut */}
        {selected.resources.length > 0 && (
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Sources du module (à consulter)
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {selected.resources.map((res) => {
                const opened = openedResources.includes(res.href)
                return (
                  <li key={res.href}>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(res.href, "_blank", "noopener,noreferrer")
                        setOpenedResources((prev) => (prev.includes(res.href) ? prev : [...prev, res.href]))
                      }}
                      className="text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      {opened ? "✔ " : ""}
                      {res.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        )}

        {/* Bloc introduction + image */}
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
                Module {selected.id} • Niveau {selected.level} • {selected.duration}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{selected.title}</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{selected.description}</p>
            </div>
          </div>
        </Card>

        {/* Sections du cours */}
        <div className="space-y-4">
          {selected.sections.map((section, index) => (
            <Card
              key={section.title}
              className="p-5 bg-white border border-border/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wide px-2 py-0 h-5">
                      Étape {index + 1}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3">
                    {section.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bouton de fin de cours */}
        <div className="flex justify-end pt-2 pb-6">
          <Button
            type="button"
            size="sm"
            variant={courseDone ? "outline" : "default"}
            className={courseDone ? "border-green-500 text-green-600" : ""}
            onClick={() => setCourseDone(true)}
          >
            {courseDone ? "Cours marqué comme terminé 🎉" : "J'ai lu tout le cours"}
          </Button>
        </div>
      </main>
    </div>
  )
}
