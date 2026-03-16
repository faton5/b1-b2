'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Gamepad2, Brain, Trophy, Zap, Lock, ArrowRight, Star, Shield } from 'lucide-react'

export function DashboardPage() {
  // Mock user data
  const userLevel = 5
  const userXP = 2450
  const xpToNextLevel = 5000
  const xpProgress = (userXP / xpToNextLevel) * 100

  const missions = [
    { id: 1, title: 'Les Bases de l\'IA', type: 'module', icon: BookOpen, status: 'completed', xpReward: 250 },
    { id: 2, title: 'Comment l\'IA génère du texte', type: 'module', icon: Brain, status: 'active', xpReward: 300 },
    { id: 3, title: 'Quiz: Détection de contenu IA', type: 'quiz', icon: Brain, status: 'locked', xpReward: 200 },
    { id: 4, title: 'Mini-jeu: Spot the Fake', type: 'game', icon: Gamepad2, status: 'locked', xpReward: 400 },
    { id: 5, title: 'Images IA - Signes distinctifs', type: 'module', icon: BookOpen, status: 'locked', xpReward: 300 },
    { id: 6, title: 'Quiz: Faux ou réel', type: 'quiz', icon: Brain, status: 'locked', xpReward: 250 },
  ]

  const badges = [
    { id: 1, name: 'Novice', description: 'Premier pas', icon: Star },
    { id: 2, name: 'Apprenti', description: 'Niveau 3 atteint', icon: Shield },
    { id: 3, name: 'Détecteur', description: 'Quiz complété', icon: Trophy },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-50 border-green-200'
      case 'active': return 'bg-blue-50 border-blue-200'
      case 'locked': return 'bg-gray-50 border-gray-200'
      default: return 'bg-white border-gray-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <Badge className="bg-green-100 text-green-700 border-green-200">✓ Complété</Badge>
      case 'active': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">En cours</Badge>
      case 'locked': return <Badge className="bg-gray-100 text-gray-700 border-gray-200"><Lock className="w-3 h-3 mr-1" />Verrouillé</Badge>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">DetectIA</span>
          </div>
          <Button variant="outline" className="border-gray-200">Déconnexion</Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Player Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Profile Card */}
          <Card className="lg:col-span-2 p-8 bg-white border-blue-100 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue, Apprenti Détecteur!</h1>
                <p className="text-gray-600">Continue ton aventure pour devenir un expert en détection de fakes</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Niv. {userLevel}
                </div>
                <p className="text-sm text-gray-600">Expert en devenir</p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Progression</span>
                <span className="text-sm font-semibold text-gray-900">{userXP} / {xpToNextLevel} XP</span>
              </div>
              <div className="space-y-2">
                <Progress value={xpProgress} className="h-3 bg-gray-100" />
                <p className="text-xs text-gray-500">{(xpToNextLevel - userXP)} XP avant le prochain niveau</p>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Modules</p>
                  <p className="text-3xl font-bold text-blue-900">5</p>
                  <p className="text-xs text-blue-600 mt-1">2 complétés</p>
                </div>
                <BookOpen className="w-12 h-12 text-blue-300" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Badges</p>
                  <p className="text-3xl font-bold text-purple-900">3</p>
                  <p className="text-xs text-purple-600 mt-1">+2 en attente</p>
                </div>
                <Trophy className="w-12 h-12 text-purple-300" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-700 font-medium">Streak</p>
                  <p className="text-3xl font-bold text-cyan-900">7</p>
                  <p className="text-xs text-cyan-600 mt-1">jours consécutifs</p>
                </div>
                <Zap className="w-12 h-12 text-cyan-300" />
              </div>
            </Card>
          </div>
        </div>

        {/* Missions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Missions disponibles</h2>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">6 missions</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missions.map((mission) => {
              const Icon = mission.icon
              const isLocked = mission.status === 'locked'
              
              return (
                <Card 
                  key={mission.id}
                  className={`p-6 border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(mission.status)} ${isLocked ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        mission.status === 'completed' ? 'bg-green-100' :
                        mission.status === 'active' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          mission.status === 'completed' ? 'text-green-600' :
                          mission.status === 'active' ? 'text-blue-600' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{mission.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{mission.type}</p>
                      </div>
                    </div>
                    {getStatusBadge(mission.status)}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      +{mission.xpReward} XP
                    </div>
                    {!isLocked && (
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Badges Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Badges Obtenus</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const Icon = badge.icon
              return (
                <Card key={badge.id} className="p-6 text-center border-blue-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
