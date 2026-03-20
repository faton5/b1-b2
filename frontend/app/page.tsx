'use client'

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ArrowRight, BookOpen, Gamepad2, HelpCircle, Menu, ShieldCheck, Trophy } from "lucide-react"

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
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { href: "#features", label: "Ressources" },
    { href: "#about", label: "À propos" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">DetectIA</span>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
            <Button variant="ghost" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Créer un compte</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] sm:max-w-sm">
                <SheetHeader className="border-b border-border px-1 pb-4">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 px-1 pt-2">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/login">Se connecter</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="justify-start" asChild>
                      <Link href="/signup">Créer un compte</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:px-6 sm:py-20 lg:py-24 max-w-3xl mx-auto space-y-6 sm:space-y-8">
        <div className="size-16 sm:size-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg">
          <ShieldCheck className="size-10 text-primary-foreground" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight">
            Apprends à détecter la désinformation générée par IA
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-xl mx-auto leading-relaxed">
            DetectIA est une plateforme éducative et gamifiée qui t'apprend à reconnaître les deepfakes, les textes générés par IA et les fausses informations.
          </p>
        </div>
        <div className="flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Button size="lg" asChild className="w-full sm:w-auto gap-2 px-8 justify-center">
            <Link href="/signup">
              Commencer gratuitement
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto justify-center">
            <Link href="/login">{"J'ai déjà un compte"}</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-card border-t border-border px-4 py-16 sm:px-6 lg:px-8">
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
      <footer id="about" className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground bg-card sm:px-6">
        DetectIA — Plateforme éducative sur la désinformation IA
      </footer>
    </div>
  )
}
