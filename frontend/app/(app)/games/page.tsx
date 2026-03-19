"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
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
  mediaType: "image" | "video"
  mediaSrc: string
  mediaAlt: string
  isAI: boolean
  correction: string
}

const GAME_TIME_SECONDS = 60
const CLIP_PREVIEW_SECONDS = 5
const TOTAL_ROUNDS = 10

const IMAGE_POOL: Omit<Level, "id" | "difficulte">[] = [
  {
    titre: "Montagne au lever du jour",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Montagne réaliste",
    isAI: false,
    correction: "Indice : textures rocheuses et lumière cohérentes, contenu réel.",
  },
  {
    titre: "Mer au soleil couchant",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Mer et coucher de soleil",
    isAI: false,
    correction: "Indice : reflets naturels sur l'eau et dégradé du ciel réaliste.",
  },
  {
    titre: "Forêt brumeuse",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/167684/pexels-photo-167684.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Forêt réelle",
    isAI: false,
    correction: "Indice : profondeur de champ et brume homogène, photo réelle.",
  },
  {
    titre: "Cascade naturelle",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Cascade en nature",
    isAI: false,
    correction: "Indice : eau et roches gardent une cohérence physique naturelle.",
  },
  {
    titre: "Lac alpin",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Lac de montagne",
    isAI: false,
    correction: "Indice : couleurs et perspective sont plausibles pour un vrai paysage.",
  },
  {
    titre: "Dunes et ciel clair",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Paysage désertique",
    isAI: false,
    correction: "Indice : ombres et grain du sable réalistes.",
  },
  {
    titre: "Falaises océaniques",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Falaises au bord de mer",
    isAI: false,
    correction: "Indice : relief et lumière restent cohérents.",
  },
  {
    titre: "Vallée verte",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Vallée naturelle",
    isAI: false,
    correction: "Indice : diversité des textures végétales naturelle.",
  },
  {
    titre: "Rivière de montagne",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Rivière réelle",
    isAI: false,
    correction: "Indice : reflets d'eau et détails minéraux crédibles.",
  },
  {
    titre: "Nature au crépuscule",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Paysage naturel au crépuscule",
    isAI: false,
    correction: "Indice : progression de lumière réaliste.",
  },
  {
    titre: "Influenceur aux 6 doigts",
    mediaType: "image",
    mediaSrc: "/images/detective-ia/niveau-1-faux-influenceur.jpg",
    mediaAlt: "Portrait avec anomalie de doigts",
    isAI: true,
    correction: "Indice : nombre de doigts incohérent, signal typique d'une image IA.",
  },
  {
    titre: "Reflet impossible",
    mediaType: "image",
    mediaSrc: "/images/detective-ia/niveau-5-reflet-impossible.jpg",
    mediaAlt: "Reflet incohérent",
    isAI: true,
    correction: "Indice : logique du miroir non respectée.",
  },
  {
    titre: "Pancarte illisible",
    mediaType: "image",
    mediaSrc: "/images/detective-ia/niveau-3-manifestation.jpg",
    mediaAlt: "Texte déformé",
    isAI: true,
    correction: "Indice : texte incohérent, fréquent dans les générations IA.",
  },
  {
    titre: "Chien géant (perspective)",
    mediaType: "image",
    mediaSrc: "/images/detective-ia/niveau-4-chien-geant.jpg",
    mediaAlt: "Illusion de perspective",
    isAI: false,
    correction: "Indice : c'est une illusion d'optique réelle, pas de l'IA.",
  },
  {
    titre: "Marcheur sur l'eau",
    mediaType: "image",
    mediaSrc: "/images/detective-ia/niveau-2-marcheur-eau.jpg",
    mediaAlt: "Désert miroir",
    isAI: false,
    correction: "Indice : phénomène naturel réel dans un désert salé après pluie.",
  },
  {
    titre: "Main anormale en portrait",
    mediaType: "image",
    mediaSrc: "/images/detective-ia/niveau-1-faux-influenceur.jpg",
    mediaAlt: "Portrait suspect avec détails de main incohérents",
    isAI: true,
    correction: "Indice : la main et les doigts paraissent anatomiquement incohérents, fréquent en IA.",
  },
  {
    titre: "Reflet vitrine incohérent",
    mediaType: "image",
    mediaSrc: "/images/detective-ia/niveau-5-reflet-impossible.jpg",
    mediaAlt: "Scène avec reflet suspect",
    isAI: true,
    correction: "Indice : les reflets ne respectent pas la position des objets.",
  },
  {
    titre: "Texte de panneau déformé",
    mediaType: "image",
    mediaSrc: "/images/detective-ia/niveau-3-manifestation.jpg",
    mediaAlt: "Pancarte aux caractères déformés",
    isAI: true,
    correction: "Indice : lettres floues et formes impossibles, souvent liées à la génération IA.",
  },
  {
    titre: "Visage trop lisse",
    mediaType: "image",
    mediaSrc: "/images/detective-ia/niveau-1-faux-influenceur.jpg",
    mediaAlt: "Visage avec texture de peau artificielle",
    isAI: true,
    correction: "Indice : texture de peau trop uniforme et détails locaux peu naturels.",
  },
  {
    titre: "Scène générée stylisée",
    mediaType: "image",
    mediaSrc: "https://artlist-toolkit-generations.imgix.net/content/Media-Catalog/Media-Catalog-Artifacts/ff635a00-8f7f-4739-8f3c-b961b581aa4d.png?auto=format%2Ccompress&cs=srgb&s=9cbfcf389aedee71609c91be1ee9f0a8",
    mediaAlt: "Image stylisée potentiellement générée",
    isAI: true,
    correction: "Indice : rendu très lisse et style synthétique, typique d'une génération IA.",
  },
  {
    titre: "Portrait généré réaliste",
    mediaType: "image",
    mediaSrc: "https://artlist-toolkit-generations.imgix.net/content/Media-Catalog/Media-Catalog-Artifacts/70366a0a-7a26-4c9c-93aa-80f0708a913e.jpg?auto=format%2Ccompress&cs=srgb&s=ef2119edb536e0dc82a067760a30b454",
    mediaAlt: "Image potentiellement générée par IA",
    isAI: true,
    correction: "Indice : texture très propre et rendu global uniforme, souvent observés sur des images générées.",
  },
  {
    titre: "Prairie de marguerites en montagne",
    mediaType: "image",
    mediaSrc: "https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg?auto=compress&cs=tinysrgb&w=1600",
    mediaAlt: "Prairie fleurie et montagnes",
    isAI: false,
    correction: "Indice : textures végétales, lumière et perspective cohérentes d'une photo réelle.",
  },
]

const VIDEO_POOL: Omit<Level, "id" | "difficulte">[] = [
  {
    titre: "Garçon et sa mère au parc",
    mediaType: "video",
    mediaSrc: "https://videos.pexels.com/video-files/3209298/3209298-hd_1920_1080_25fps.mp4",
    mediaAlt: "Scène familiale réelle en extérieur",
    isAI: false,
    correction: "Indice : vidéo réelle (non IA), mouvements et lumière naturels en extérieur.",
  },
  {
    titre: "Avatar IA studio",
    mediaType: "video",
    mediaSrc: "https://cdn.pixabay.com/video/2025/11/17/316552_large.mp4",
    mediaAlt: "Avatar généré par IA",
    isAI: true,
    correction: "Indice : texture du visage très lisse et mouvement du regard trop stable.",
  },
  {
    titre: "Montagne en vidéo",
    mediaType: "video",
    mediaSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    mediaAlt: "Vidéo réelle de montagne",
    isAI: false,
    correction: "Indice : mouvement de caméra naturel et cohérence lumineuse.",
  },
  {
    titre: "Digital human synthétique",
    mediaType: "video",
    mediaSrc: "https://cdn.pixabay.com/video/2026/02/03/332462_large.mp4",
    mediaAlt: "Humain virtuel",
    isAI: true,
    correction: "Indice : animation trop régulière et rendu artificiel.",
  },
]

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function uniqueByMediaSrc<T extends { mediaSrc: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.mediaSrc)) return false
    seen.add(item.mediaSrc)
    return true
  })
}

function resolveDifficulty(index: number): Level["difficulte"] {
  if (index < 3) return "Facile"
  if (index < 7) return "Moyenne"
  return "Difficile"
}

function buildRandomRounds(total = TOTAL_ROUNDS): Level[] {
  const allMedia = uniqueByMediaSrc([...IMAGE_POOL, ...VIDEO_POOL])
  const aiPool = allMedia.filter((item) => item.isAI)
  const nonAiPool = allMedia.filter((item) => !item.isAI)

  const aiTarget = Math.min(5, total)
  const nonAiTarget = Math.min(5, total - aiTarget)

  const selected = uniqueByMediaSrc([
    ...shuffleArray(aiPool).slice(0, aiTarget),
    ...shuffleArray(nonAiPool).slice(0, nonAiTarget),
  ])

  if (selected.length < total) {
    const remaining = shuffleArray(allMedia).filter(
      (item) => !selected.some((picked) => picked.mediaSrc === item.mediaSrc),
    )
    selected.push(...remaining.slice(0, total - selected.length))
  }

  const mixed = shuffleArray(selected)

  return mixed.slice(0, total).map((source, roundIndex) => ({
    id: roundIndex + 1,
    titre: source.titre,
    difficulte: resolveDifficulty(roundIndex),
    mediaType: source.mediaType,
    mediaSrc: source.mediaSrc,
    mediaAlt: source.mediaAlt,
    isAI: source.isAI,
    correction: source.correction,
  }))
}

function difficultyStyle(level: Level["difficulte"]) {
  if (level === "Facile") return "bg-green-100 text-green-700"
  if (level === "Moyenne") return "bg-yellow-100 text-yellow-700"
  return "bg-red-100 text-red-700"
}

function mediaStyle(mediaType: Level["mediaType"]) {
  return mediaType === "video"
    ? "bg-cyan-100 text-cyan-700"
    : "bg-fuchsia-100 text-fuchsia-700"
}

function getObservationHint(mediaType: Level["mediaType"]) {
  if (mediaType === "video") {
    return "Indice perspicace : observe la synchronisation lèvres/voix, le clignement et les micro-expressions."
  }
  return "Indice perspicace : vérifie les doigts, les reflets, les textes et les ombres."
}

export default function GamesPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [levels, setLevels] = useState<Level[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<boolean | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS)
  const [timeoutRound, setTimeoutRound] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [awarded, setAwarded] = useState(false)
  const router = useRouter()
  const [, startTransition] = useTransition()
  const { addXp } = useXp()

  const current = levels[index]

  useEffect(() => {
    setLevels(buildRandomRounds())
  }, [])

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

  useEffect(() => {
    setMediaError(false)
  }, [index])

  function handleVideoLoadedMetadata() {
    const video = videoRef.current
    if (!video) return
    if (video.duration > CLIP_PREVIEW_SECONDS) {
      video.currentTime = 0.01
    }
  }

  function handleVideoTimeUpdate() {
    const video = videoRef.current
    if (!video) return
    if (video.seeking) return
    if (video.currentTime >= CLIP_PREVIEW_SECONDS - 0.05) {
      video.currentTime = 0.01
    }
  }

  const progress = useMemo(() => {
    if (levels.length === 0) return 0
    return ((index + (confirmed ? 1 : 0)) / levels.length) * 100
  }, [index, confirmed, levels.length])

  function grantXp(finalScore: number) {
    if (awarded) return
    setAwarded(true)
    const xpEarned = finalScore * 80
    if (xpEarned <= 0) {
      router.refresh()
      return
    }
    addXp(xpEarned)
    startTransition(() => {
      awardXp({ amount: xpEarned, source: "game:detective-ia" })
      router.refresh()
    })
  }

  function handleAnswer(choiceIsAI: boolean) {
    if (confirmed || !current) return
    setSelected(choiceIsAI)
    setConfirmed(true)
    if (choiceIsAI === current.isAI) {
      setScore((prev) => prev + 1)
    }
  }

  function handleNext() {
    if (index + 1 >= levels.length) {
      grantXp(score)
      setFinished(true)
      return
    }

    setIndex((prev) => prev + 1)
    setSelected(null)
    setConfirmed(false)
    setTimeLeft(GAME_TIME_SECONDS)
    setTimeoutRound(false)
  }

  function handleRestart() {
    setLevels(buildRandomRounds())
    setIndex(0)
    setSelected(null)
    setConfirmed(false)
    setScore(0)
    setFinished(false)
    setTimeLeft(GAME_TIME_SECONDS)
    setTimeoutRound(false)
    setAwarded(false)
  }

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4 text-white">
        Chargement des niveaux...
      </div>
    )
  }

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
                ? "Parfait !"
                : score >= levels.length / 2
                ? "Bon niveau, continue l'entraînement."
                : "Continue à t'entraîner, tu vas progresser."}
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

  const isCorrect = selected !== null && selected === current.isAI

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
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

        <div className="w-full bg-slate-700 rounded-full h-2">
          <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <Card className="border-purple-500/30 bg-slate-800/80 backdrop-blur text-white shadow-xl">
          <CardHeader className="pb-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">{current.titre}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", mediaStyle(current.mediaType))}>
                    {current.mediaType === "video" ? "VIDÉO" : "IMAGE"}
                  </span>
                  <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", difficultyStyle(current.difficulte))}>
                    {current.difficulte}
                  </span>
                </div>
              </div>
              <p className="text-xs text-purple-100/90 bg-purple-900/40 border border-purple-400/30 rounded-lg px-3 py-2">
                {getObservationHint(current.mediaType)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock3 size={16} className={timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-slate-400"} />
              <span className={timeLeft <= 5 ? "text-red-400 font-bold" : "text-slate-300"}>{timeLeft}s</span>
            </div>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-700">
              {mediaError ? (
                <div className="w-full h-full flex items-center justify-center text-center p-6 text-slate-300">
                  Le média ne se charge pas sur ton réseau.
                </div>
              ) : current.mediaType === "video" ? (
                <>
                  <video
                    key={current.mediaSrc}
                    ref={videoRef}
                    src={current.mediaSrc}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onTimeUpdate={handleVideoTimeUpdate}
                    onError={() => setMediaError(true)}
                  />
                  <div className="absolute top-2 right-2 rounded-full bg-black/65 text-white text-[11px] px-3 py-1 font-semibold">
                    Aperçu {CLIP_PREVIEW_SECONDS}s
                  </div>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.mediaSrc}
                  alt={current.mediaAlt}
                  className="w-full h-full object-cover"
                  onError={() => setMediaError(true)}
                />
              )}
            </div>

            {!confirmed && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/10"
                >
                  ✅ VRAI CONTENU
                </Button>
                <Button onClick={() => handleAnswer(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                  🤖 FAUX IA
                </Button>
              </div>
            )}

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
                    <CheckCircle2 size={18} /> Bonne réponse.
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400 font-semibold">
                    <XCircle size={18} /> Mauvaise réponse, ce n'est pas correct.
                  </div>
                )}
                <p className="text-sm text-slate-300">{current.correction}</p>
                <p className="text-xs text-slate-400 italic">
                  Réponse : {current.isAI ? "Faux contenu IA 🤖" : "Vrai contenu ✅"}
                </p>
                <Button onClick={handleNext} className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white">
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