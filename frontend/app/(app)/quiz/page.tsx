"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const questions = [
  {
    question: "Qu'est-ce qu'un deepfake ?",
    options: [
      "Une vidéo truquée générée par IA pour faire dire ou faire des choses à quelqu'un",
      "Un logiciel de montage vidéo classique",
      "Un type de réseau social",
      "Une technique de photographie professionnelle",
    ],
    answer: 0,
    explanation: "Un deepfake utilise des algorithmes d'IA (notamment les GAN) pour superposer le visage ou la voix d'une personne sur un autre corps ou enregistrement audio.",
  },
  {
    question: "Lequel de ces indices peut signaler un texte généré par IA ?",
    options: [
      "Le texte contient des fautes d'orthographe",
      "Le texte est très structuré, sans erreurs, mais manque de point de vue personnel",
      "Le texte est écrit en majuscules",
      "Le texte est très court",
    ],
    answer: 1,
    explanation: "Les textes générés par IA tendent à être grammaticalement parfaits, bien structurés, mais manquent souvent d'opinion personnelle, d'émotions authentiques ou de détails vécus.",
  },
  {
    question: "Quel est le principal danger de la désinformation générée par IA ?",
    options: [
      "Elle occupe trop d'espace sur internet",
      "Elle peut être difficilement détectable et influencer les opinions à grande échelle",
      "Elle ralentit les ordinateurs",
      "Elle est trop chère à produire",
    ],
    answer: 1,
    explanation: "La désinformation générée par IA est dangereuse car elle est convaincante, produite en masse et peut manipuler l'opinion publique sur des sujets politiques, sanitaires ou sociaux.",
  },
  {
    question: "Comment vérifier si une image est générée par IA ?",
    options: [
      "En la regardant rapidement",
      "En utilisant des outils de détection IA ou en cherchant l'image sur un moteur de recherche inversé",
      "En demandant à l'auteur",
      "Les images IA sont toujours floues",
    ],
    answer: 1,
    explanation: "Des outils comme Google Images (recherche inversée) ou des détecteurs d'IA comme Hive Moderation permettent d'analyser si une image a été générée artificiellement.",
  },
]

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[currentQ]
  const isCorrect = selected === question.answer

  function handleSelect(i: number) {
    if (confirmed) return
    setSelected(i)
  }

  function handleConfirm() {
    if (selected === null) return
    if (!confirmed) {
      setConfirmed(true)
      if (selected === question.answer) setScore((s) => s + 1)
    } else {
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1)
        setSelected(null)
        setConfirmed(false)
      } else {
        setFinished(true)
      }
    }
  }

  function handleReset() {
    setCurrentQ(0)
    setSelected(null)
    setConfirmed(false)
    setScore(0)
    setFinished(false)
  }

  const xpGained = score * 25

  if (finished) {
    return (
      <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Trophy className="size-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quiz terminé !</h1>
          <p className="text-muted-foreground mt-1">Voici tes résultats.</p>
        </div>
        <Card className="w-full">
          <CardContent className="pt-6 space-y-4">
            <div className="text-5xl font-bold text-primary">{score} / {questions.length}</div>
            <p className="text-muted-foreground">bonnes réponses</p>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-foreground">
              <Zap className="size-5 text-primary" />
              +{xpGained} XP gagnés
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="size-4" />
          Recommencer
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quiz — Désinformation IA</h1>
        <p className="text-muted-foreground mt-1">Question {currentQ + 1} sur {questions.length}</p>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${((currentQ + (confirmed ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground leading-snug text-balance">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((opt, i) => {
            let variant = "border-border bg-card text-foreground hover:bg-muted"
            if (confirmed) {
              if (i === question.answer) variant = "border-primary bg-primary/10 text-primary"
              else if (i === selected) variant = "border-destructive bg-destructive/10 text-destructive"
              else variant = "border-border bg-card text-muted-foreground opacity-60"
            } else if (selected === i) {
              variant = "border-primary bg-primary/10 text-primary"
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors",
                  variant,
                  !confirmed && "cursor-pointer"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                  {confirmed && i === question.answer && <CheckCircle2 className="size-4 ml-auto flex-shrink-0 text-primary" />}
                  {confirmed && i === selected && i !== question.answer && <XCircle className="size-4 ml-auto flex-shrink-0 text-destructive" />}
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Explanation */}
      {confirmed && (
        <div className={cn(
          "rounded-xl border px-4 py-3 text-sm leading-relaxed",
          isCorrect ? "bg-primary/10 border-primary/20 text-primary" : "bg-destructive/10 border-destructive/20 text-destructive"
        )}>
          <p className="font-semibold mb-1">{isCorrect ? "Bonne réponse !" : "Mauvaise réponse."}</p>
          <p className="text-foreground/80">{question.explanation}</p>
        </div>
      )}

      {/* CTA */}
      <Button
        onClick={handleConfirm}
        disabled={selected === null}
        className="w-full gap-2"
        size="lg"
      >
        {!confirmed ? "Valider" : currentQ < questions.length - 1 ? <>Question suivante <ChevronRight className="size-4" /></> : "Voir les résultats"}
      </Button>
    </div>
  )
}
