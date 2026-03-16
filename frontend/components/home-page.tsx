'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Brain, Gamepad2, TrendingUp, Sparkles } from 'lucide-react'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">DetectIA</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">Ressources</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">À propos</a>
            <Button variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Commencer
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border border-blue-200">
          <Sparkles className="w-3 h-3 mr-1" />
          Apprendre à détecter la désinformation
        </Badge>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Maîtrise l'IA et
          <br />
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            repère les fakes
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Découvre comment fonctionne l'IA, identifie les contenus générés de manière suspecte et deviens un expert en détection de désinformation.
        </p>

        <Button 
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Commencer l'aventure
        </Button>
      </section>

      {/* Features Overview */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">Ce qui t'attend</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Learning Card */}
          <Card className="p-8 border border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Modules d'apprentissage</h3>
            <p className="text-gray-600 leading-relaxed">
              Comprends les bases de l'IA, comment elle génère du contenu et les signes révélateurs des fakes.
            </p>
          </Card>

          {/* Quiz Card */}
          <Card className="p-8 border border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quiz interactifs</h3>
            <p className="text-gray-600 leading-relaxed">
              Teste tes connaissances avec des quiz amusants et reçois du feedback immédiat pour progresser.
            </p>
          </Card>

          {/* Game Card */}
          <Card className="p-8 border border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-lg group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Mini-jeux</h3>
            <p className="text-gray-600 leading-relaxed">
              Joue et apprends en même temps avec des mini-jeux gamifiés qui rendent l'apprentissage amusant.
            </p>
          </Card>
        </div>

        {/* Progression System */}
        <div className="mt-16 p-8 bg-white rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Progresse et déverrouille des récompenses</h3>
              <p className="text-gray-600 mb-4">
                Gagne de l'XP, monte en niveau, collecte des badges et débloquer de nouveaux défis. Vois ta progression en temps réel avec notre système de gamification.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-blue-200 text-blue-700">Niveaux</Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-700">Badges</Badge>
                <Badge variant="outline" className="border-cyan-200 text-cyan-700">Missions</Badge>
                <Badge variant="outline" className="border-green-200 text-green-700">XP</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Prêt à devenir un expert en détection de fakes ?</h2>
          <p className="text-lg text-white/90 mb-8">Commence ton aventure maintenant et maîtrise les techniques pour identifier la désinformation.</p>
          <Button 
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-semibold"
          >
            Commencer l'aventure
          </Button>
        </div>
      </section>
    </div>
  )
}
