"use client"

import { useActionState } from "react"
import Link from "next/link"
import { signUp } from "@/lib/auth.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Loader2 } from "lucide-react"

const initialState = { error: "" }

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="size-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <ShieldCheck className="size-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">DetectIA</h1>
            <p className="text-sm text-muted-foreground">Apprends à détecter la désinformation IA</p>
          </div>
        </div>

        {/* Card */}
        <Card className="w-full shadow-md border-border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Créer un compte enseignant</CardTitle>
            <CardDescription>Les comptes eleves ne sont pas requis pour acceder au site.</CardDescription>
          </CardHeader>

          <form action={formAction}>
            <CardContent className="space-y-4">
              {state?.error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="detecteurPro42"
                  required
                  autoComplete="username"
                  minLength={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="toi@exemple.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Minimum 8 caractères.</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Création du compte...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Se connecter
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
