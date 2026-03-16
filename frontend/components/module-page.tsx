'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, BookOpen, Brain, Zap, Check, AlertCircle } from 'lucide-react'

export function ModulePage() {
  const moduleProgress = 75

  const sections = [
    {
      id: 1,
      title: 'Qu\'est-ce que l\'IA?',
      content: 'L\'intelligence artificielle (IA) est un ensemble de technologies qui permettent à un ordinateur de reproduire des comportements intelligents. Les systèmes d\'IA modernes peuvent apprendre à partir de données et améliorer leurs performances au fil du temps.',
      icon: Brain,
      completed: true
    },
    {
      id: 2,
      title: 'Comment fonctionne le machine learning?',
      content: 'Le machine learning est une branche de l\'IA où les programmes apprennent à partir d\'exemples au lieu d\'être programmés explicitement. L\'IA analyse de grandes quantités de données, identifie des motifs et fait des prédictions basées sur ces motifs.',
      icon: Brain,
      completed: true
    },
    {
      id: 3,
      title: 'La génération de contenu',
      content: 'Les modèles de langage comme les LLM (Large Language Models) peuvent générer du texte de manière très convaincante. Ils prédisent le mot suivant basé sur le contexte précédent, créant ainsi des phrases fluides mais parfois inexactes.',
      icon: BookOpen,
      completed: false
    },
    {
      id: 4,
      title: 'Les risques de la désinformation IA',
      content: 'La désinformation générée par l\'IA peut être très convaincante et se propager rapidement. Elle peut contenir des erreurs factuelles, des biais ou intentionnellement tromper les lecteurs. Il est crucial de développer des compétences pour l\'identifier.',
      icon: AlertCircle,
      completed: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Comment l\'IA génère du texte</h1>
            <p className="text-sm text-gray-600">Module 2 sur 5</p>
          </div>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">75% complété</Badge>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Module Header */}
        <Card className="p-8 mb-8 bg-white border-blue-100 shadow-sm">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <Badge className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                <BookOpen className="w-3 h-3 mr-1" />
                Module pédagogique
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Comment l\'IA génère du texte
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Comprends les mécanismes derrière la génération de contenu IA et apprends à identifier les patterns caractéristiques des textes générés de manière suspecte.
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Progression du module</span>
              <span className="font-semibold text-gray-900">{moduleProgress}%</span>
            </div>
            <Progress value={moduleProgress} className="h-2 bg-gray-100" />
          </div>
        </Card>

        {/* Content Sections */}
        <div className="space-y-4 mb-8">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card 
                key={section.id}
                className={`p-6 border-2 transition-all hover:shadow-md cursor-pointer ${
                  section.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {section.completed ? (
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-blue-600">{index + 1}</span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                      {section.completed && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          Complété
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>

                {!section.completed && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button 
                      variant="default" 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Lire cette section
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Key Takeaways */}
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Points clés à retenir</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Les modèles IA prédisent le prochain mot basé sur le contexte précédent</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Le texte généré peut être très fluide et convaincant, même s\'il contient des erreurs</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Les patterns répétitifs et les phrases génériques sont des signes révélateurs</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Vérifier les sources et les faits est toujours important</span>
            </li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pb-8">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-200"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Module précédent
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Continuer
            <Zap className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
