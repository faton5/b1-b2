"use client"

import { useEffect, useMemo, useState } from "react"
import { Brain, CheckCircle2, Clock3, RotateCcw, Trophy, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
		if (index < levels.length - 1) {
			setIndex((prev) => prev + 1)
			setSelected(null)
			setConfirmed(false)
			setTimeLeft(GAME_TIME_SECONDS)
			setTimeoutRound(false)
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
		setTimeLeft(GAME_TIME_SECONDS)
		setTimeoutRound(false)
	}

	const isCorrect = selected === current.isAI

	if (finished) {
		return (
			<div className="p-6 max-w-2xl mx-auto min-h-[70vh] flex items-center justify-center">
				<Card className="w-full text-center">
					<CardHeader>
						<div className="mx-auto mb-2 size-14 rounded-full bg-primary/10 flex items-center justify-center">
							<Trophy className="size-7 text-primary" />
						</div>
						<CardTitle>Détective IA — Mission terminée</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-4xl font-bold text-primary">
							{score} / {levels.length}
						</p>
						<p className="text-muted-foreground">bonnes réponses</p>
						<Button onClick={handleRestart} className="gap-2 w-full" size="lg">
							<RotateCcw className="size-4" />
							Rejouer
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
					<Brain className="size-5 text-primary" />
				</div>
				<div className="flex-1">
					<h1 className="text-2xl font-bold text-foreground">Détective IA</h1>
					<p className="text-muted-foreground text-sm">Devine si l'image est une vraie photo ou une image générée par IA</p>
				</div>
			</div>

			<div className="h-2 rounded-full bg-muted overflow-hidden">
				<div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
			</div>

			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">Niveau {index + 1} / {levels.length}</span>
				<span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", difficultyStyle(current.difficulte))}>
					{current.difficulte}
				</span>
			</div>

			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Clock3 className={cn("size-4", timeLeft <= 10 && !confirmed ? "text-destructive" : "text-muted-foreground")} />
				<span className={cn("font-semibold", timeLeft <= 10 && !confirmed ? "text-destructive" : "text-foreground")}>{timeLeft}s</span>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg">{current.titre}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-xl overflow-hidden border bg-muted/30">
						<img
							src={current.imageSrc}
							alt={current.imageAlt}
							className="w-full h-[320px] object-cover"
						/>
					</div>
					<p className="text-xs text-muted-foreground">
						Place tes images dans `frontend/public/images/detective-ia/` en gardant les noms indiqués pour un affichage automatique.
					</p>
				</CardContent>
			</Card>

			{!confirmed ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Button size="lg" variant="outline" onClick={() => handleAnswer(false)}>
						VRAIE PHOTO
					</Button>
					<Button size="lg" onClick={() => handleAnswer(true)}>
						CRÉÉE PAR IA
					</Button>
				</div>
			) : (
				<Card className={cn("border", isCorrect ? "border-primary/20 bg-primary/5" : "border-destructive/20 bg-destructive/5")}>
					<CardContent className="pt-5 space-y-3">
						<div className="flex items-center gap-2 font-semibold">
							{timeoutRound ? (
								<>
									<XCircle className="size-5 text-destructive" />
									<span className="text-destructive">Temps écoulé !</span>
								</>
							) : isCorrect ? (
								<>
									<CheckCircle2 className="size-5 text-primary" />
									<span className="text-primary">Bonne réponse</span>
								</>
							) : (
								<>
									<XCircle className="size-5 text-destructive" />
									<span className="text-destructive">Mauvaise réponse</span>
								</>
							)}
						</div>

						<p className="text-sm leading-relaxed text-foreground/90">
							Réponse attendue : <span className="font-semibold">{current.isAI ? "CRÉÉE PAR IA" : "VRAIE PHOTO"}</span>
						</p>
						<p className="text-sm leading-relaxed text-foreground/85">{current.correction}</p>

						<Button onClick={handleNext} className="w-full" size="lg">
							{index < levels.length - 1 ? "Niveau suivant" : "Voir mes résultats"}
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
