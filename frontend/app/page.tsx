import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, BookOpen, HelpCircle, Gamepad2, Trophy, ArrowRight } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Modules pédagogiques",
    description: "Des contenus clairs et progressifs sur la désinformation générée par IA.",
  },
  {
    icon: HelpCircle,
    title: "Quiz interactifs",
    description: "Teste tes connaissances et gagne de l'XP à chaque bonne réponse.",
  },
  {
    icon: Gamepad2,
    title: "Mini-jeux",
    description: "Spot the Fake : détermine si un texte a été écrit par un humain ou une IA.",
  },
  {
    icon: Trophy,
    title: "Badges & progression",
    description: "Monte en niveau, débloque des badges et suis ta progression.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">DetectIA</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Créer un compte</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-3xl mx-auto space-y-8">
        <div className="size-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg">
          <ShieldCheck className="size-10 text-primary-foreground" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight">
            Apprends à détecter la désinformation générée par IA
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-xl mx-auto leading-relaxed">
            DetectIA est une plateforme éducative et gamifiée qui t'apprend à reconnaître les deepfakes, les textes générés par IA et les fausses informations.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button size="lg" asChild className="gap-2 px-8">
            <Link href="/signup">
              Commencer gratuitement
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">{"J'ai déjà un compte"}</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card border-t border-border px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center text-balance mb-10">
            Tout ce qu'il te faut pour apprendre
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-xl border border-border hover:shadow-md transition-shadow"
              >
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="size-6 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 text-center text-sm text-muted-foreground bg-card">
        DetectIA — Plateforme éducative sur la désinformation IA
      </footer>
    </div>
  )
}
