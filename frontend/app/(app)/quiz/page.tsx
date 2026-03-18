"use client"

import { useMemo, useState, useTransition } from "react"
import { BookOpenCheck, CheckCircle2, ChevronRight, RotateCcw, Trophy, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { recordQuizAnswer } from "@/lib/guest.actions"

type Question = {
  id: number
  question: string
  options: string[]
  answer: number
}

const questions: Question[] = [
  {
    id: 1,
    question: "Comment appelle-t-on une vidéo truquée par l'IA où l'on a remplacé le visage ou la voix de quelqu'un ?",
    options: ["A) Un Fastfake", "B) Un Deepfake", "C) Un Facehack"],
    answer: 1,
  },
  {
    id: 2,
    question: "C'est quoi une “Hallucination” quand on parle d'Intelligence Artificielle ?",
    options: [
      "A) Quand l'IA invente un mensonge très crédible car elle ne connaît pas la réponse.",
      "B) Quand l'écran de ton ordinateur clignote de toutes les couleurs.",
      "C) Quand l'IA dessine des choses invisibles à l'œil nu.",
    ],
    answer: 0,
  },
  {
    id: 3,
    question:
      "Quel mot anglais utilise-t-on pour désigner la phrase de commande que l'on tape pour demander à l'IA de faire quelque chose ?",
    options: ["A) Un Cheat-code", "B) Un Prompt", "C) Un Script"],
    answer: 1,
  },
  {
    id: 4,
    question: "Qu'est-ce qu'une “Fake News” (ou Infox) ?",
    options: [
      "A) Une information vraie mais qui est très ancienne.",
      "B) Une blague faite par un humoriste à la télévision.",
      "C) Une fausse information créée volontairement pour manipuler ou faire le buzz.",
    ],
    answer: 2,
  },
  {
    id: 5,
    question:
      "Quel est l'outil le plus efficace pour vérifier d'où vient une image suspecte vue sur les réseaux sociaux ?",
    options: [
      "A) La recherche inversée d'image (comme Google Lens ou TinEye)",
      "B) Le dictionnaire français.",
      "C) L'antivirus de ton téléphone.",
    ],
    answer: 0,
  },
  {
    id: 6,
    question:
      "Si un long article sur Internet ne contient aucune faute d'orthographe, est-ce une preuve qu'il dit la vérité ?",
    options: [
      "A) Oui, les menteurs font toujours des fautes.",
      "B) Non, les IA génératives (comme ChatGPT) écrivent sans faute et peuvent créer de fausses infos.",
      "C) Oui, car les sites avec des fautes sont automatiquement bloqués.",
    ],
    answer: 1,
  },
  {
    id: 7,
    question:
      "Quel détail physique est encore très difficile à générer correctement pour les IA qui créent des images ?",
    options: ["A) La couleur des cheveux.", "B) Les nuages dans le ciel.", "C) Les mains et le nombre de doigts."],
    answer: 2,
  },
  {
    id: 8,
    question: "Que veut dire l'abréviation “LLM” qui fait fonctionner des IA comme ChatGPT ?",
    options: [
      "A) Logiciel Libre et Mobile",
      "B) Large Language Model (Grand Modèle de Langage)",
      "C) Lecture Linéaire de Mots",
    ],
    answer: 1,
  },
  {
    id: 9,
    question:
      "Une image très choquante te met très en colère sur ton fil d'actualité. Quel est le meilleur réflexe ?",
    options: [
      "A) La partager immédiatement pour prévenir tes amis.",
      "B) Laisser un commentaire agressif.",
      "C) Faire une pause et vérifier l'info sur un site d'actualité fiable.",
    ],
    answer: 2,
  },
  {
    id: 10,
    question: "C'est quoi le “Fact-checking” ?",
    options: [
      "A) Le travail de vérification des faits et de croisement des sources.",
      "B) Le fait d'accepter toutes les conditions d'utilisation d'un site web.",
      "C) Le fait de bloquer quelqu'un sur les réseaux sociaux.",
    ],
    answer: 0,
  },
]

export default function QuizPage() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [, startTransition] = useTransition()

  const current = questions[index]
  const selectedOption = selected ? current?.options.find((opt) => opt.key === selected) : null
  const isAnswerCorrect = Boolean(confirmed && selected && current && selected === current.answer)

  const handleConfirm = () => {
    if (!selected || confirmed || !current) return
    setConfirmed(true)
    if (selected === current.answer) setScore((prev) => prev + 1)
  }

  function handleValidate() {
    if (selected === null || confirmed) return
    const selectedAnswer = current.options[selected]
    const correctAnswer = current.options[current.answer]
    const isCorrectAnswer = selected === current.answer
    setConfirmed(true)
    if (isCorrectAnswer) setScore((s) => s + 1)

    startTransition(() => {
      recordQuizAnswer({
        quizId: "le-decodeur-ia",
        questionIndex: index + 1,
        questionText: current.question,
        selectedAnswer,
        correctAnswer,
        isCorrect: isCorrectAnswer,
      })
    })
  }

  function handleNext() {
    if (!confirmed) return
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1)
      setSelected(null)
      setConfirmed(false)
    } else {
      setFinished(true)
    }
  }

  function handleRestart() {
    setIndex(0)
    setSelected(null)
    setConfirmed(false)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="p-6 max-w-2xl mx-auto min-h-[70vh] flex items-center justify-center">
        <Card className="w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-2 size-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="size-7 text-primary" />
            </div>
            <CardTitle>Le Décodeur IA — Quiz terminé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold text-primary">
              {score} / {questions.length}
            </p>
            <p className="text-muted-foreground">bonnes réponses</p>
            <Button onClick={handleRestart} className="w-full gap-2" size="lg">
              <RotateCcw className="size-4" />
              Recommencer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpenCheck className="size-5 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Le Décodeur IA</h1>
          <p className="text-muted-foreground text-sm">Quiz vocabulaire et bons réflexes face à la désinformation</p>
        </div>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <span className="font-semibold text-foreground">Score : {score}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base leading-relaxed">{current.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {current.options.map((option, optionIndex) => {
            let style = "border-border bg-card text-foreground hover:bg-muted"
            if (confirmed) {
              if (optionIndex === current.answer) {
                style = "border-primary bg-primary/10 text-primary"
              } else if (optionIndex === selected) {
                style = "border-destructive bg-destructive/10 text-destructive"
              } else {
                style = "border-border bg-card text-muted-foreground opacity-60"
              }
            } else if (selected === optionIndex) {
              style = "border-primary bg-primary/10 text-primary"
            }

            return (
              <button
                key={option}
                onClick={() => !confirmed && setSelected(optionIndex)}
                className={cn("w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors", style)}
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className="leading-relaxed">{option.replace(/^[A-C]\)\s/, "")}</span>
                  {confirmed && optionIndex === current.answer && (
                    <CheckCircle2 className="size-4 ml-auto flex-shrink-0 text-primary" />
                  )}
                  {confirmed && optionIndex === selected && optionIndex !== current.answer && (
                    <XCircle className="size-4 ml-auto flex-shrink-0 text-destructive" />
                  )}
                </div>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {confirmed && (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 text-sm leading-relaxed",
            isCorrect ? "bg-primary/10 border-primary/20" : "bg-destructive/10 border-destructive/20",
          )}
        >
          <p className={cn("font-semibold", isCorrect ? "text-primary" : "text-destructive")}>
            {isCorrect ? "Bonne réponse !" : "Mauvaise réponse."}
          </p>
          <p className="text-foreground/80 mt-1">Réponse attendue : {String.fromCharCode(65 + current.answer)}</p>
        </div>
      )}

      {!confirmed ? (
        <Button onClick={handleValidate} disabled={selected === null} className="w-full" size="lg">
          Valider ma réponse
        </Button>
      ) : (
        <Button onClick={handleNext} className="w-full gap-2" size="lg">
          {index < questions.length - 1 ? (
            <>
              Question suivante
              <ChevronRight className="size-4" />
            </>
          ) : (
            "Voir mes résultats"
          )}
        </Button>
      )}
    </div>
  )
}

