'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Lock, Star, Shield, Zap, Brain, Target, Flame, ChevronLeft } from 'lucide-react'

export function BadgesPage() {
  const allBadges = [
    {
      id: 1,
      name: 'Premier Pas',
      description: 'Tu as commencé ton aventure',
      icon: Star,
      locked: false,
      earned: true,
      earnedDate: '15 mars 2024',
      xpReward: 100
    },
    {
      id: 2,
      name: 'Apprenti',
      description: 'Atteindre le niveau 3',
      icon: Shield,
      locked: false,
      earned: true,
      earnedDate: '18 mars 2024',
      xpReward: 150
    },
    {
      id: 3,
      name: 'Détecteur d\'IA',
      description: 'Compléter le mini-jeu Spot the Fake',
      icon: Target,
      locked: false,
      earned: true,
      earnedDate: '20 mars 2024',
      xpReward: 200
    },
    {
      id: 4,
      name: 'Quiz Master',
      description: 'Répondre correctement à 10 quiz',
      icon: Brain,
      locked: false,
      earned: true,
      earnedDate: '22 mars 2024',
      xpReward: 250
    },
    {
      id: 5,
      name: 'Maître Détecteur',
      description: 'Atteindre le niveau 10',
      icon: Trophy,
      locked: true,
      earned: false,
      requirement: 'Niveau 10 requis',
      xpReward: 500
    },
    {
      id: 6,
      name: 'En Feu',
      description: 'Maintenir une streak de 30 jours',
      icon: Flame,
      locked: true,
      earned: false,
      requirement: '30 jours consécutifs',
      xpReward: 400
    },
    {
      id: 7,
      name: 'Expert IA',
      description: 'Compléter tous les modules',
      icon: Zap,
      locked: true,
      earned: false,
      requirement: 'Tous les modules requis',
      xpReward: 600
    },
    {
      id: 8,
      name: 'Légende',
      description: 'Atteindre le niveau 25',
      icon: Trophy,
      locked: true,
      earned: false,
      requirement: 'Niveau 25 requis',
      xpReward: 1000
    }
  ]

  const earnedBadges = allBadges.filter(b => b.earned)
  const lockedBadges = allBadges.filter(b => b.locked)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Badges & Récompenses</h1>
            <p className="text-sm text-gray-600">Voir tous tes succès et défis</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white border-blue-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Badges obtenus</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{earnedBadges.length}</p>
                <p className="text-xs text-gray-500 mt-1">sur {allBadges.length}</p>
              </div>
              <Trophy className="w-12 h-12 text-blue-300" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-purple-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">XP gagnés</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">2,450</p>
                <p className="text-xs text-gray-500 mt-1">XP totaux</p>
              </div>
              <Zap className="w-12 h-12 text-purple-300" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-cyan-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Débloquer</p>
                <p className="text-4xl font-bold text-cyan-600 mt-2">{lockedBadges.length}</p>
                <p className="text-xs text-gray-500 mt-1">badges disponibles</p>
              </div>
              <Lock className="w-12 h-12 text-cyan-300" />
            </div>
          </Card>
        </div>

        {/* Earned Badges Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Badges Obtenus ({earnedBadges.length})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => {
              const Icon = badge.icon
              return (
                <Card 
                  key={badge.id}
                  className="p-6 text-center bg-white border-2 border-yellow-200 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                  <div className="flex items-center justify-center gap-1 text-sm font-semibold text-yellow-600 mb-3">
                    <Zap className="w-4 h-4" />
                    +{badge.xpReward} XP
                  </div>
                  <p className="text-xs text-gray-500 border-t border-yellow-100 pt-3 mt-3">
                    Obtenu le {badge.earnedDate}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Locked Badges Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-6 h-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900">Badges à débloquer ({lockedBadges.length})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lockedBadges.map((badge) => {
              const Icon = badge.icon
              return (
                <Card 
                  key={badge.id}
                  className="p-6 text-center bg-gray-50 border-2 border-gray-200 opacity-60 cursor-not-allowed"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 relative">
                    <Icon className="w-8 h-8 text-gray-400" />
                    <Lock className="w-5 h-5 text-gray-500 absolute bottom-0 right-0 bg-white rounded-full p-0.5" />
                  </div>
                  <h3 className="font-bold text-gray-700 mb-2">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                  <div className="flex items-center justify-center gap-1 text-sm font-semibold text-gray-500 mb-3">
                    <Zap className="w-4 h-4" />
                    +{badge.xpReward} XP
                  </div>
                  <p className="text-xs text-gray-500 border-t border-gray-300 pt-3 mt-3 font-medium">
                    {badge.requirement}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Progression Tips */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Conseils pour débloquer plus de badges</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700">Complete les modules pédagogiques restants pour débloquer "Expert IA"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700">Reviens tous les jours pour maintenir ta streak et débloquer "En Feu"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700">Progresse vers le niveau 10 pour débloquer "Maître Détecteur"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700">Complète tous les défis pour atteindre "Légende" (niveau 25)</span>
            </li>
          </ul>
        </Card>

        <div className="mt-8 pb-8">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-6 text-lg">
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  )
}
