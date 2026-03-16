'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, CheckCircle2, XCircle, Zap } from 'lucide-react'
import { useState } from 'react'

export function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const questions = [
    {
      id: 1,
      question: 'Quel est le principal défi avec l\'IA générative?',
      options: [
        { id: 'a', text: 'Elle produit toujours des contenus factuellement corrects', correct: false },
        { id: 'b', text: 'Elle peut générer du contenu très convaincant mais potentiellement faux', correct: true },
        { id: 'c', text: 'Elle ne peut pas être utilisée pour générer du texte', correct: false },
        { id: 'd', text: 'Elle identifie automatiquement la désinformation', correct: false }
      ],
      explanation: 'Les modèles d\'IA comme ChatGPT peuvent générer du texte très convaincant, mais sans garantie d\'exactitude. Ils peuvent "halluciner" des informations ou produire du contenu avec des erreurs factuelles.'
    },
    {
      id: 2,
      question: 'Lequel de ces signes est un indicateur potentiel de contenu généré par l\'IA?',
      options: [
        { id: 'a', text: 'Un style très naturel et conversationnel', correct: false },
        { id: 'b', text: 'Beaucoup de détails spécifiques et vérifiables', correct: false },
        { id: 'c', text: 'Des phrases génériques répétitives et un manque de nuance', correct: true },
        { id: 'd', text: 'La présence de citations sources vérifiables', correct: false }
      ],
      explanation: 'Les contenus générés par l\'IA peuvent souvent manquer de nuance, utiliser des phrases génériques ou montrer des patterns répétitifs. Les détails vérifiables et les sources réelles sont plutôt des signes d\'authenticité.'
    },
    {
      id: 3,
      question: 'Que faire si tu soupçonnes qu\'un texte est généré par l\'IA?',
      options: [
        { id: 'a', text: 'Le partager immédiatement sans vérifier', correct: false },
        { id: 'b', text: 'Vérifier les sources, les faits et contrôler les informations', correct: true },
        { id: 'c', text: 'Supposer automatiquement que c\'est faux', correct: false },
        { id: 'd', text: 'Ignorer complètement le contenu', correct: false }
      ],
      explanation: 'La meilleure approche est le fact-checking: vérifier les sources citées, cross-checker les informations factuelles, et consulter d\'autres sources fiables. Cela s\'applique à tous les contenus, IA-générés ou non.'
    }
  ]

  const handleAnswer = (optionId) => {
    if (!answered) {
      setSelectedAnswer(optionId)
      setAnswered(true)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    }
  }

  const currentQ = questions[currentQuestion]
  const selectedOption = currentQ.options.find(opt => opt.id === selectedAnswer)
  const isCorrect = selectedOption?.correct || false
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">Quiz: Détection de contenu IA</h1>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Question Counter */}
        <div className="mb-8">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Question {currentQuestion + 1} sur {questions.length}
          </Badge>
        </div>

        {/* Question Card */}
        <Card className="p-10 mb-8 bg-white border-blue-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswer === option.id
              const showCorrect = answered && option.correct
              const showIncorrect = answered && isSelected && !option.correct

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={answered}
                  className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? showCorrect
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                      : showCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50 cursor-pointer'
                  } ${answered ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                        isSelected && showCorrect
                          ? 'bg-green-200 text-green-700'
                          : isSelected && showIncorrect
                          ? 'bg-red-200 text-red-700'
                          : showCorrect
                          ? 'bg-green-200 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {option.id.toUpperCase()}
                      </div>
                      <span className={`text-lg font-medium ${
                        isSelected && showCorrect
                          ? 'text-green-900'
                          : isSelected && showIncorrect
                          ? 'text-red-900'
                          : showCorrect
                          ? 'text-green-900'
                          : 'text-gray-900'
                      }`}>
                        {option.text}
                      </span>
                    </div>
                    {isSelected && showCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    )}
                    {isSelected && showIncorrect && (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                    {showCorrect && !isSelected && (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className={`p-6 rounded-lg border-l-4 ${
              isCorrect
                ? 'bg-green-50 border-l-green-500'
                : 'bg-blue-50 border-l-blue-500'
            }`}>
              <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-900' : 'text-blue-900'}`}>
                {isCorrect ? '✓ Correct!' : 'Explication:'}
              </p>
              <p className={isCorrect ? 'text-green-800' : 'text-blue-800'}>
                {currentQ.explanation}
              </p>
            </div>
          )}
        </Card>

        {/* Reward Display */}
        {answered && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Récompense</p>
              <p className="text-2xl font-bold text-gray-900">+{isCorrect ? 100 : 25} XP</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              isCorrect
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {isCorrect ? 'Excellente réponse!' : 'Bon essai!'}
            </div>
          </Card>
        )}

        {/* Next Button */}
        {answered && (
          <Button 
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-6 text-lg"
          >
            {currentQuestion === questions.length - 1 ? 'Voir les résultats' : 'Question suivante'}
          </Button>
        )}

        {!answered && (
          <Button 
            onClick={() => handleAnswer(null)}
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
