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
      title: "Culture générale sur l'IA",
      content:
        "L'intelligence artificielle (IA) regroupe différents outils capables de traiter de grandes quantités de données pour reconnaître des motifs, faire des prédictions ou générer du contenu. Elle reste cependant limitée par ses données d'entraînement et ne possède ni conscience ni intentions propres.",
      icon: Brain,
      completed: true,
    },
    {
      id: 2,
      title: "Générations d'IA : toujours vérifier",
      content:
        "Qu'il s'agisse de textes, d'images ou de vidéos, les modèles génératifs peuvent produire des résultats impressionnants mais parfois totalement faux. Il est indispensable de garder le réflexe de vérifier les faits, les sources et la cohérence avant de faire confiance.",
      icon: AlertCircle,
      completed: true,
    },
    {
      id: 3,
      title: "Fake news et amplification par l'IA",
      content:
        "Les systèmes d'IA peuvent générer et relayer des contenus trompeurs à grande échelle. Comprendre comment les fake news se propagent aide à garder une distance critique, à recouper l'information et à éviter de relayer des contenus douteux.",
      icon: BookOpen,
      completed: false,
    },
    {
      id: 4,
      title: "Bien utiliser l'IA au travail",
      content:
        "L'IA peut t'aider à gagner du temps, explorer des idées ou intégrer des fonctionnalités, mais elle ne doit pas remplacer ta réflexion. L'objectif est de l'utiliser comme un assistant qui augmente tes capacités, pas comme un pilote automatique qui décide à ta place.",
      icon: Brain,
      completed: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Comprendre et utiliser l&apos;IA de façon responsable</h1>
            <p className="text-sm text-gray-600">Module 1 sur 8</p>
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
                Module pédagogique – Sensibilisation IA
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprendre et utiliser l&apos;IA de façon responsable</h1>
              <p className="text-gray-600 leading-relaxed">
                Ce module t&apos;aide à comprendre ce qu&apos;est réellement l&apos;IA, à repérer ses limites et ses dérives possibles
                (fake news, contenus trompeurs, dépendance), et à l&apos;utiliser comme un outil au service de ton apprentissage et de ton travail.
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
              <span className="text-gray-700">
                L&apos;IA n&apos;est pas infaillible : elle peut générer des erreurs, des biais ou des contenus totalement faux.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                Il est essentiel de vérifier les sources, de recouper l&apos;information et de garder un esprit critique.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                L&apos;IA doit rester un assistant : c&apos;est à toi de comprendre, décider et assumer les choix finaux.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                Préserver tes relations sociales et ta capacité de réflexion est plus important que tout gain de confort.
              </span>
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
