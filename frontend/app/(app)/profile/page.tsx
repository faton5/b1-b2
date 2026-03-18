"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { User, Trophy, Star, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [pseudo, setPseudo] = useState(session?.user?.name || (session?.user as any)?.pseudo || "Utilisateur");
  const [isSaving, setIsSaving] = useState(false);

  // Mocking player stats since Client component won't easily fetch Prisma here directly without API
  // In a real implementation this would be fetched via React Query or a server action
  const stats = {
    level: 5,
    totalExp: 1450,
    nextDbExp: 2000,
    badges: [
      { id: 1, name: "Welcome to AI", icon: "Sparkles" },
      { id: 2, name: "First Steps", icon: "Star" },
    ]
  };

  const expProgress = (stats.totalExp % 1000) / 10; // Simple percentage calculation

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulation d'une API call pour modifier le pseudo
    setTimeout(() => {
      setIsSaving(false);
      update({ pseudo });
      toast.success("Profil mis à jour", { description: "Votre pseudo a bien été enregistré." });
    }, 1000);
  }

  const renderIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'sparkles': return <Sparkles className="text-yellow-500" size={32} />;
      case 'star': return <Star className="text-yellow-500" size={32} />;
      case 'trophy': return <Trophy className="text-yellow-500" size={32} />;
      default: return <Award className="text-yellow-500" size={32} />;
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl px-4">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Paramètres & infos utilisateur */}
        <Card className="col-span-1 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <User size={24} /> Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={session?.user?.email || "student@example.com"} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pseudo">Pseudo</Label>
                <Input 
                  id="pseudo" 
                  value={pseudo} 
                  onChange={(e) => setPseudo(e.target.value)} 
                  placeholder="Votre super pseudo"
                />
              </div>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? "Enregistrement..." : "Sauvegarder"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Gamification Stats */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-2xl">
                <span>Niveau {stats.level}</span>
                <span className="text-primary font-mono text-xl">{stats.totalExp} XP</span>
              </CardTitle>
              <CardDescription>
                Progression vers le niveau {stats.level + 1}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={expProgress} className="h-4" />
              <p className="text-right text-sm text-muted-foreground mt-2 font-mono">
                {stats.totalExp} / {stats.nextDbExp} XP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Salle des trophées</CardTitle>
              <CardDescription>Les badges que vous avez débloqués</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {stats.badges.map((b) => (
                  <div key={b.id} className="flex flex-col items-center justify-center p-4 border rounded-xl bg-card hover:bg-muted/50 transition-colors">
                    {renderIcon(b.icon)}
                    <span className="mt-2 text-sm font-medium text-center">{b.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}
