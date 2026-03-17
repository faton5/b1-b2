"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Brain, CheckCircle2, Clock3, RotateCcw, Trophy, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { awardXp } from "@/lib/progression.actions"
import { useXp } from "@/lib/xp-context"

type Level = {
  id: number
  titre: string
  difficulte: "Facile" | "Moyenne" | "Difficile"
  imageSrc: string
  imageAlt: string
  isAI: boolean
  correction: string
}

const GAME_TIME_SECONDS = 30

const levels: Level[] = [
  {
    id: 1,
    titre: "Le faux influenceur",
    difficulte: "Facile",
    imageSrc: "/images/detective-ia/niveau-1-faux-influenceur.jpg",
    imageAlt: "Un homme souriant boit un café en terrasse",
    isAI: true,
    correction:
      "Bien vu ! Compter les doigts est le premier réflexe du détective. L'IA générative se trompe très souvent sur l'anatomie humaine.",
  },
  {
    id: 2,
    titre: "Le marcheur sur l'eau",
    difficulte: "Moyenne",
    imageSrc: "/images/detective-ia/niveau-2-marcheur-eau.jpg",
    imageAlt: "Une personne marche sur un immense miroir naturel",
    isAI: false,
    correction:
      "Piège ! C'est une vraie photo sans aucun trucage. Quand il pleut, ce désert ultra-plat en Bolivie se transforme en un immense miroir naturel. Tout n'est pas faux sur Internet !",
  },
  {
    id: 3,
    titre: "La manifestation",
    difficulte: "Facile",
    imageSrc: "/images/detective-ia/niveau-3-manifestation.jpg",
    imageAlt: "Une foule tient une grande pancarte jaune",
    isAI: true,
    correction:
      "Exact ! L'IA a encore beaucoup de mal à générer du texte lisible. Si les mots sur les affiches fondent ou n'ont aucun sens, l'image a été générée par un ordinateur.",
  },
  {
    id: 4,
    titre: "Le chien géant",
    difficulte: "Difficile",
    imageSrc: "/images/detective-ia/niveau-4-chien-geant.jpg",
    imageAlt: "Un chien paraît gigantesque à côté d'un humain",
    isAI: false,
    correction:
      "Super coup d'œil ! Ce n'est pas de l'IA, c'est juste le placement de l'appareil photo. Le chien est assis sur un muret très près de l'objectif, alors que l'homme est loin derrière.",
  },
  {
    id: 5,
    titre: "Le reflet impossible",
    difficulte: "Difficile",
    imageSrc: "/images/detective-ia/niveau-5-reflet-impossible.jpg",
    imageAlt: "Une femme se regarde dans un miroir de salle de bain",
    isAI: true,
    correction:
      "Excellent ! L'IA génère les objets indépendamment les uns des autres. Elle oublie très souvent de respecter les lois de la physique pour les reflets dans les miroirs ou les vitres.",
  },
]

// Le reste de ton code reste IDENTIQUE
function difficultyStyle(level: Level["difficulte"]) {
  if (level === "Facile") return "bg-green-100 text-green-700"
  if (level === "Moyenne") return "bg-yellow-100 text-yellow-700"
  return "bg-red-100 text-red-700"
}

export default function GamesPage() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<boolean | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS)
  const [timeoutRound, setTimeoutRound] = useState(false)

  const current = levels[index]

  useEffect(() => {
    if (finished || confirmed) return
    if (timeLeft <= 0) {
      setConfirmed(true)
      setTimeoutRound(true)
      return
    }

    const timerId = setTimeout(() => setTimeLeft((v) => v - 1), 1000)
    return () => clearTimeout(timerId)
  }, [timeLeft, confirmed, finished])

  const progress = useMemo(() => {
    if (levels.length === 0) return 0
    return ((index + (confirmed ? 1 : 0)) / levels.length) * 100
  }, [index, confirmed])

  function handleAnswer(choiceIsAI: boolean) {
    if (confirmed) return
    setSelected(choiceIsAI)
    setConfirmed(true)
    if (choiceIsAI === current.isAI) {
      setScore((prev) => prev + 1)
    }
  }

  function handleNext() {
    if (index + 1 >= levels.length) {
      setFinished(true)
    } else {
      setIndex((prev) => prev + 1)
      setSelected(null)
      setConfirmed(false)
      setTimeLeft(GAME_TIME_SECONDS)
      setTimeoutRound(false)
    }
  }

  function handleRestart() {
    setIndex(0)
    setSelected(null)
    setConfirmed(false)
    setScore(0)
    setFinished(false)
    setTimeLeft(GAME_TIME_SECONDS)
    setTimeoutRound(false)
  }

  // ─── Écran résultats ───────────────────────────────────────────────────────
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
        <Card className="max-w-md w-full text-center shadow-2xl border-purple-500/30 bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <Trophy className="mx-auto mb-2 text-yellow-400" size={56} />
            <CardTitle className="text-3xl text-white">Résultats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-6xl font-bold text-purple-300">
              {score} <span className="text-2xl text-slate-400">/ {levels.length}</span>
            </p>
            <p className="text-slate-300">
              {score === levels.length
                ? "Parfait ! Tu es un vrai détective IA 🕵️"
                : score >= levels.length / 2
                ? "Bien joué ! Encore un peu d'entraînement..."
                : "Continue à t'entraîner, tu vas y arriver !"}
            </p>
            <Button onClick={handleRestart} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <RotateCcw size={16} className="mr-2" />
              Rejouer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── Écran jeu ────────────────────────────────────────────────────────────
  const isCorrect = selected !== null && selected === current.isAI

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* En-tête */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Brain size={28} className="text-purple-400" />
            <span className="text-xl font-bold">Détective IA</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">
              Niveau {index + 1} / {levels.length}
            </span>
            <span className="text-slate-300 text-sm">Score : {score}</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Carte niveau */}
        <Card className="border-purple-500/30 bg-slate-800/80 backdrop-blur text-white shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{current.titre}</CardTitle>
              <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", difficultyStyle(current.difficulte))}>
                {current.difficulte}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timer */}
            <div className="flex items-center gap-2 text-sm">
              <Clock3 size={16} className={timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-slate-400"} />
              <span className={timeLeft <= 5 ? "text-red-400 font-bold" : "text-slate-300"}>
                {timeLeft}s
              </span>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.imageSrc}
                alt={current.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Boutons réponse */}
            {!confirmed && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/10"
                >
                  📷 VRAIE PHOTO
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  🤖 CRÉÉE PAR IA
                </Button>
              </div>
            )}

            {/* Correction */}
            {confirmed && (
              <div
                className={cn(
                  "rounded-lg p-4 space-y-2",
                  timeoutRound
                    ? "bg-slate-700/60 border border-slate-500"
                    : isCorrect
                    ? "bg-green-900/40 border border-green-500/50"
                    : "bg-red-900/40 border border-red-500/50"
                )}
              >
                {timeoutRound ? (
                  <p className="font-semibold text-slate-300">⏱ Temps écoulé !</p>
                ) : isCorrect ? (
                  <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <CheckCircle2 size={18} /> Bonne réponse !
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400 font-semibold">
                    <XCircle size={18} /> Mauvaise réponse
                  </div>
                )}
                <p className="text-sm text-slate-300">{current.correction}</p>
                <p className="text-xs text-slate-400 italic">
                  Réponse : {current.isAI ? "Créée par IA 🤖" : "Vraie photo 📷"}
                </p>
                <Button
                  onClick={handleNext}
                  className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {index + 1 >= levels.length ? "Voir les résultats" : "Niveau suivant →"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
