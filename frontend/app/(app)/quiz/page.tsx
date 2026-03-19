"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { BookOpenCheck, CheckCircle2, ChevronRight, RotateCcw, Trophy, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { recordQuizAnswer } from "@/lib/guest.actions"
import { pickRandomQuestions, type OptionKey, type QuizQuestion } from "./question-bank"

const TOTAL_QUESTIONS = 50

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<OptionKey | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setQuestions(pickRandomQuestions(TOTAL_QUESTIONS))
  }, [])

  const current = questions[index]
  const progress = useMemo(() => {
    if (questions.length === 0) return 0
    return ((index + (confirmed ? 1 : 0)) / questions.length) * 100
  }, [index, confirmed, questions.length])
  const isCorrect = selected !== null && current ? selected === current.answer : false

  function handleValidate() {
    if (!current || selected === null || confirmed) return

    const selectedAnswer = current.options.find((opt) => opt.key === selected)?.text ?? ""
    const correctAnswer = current.options.find((opt) => opt.key === current.answer)?.text ?? ""
    const isCorrectAnswer = selected === current.answer

    setConfirmed(true)
    if (isCorrectAnswer) {
      setScore((prev) => prev + 1)
    }

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
    setQuestions(pickRandomQuestions(TOTAL_QUESTIONS))
    setIndex(0)
    setSelected(null)
    setConfirmed(false)
    setScore(0)
    setFinished(false)
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-6 flex items-center justify-center text-slate-300">
        <div className="max-w-3xl mx-auto w-full text-center">Chargement du quiz...</div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-6 max-w-2xl mx-auto flex items-center justify-center">
        <Card className="w-full text-center border-purple-500/30 bg-slate-800/80 text-white backdrop-blur">
          <CardHeader>
            <div className="mx-auto mb-2 size-14 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Trophy className="size-7 text-purple-300" />
            </div>
            <CardTitle>Le Décodeur IA — Quiz terminé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold text-purple-300">
              {score} / {questions.length}
            </p>
            <p className="text-slate-300">bonnes réponses</p>
            <Button onClick={handleRestart} className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white" size="lg">
              <RotateCcw className="size-4" />
              Recommencer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-5 text-white">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <BookOpenCheck className="size-5 text-purple-300" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Le Décodeur IA</h1>
            <p className="text-slate-300 text-sm">Quiz vocabulaire et bons réflexes face à la désinformation</p>
          </div>
        </div>

        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full bg-purple-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>
            Question {index + 1} / {questions.length}
          </span>
          <span className="font-semibold text-white">Score : {score}</span>
        </div>

        <Card className="border-purple-500/30 bg-slate-800/80 text-white backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base leading-relaxed">{current.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {current.options.map((option, optionIndex) => {
            const optionKey = option.key
            let style = "border-slate-600 bg-slate-900/60 text-slate-100 hover:bg-slate-700"

            if (confirmed) {
              if (optionKey === current.answer) {
                style = "border-purple-400 bg-purple-500/20 text-purple-200"
              } else if (optionKey === selected) {
                style = "border-destructive bg-destructive/10 text-destructive"
              } else {
                style = "border-slate-700 bg-slate-900/40 text-slate-400 opacity-60"
              }
            } else if (selected === optionKey) {
              style = "border-purple-400 bg-purple-500/20 text-purple-200"
            }

            return (
              <button
                key={optionKey}
                onClick={() => !confirmed && setSelected(optionKey)}
                className={cn("w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors", style)}
              >
                <div className="flex items-center gap-3">
                  <span className="size-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {option.key}
                  </span>
                  <span className="leading-relaxed">{option.text}</span>
                  {confirmed && option.key === current.answer && (
                    <CheckCircle2 className="size-4 ml-auto flex-shrink-0 text-purple-300" />
                  )}
                  {confirmed && option.key === selected && option.key !== current.answer && (
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
              isCorrect ? "bg-purple-500/20 border-purple-400/30" : "bg-destructive/10 border-destructive/20",
            )}
          >
            <p className={cn("font-semibold", isCorrect ? "text-purple-200" : "text-destructive")}>
              {isCorrect ? "Bonne réponse !" : "Mauvaise réponse."}
            </p>
            <p className="text-slate-200 mt-1">Réponse attendue : {current.answer}</p>
          </div>
        )}

        {!confirmed ? (
          <Button
            onClick={handleValidate}
            disabled={selected === null}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            Valider ma réponse
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white" size="lg">
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
    </div>
  )
}