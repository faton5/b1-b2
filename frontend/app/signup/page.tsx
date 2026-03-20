"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { signUp } from "@/lib/auth.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const initialState = { error: "" }

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState)
  const [accountType, setAccountType] = useState<"student" | "teacher">("student")

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <ShieldCheck className="size-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">DetectIA</h1>
            <p className="text-sm text-muted-foreground">Apprends a detecter la desinformation IA</p>
          </div>
        </div>

        <Card className="w-full border-border shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Creer un compte</CardTitle>
            <CardDescription>
              Les eleves doivent saisir le code genere dans le dashboard du professeur.
            </CardDescription>
          </CardHeader>

          <form action={formAction}>
            <CardContent className="space-y-4">
              {state?.error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <Label>Type de compte</Label>
                <input type="hidden" name="accountType" value={accountType} />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType("student")}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      accountType === "student"
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    Compte eleve
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("teacher")}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      accountType === "teacher"
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    Compte professeur
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="detecteur42"
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
                  placeholder={accountType === "teacher" ? "nom@prof.com" : "toi@exemple.com"}
                  required
                  autoComplete="email"
                  pattern={accountType === "teacher" ? "^[^@\\s]+@prof\\.com$" : undefined}
                  title={accountType === "teacher" ? "Un compte professeur doit utiliser une adresse @prof.com" : undefined}
                />
                {accountType === "teacher" ? (
                  <p className="text-xs text-muted-foreground">
                    Les comptes professeurs acceptent uniquement les adresses en <span className="font-medium">@prof.com</span>.
                  </p>
                ) : null}
              </div>

              {accountType === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Code eleve</Label>
                  <Input
                    id="accessCode"
                    name="accessCode"
                    type="text"
                    placeholder="ELEVE-AB12-CD34"
                    required
                    autoCapitalize="characters"
                    autoCorrect="off"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ce code est genere par le professeur depuis son panel admin.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Minimum 8 caracteres.</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creation du compte...
                  </>
                ) : (
                  "Creer mon compte"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Deja un compte ?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
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
