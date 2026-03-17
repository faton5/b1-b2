import Link from "next/link"
import { notFound } from "next/navigation"
import { modules } from "@/lib/modules-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Brain, ChevronLeft, Zap, Check } from "lucide-react"

type Props = {
  params: { slug: string }
}

export default function ModuleDetailPage({ params }: Props) {
  const mod = modules.find((m) => m.slug === params.slug)
  if (!mod) notFound()

  const moduleProgress = 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      <header className="border-b border-blue-100 bg-white/50 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Link href="/modules">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{mod.title}</h1>
            <p className="text-sm text-gray-600">Module {mod.id} sur {modules.length}</p>
          </div>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            {mod.xp} XP
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        <Card className="p-8 bg-white border-blue-100 shadow-sm">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <Badge className="mb-3 bg-blue-100 text-blue-700 border-blue-200">
                <BookOpen className="w-3 h-3 mr-1" />
                Module pédagogique
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{mod.title}</h1>
              <p className="text-gray-600 leading-relaxed">{mod.description}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Progression du module</span>
              <span className="font-semibold text-gray-900">{moduleProgress}%</span>
            </div>
            <Progress value={moduleProgress} className="h-2 bg-gray-100" />
          </div>
        </Card>

        <div className="space-y-4">
          {mod.sections.map((section, index) => (
            <Card
              key={section.title}
              className="p-6 border-2 bg-white border-gray-200 hover:border-blue-200 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {mod.resources.length > 0 && (
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-100">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-bold text-gray-900">Ressources à explorer</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <ul className="space-y-3">
                {mod.resources.map((res) => (
                  <li key={res.href} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <a
                      href={res.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-700 underline underline-offset-2"
                    >
                      {res.label}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

