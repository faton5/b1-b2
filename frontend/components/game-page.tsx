'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, Zap, Target, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { useState } from 'react'

export function GamePage() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const levels = [
    {
      id: 1,
      content: 'L\'intelligence artificielle a récemment découvert une nouvelle particule subatomique qui pourrait révolutionner la physique quantique. Cette découverte pourrait conduire au développement de nouveaux ordinateurs quantiques 1000 fois plus puissants.',
      isAI: true,
      difficulty: 'Facile',
      explanation: 'Ce texte présente des signes typiques de contenu IA: utilisation de superlatifs vagues ("révolutionner", "1000 fois plus puissant"), manque de sources spécifiques, et des affirmations grandioses sans détails vérifiables.'
    },
    {
      id: 2,
      content: 'Selon une étude publiée dans Nature en 2024, les chercheurs du MIT ont démontré que les transformers convolutionnels réduisaient la latence d\'inférence de 47% comparé aux modèles précédents. L\'article cité est disponible sous le DOI: 10.1038/nature.2024.xxxxx',
      isAI: false,
      difficulty: 'Moyen',
      explanation: 'Cet exemple ressemble à du contenu humain authentique: il cite une source spécifique avec date, institution, réduction de performance précise (47% pas "beaucoup plus"), et un DOI pour vérification.'
    },
    {
      id: 3,
      content: 'Les plantes poussent mieux quand on leur parle, selon le sentiment de ce texte, probablement parce que cela crée une ambiance positive dans la pièce. C\'est une belle façon de se connecter avec la nature.',
      isAI: true,
      difficulty: 'Moyen',
      explanation: 'Bien que le langage soit naturel, ce texte mélange fait non prouvé avec opinion personnelle, utilise une logique circulaire ("ambiance positive"), et manque de sources scientifiques solides. C\'est un pattern courant de contenu IA.'
    },
    {
      id: 4,
      content: 'Une nouvelle espèce de grenouille a été découverte dans les forêts de Borneo. Elle a été nommée Rhacophorus sapience et mesure 3,2 cm. Les chercheurs notent que la peau translucide de cette espèce permet d\'observer les œufs développant à travers le corps de la mère.',
      isAI: false,
      difficulty: 'Difficile',
      explanation: 'Cet exemple contient des détails spécifiques (nom scientifique, dimensions précises, caractéristique biologique unique). Il utilise un ton neutre et informatif, typique d\'un rapport scientifique authentique.'
    }
  ]

  const currentContent = levels[currentLevel]

  const handleAnswer = (answer) => {
    if (!answered) {
      const isCorrect = (answer === 'ia') === currentContent.isAI
      if (isCorrect) {
        setScore(score + (currentLevel < 2 ? 100 : currentLevel < 4 ? 150 : 200))
      }
      setSelectedAnswer(answer)
      setAnswered(true)
    }
  }

  const handleNext = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    }
  }

  const handleRestart = () => {
    setGameStarted(false)
    setCurrentLevel(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
  }

  const isCorrectAnswer = selectedAnswer && (
    (selectedAnswer === 'ia' && currentContent.isAI) ||
    (selectedAnswer === 'humain' && !currentContent.isAI)
  )

  const progress = ((currentLevel + 1) / levels.length) * 100

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-12 bg-white border-blue-100 shadow-lg">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mx-auto mb-8">
            <Target className="w-10 h-10 text-purple-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Spot the Fake
          </h1>

          <p className="text-lg text-gray-600 text-center mb-8">
            Un mini-jeu gamifié où tu dois identifier si un texte est généré par l\'IA ou écrit par un humain.
          </p>

          <div className="bg-gradient-to-br from-purple-50 to-cyan-50 p-6 rounded-lg mb-8 border border-purple-100">
            <h3 className="font-bold text-gray-900 mb-3">Comment jouer:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Lis attentivement chaque texte</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Décide si c\'est généré par l\'IA ou par un humain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Reçois du feedback immédiat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Gagne des points et déverrouille de nouveaux niveaux</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{levels.length}</div>
              <p className="text-sm text-gray-600">textes à analyser</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">500</div>
              <p className="text-sm text-gray-600">XP à gagner</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-1">~10min</div>
              <p className="text-sm text-gray-600">durée estimée</p>
            </div>
          </div>

          <Button 
            onClick={() => setGameStarted(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white py-6 text-lg font-semibold"
          >
            Démarrer la mission
          </Button>
        </Card>
      </div>
    )
  }

  if (currentLevel === levels.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-12 bg-white border-blue-100 shadow-lg text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-yellow-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mission réussie!</h1>
          <p className="text-xl text-gray-600 mb-8">Excellent travail!</p>

          <Card className="p-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 mb-8">
            <p className="text-sm text-gray-600 mb-2">Score final</p>
            <p className="text-5xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
              {score}
            </p>
            <p className="text-gray-700 font-semibold">+{score} XP gagnés!</p>
          </Card>

          <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">Résumé:</h3>
            <div className="text-left space-y-2 text-gray-700">
              <p>✓ Niveaux complétés: {levels.length}/{levels.length}</p>
              <p>✓ Exactitude: {Math.round(score / (levels.length * 100) * 100)}%</p>
              <p>✓ Badge débloqué: "Détecteur d\'IA"</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={handleRestart}
              className="flex-1 border-gray-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Recommencer
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Retour au tableau de bord
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Spot the Fake</h1>
                  <p className="text-sm text-gray-600">Texte {currentLevel + 1} sur {levels.length}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-yellow-600 font-bold">
                    <Zap className="w-5 h-5" />
                    {score} XP
                  </div>
                </div>
              </div>
              <Progress value={progress} className="h-2 bg-gray-200" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Difficulty Badge */}
        <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
          Difficulté: {currentContent.difficulty}
        </Badge>

        {/* Content Card */}
        <Card className="p-8 mb-8 bg-white border-gray-200 shadow-sm min-h-40 flex items-center">
          <p className="text-xl leading-relaxed text-gray-900">
            "{currentContent.content}"
          </p>
        </Card>

        {/* Question */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Ce texte a-t-il été généré par l\'IA?
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { id: 'ia', label: 'Généré par l\'IA', icon: '🤖' },
            { id: 'humain', label: 'Écrit par un humain', icon: '👤' }
          ].map((option) => {
            const isSelected = selectedAnswer === option.id
            const isOptionCorrect = (option.id === 'ia') === currentContent.isAI
            const showCorrect = answered && isOptionCorrect
            const showIncorrect = answered && isSelected && !isOptionCorrect

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={answered}
                className={`p-8 rounded-xl border-2 text-center transition-all ${
                  isSelected
                    ? showCorrect
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
                    : showCorrect
                    ? 'bg-green-50 border-green-400'
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
                } ${answered && !isSelected && !isOptionCorrect ? 'opacity-50' : ''}`}
              >
                <div className="text-4xl mb-3">{option.icon}</div>
                <p className="font-bold text-lg text-gray-900 mb-2">{option.label}</p>
                
                {isSelected && answered && (
                  <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-current">
                    {showCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-semibold">Exact!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 font-semibold">Incorrect</span>
                      </>
                    )}
                  </div>
                )}

                {showCorrect && !isSelected && (
                  <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-green-400">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold">Bonne réponse</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">Explication:</h3>
            <p className="text-gray-700 leading-relaxed">
              {currentContent.explanation}
            </p>
          </Card>
        )}

        {/* Reward */}
        {answered && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 flex items-center gap-4">
            <Zap className="w-8 h-8 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">Récompense</p>
              <p className="text-2xl font-bold text-gray-900">
                +{isCorrectAnswer ? (currentLevel < 2 ? 100 : currentLevel < 4 ? 150 : 200) : 25} XP
              </p>
            </div>
          </Card>
        )}

        {/* Next Button */}
        {answered && (
          <Button 
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 py-6 text-lg"
          >
            {currentLevel === levels.length - 1 ? 'Voir les résultats' : 'Texte suivant'}
          </Button>
        )}

        {!answered && (
          <Button 
            disabled
            className="w-full opacity-50 cursor-not-allowed py-6 text-lg"
          >
            Sélectionne une réponse pour continuer
          </Button>
        )}
      </div>
    </div>
  )
}
