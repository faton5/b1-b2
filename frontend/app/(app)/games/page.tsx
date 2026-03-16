"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, RotateCcw, Zap, Trophy, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const rounds = [
  {
    text: "Les scientifiques ont découvert qu'écouter de la musique classique augmenterait de façon permanente le QI des enfants de 15 points selon une étude de l'Université de Cambridge publiée ce matin.",
    isAI: true,
    explication: "Ce texte présente plusieurs marqueurs IA : affirmation très précise (\"15 points\"), source crédible mais invérifiable, ton assertif sans nuance ni lien vers la source.",
  },
  {
    text: "J'ai passé mon week-end à tenter de réparer mon vélo. La roue arrière refusait de rester gonflée — j'ai changé la chambre à air deux fois avant de réaliser que la valve était tordue depuis le début.",
    isAI: false,
    explication: "Ce texte est humain : il y a une narration personnelle, une anecdote vécue avec des détails concrets et une progression logique propre à une vraie expérience.",
  },
  {
    text: "La consommation quotidienne de café noir réduit le risque de diabète de type 2 de 23% selon une méta-analyse portant sur 1,2 million de participants. Cette découverte révolutionnaire change les recommandations nutritionnelles mondiales.",
    isAI: true,
    explication: "Chiffres très précis, superlatifs (\"révolutionnaire\", \"mondiales\"), absence de nuance ou de contexte — autant de signes d'un texte généré automatiquement pour sembler crédible.",
  },
  {
    text: "Le chat de ma voisine a encore renversé son pot de fleurs sur mon balcon. La troisième fois ce mois-ci. J'hésite entre lui construire une barrière ou accepter que le chat a tout simplement décidé que mon balcon lui appartient.",
    isAI: false,
    explication: "Ton conversationnel, humour subtil, situation concrète et anodine — ce type de texte avec ses hésitations et son ironie légère est typiquement humain.",
  },
  {
    text: "Des experts en neurosciences affirment qu'utiliser votre téléphone après 22h détruit définitivement vos neurones préfrontaux et cause des dommages irréversibles sur la mémoire à long terme.",
    isAI: true,
    explication: "Formulation alarmiste, généralisation excessive (\"définitivement\", \"irréversibles\"), sans source précise ni nuance scientifique — caractéristiques fréquentes de contenu IA désinformatif.",
  },
]

export default function GamesPage() {
  const [round, setRound] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [userChoice, setUserChoice] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = rounds[round]

  function handleAnswer(choice: boolean) {
    if (answered) return
    setUserChoice(choice)
    setAnswered(true)
    if (choice === current.isAI) setScore((s) => s + 1)
  }

  function handleNext() {
    if (round < rounds.length - 1) {
      setRound((r) => r + 1)
      setAnswered(false)
      setUserChoice(null)
    } else {
      setFinished(true)
    }
  }

  function handleReset() {
    setRound(0)
    setAnswered(false)
    setUserChoice(null)
    setScore(0)
    setFinished(false)
  }

  const isCorrect = userChoice === current.isAI
  const xpGained = score * 30

  if (finished) {
    return (
      <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Trophy className="size-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Partie terminée !</h1>
          <p className="text-muted-foreground mt-1">Tu as terminé le mini-jeu Spot the Fake.</p>
        </div>
        <Card className="w-full">
          <CardContent className="pt-6 space-y-4">
            <div className="text-5xl font-bold text-primary">{score} / {rounds.length}</div>
            <p className="text-muted-foreground">textes bien classifiés</p>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-foreground">
              <Zap className="size-5 text-primary" />
              +{xpGained} XP gagnés
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="size-4" />
          Rejouer
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Brain className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Spot the Fake</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Ce texte est-il écrit par un humain ou généré par IA ?</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
        <span>Texte {round + 1} / {rounds.length}</span>
        <span className="font-medium text-foreground">{score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(round / rounds.length) * 100}%` }}
        />
      </div>

      {/* Text card */}
      <Card className="border-2 border-border">
        <CardContent className="pt-6 pb-6">
          <p className="text-foreground leading-relaxed text-base">{'"'}{current.text}{'"'}</p>
        </CardContent>
      </Card>

      {/* Buttons */}
      {!answered ? (
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleAnswer(false)}
            className="border-2 hover:border-secondary hover:bg-secondary/10 h-14 text-base font-semibold"
          >
            Humain
          </Button>
          <Button
            size="lg"
            onClick={() => handleAnswer(true)}
            className="h-14 text-base font-semibold"
          >
            Généré par IA
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Result */}
          <div className={cn(
            "rounded-xl border px-4 py-4 space-y-2",
            isCorrect
              ? "bg-primary/10 border-primary/20"
              : "bg-destructive/10 border-destructive/20"
          )}>
            <div className="flex items-center gap-2 font-semibold">
              {isCorrect
                ? <><CheckCircle2 className="size-5 text-primary" /><span className="text-primary">Bonne réponse ! +30 XP</span></>
                : <><XCircle className="size-5 text-destructive" /><span className="text-destructive">Mauvaise réponse</span></>
              }
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <span className="font-medium">Ce texte était </span>
              <span className={cn("font-bold", current.isAI ? "text-primary" : "text-secondary-foreground")}>
                {current.isAI ? "généré par IA" : "écrit par un humain"}.
              </span>
              {" "}{current.explication}
            </p>
          </div>

          <Button onClick={handleNext} className="w-full" size="lg">
            {round < rounds.length - 1 ? "Texte suivant" : "Voir les résultats"}
          </Button>
        </div>
      )}
    </div>
  )
}
