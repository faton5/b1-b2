"use client";

import { useState } from "next";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function MockChatPage() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Bonjour ! Je suis l'assistant de l'AI Academy. Pose-moi une question sur le fonctionnement de l'IA." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const predefinedAnswers = [
    "C'est une excellente question ! L'IA fonctionne grâce à des algorithmes entraînés sur de vastes quantités de données.",
    "Les réseaux de neurones s'inspirent du cerveau humain pour reconnaître des motifs complexes.",
    "Attention aux hallucinations ! Parfois, l'IA génère des réponses plausibles mais totalement fausses.",
    "L'apprentissage automatique (Machine Learning) permet à la machine de s'améliorer avec l'expérience."
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const msg = input;
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and gamification EXP
    setTimeout(() => {
      const randomAnswer = predefinedAnswers[Math.floor(Math.random() * predefinedAnswers.length)];
      setMessages(prev => [...prev, { role: "ai", content: randomAnswer }]);
      setIsTyping(false);

      // Simulate gaining EXP for interacting
      toast.success("+10 EXP gagnés !", {
        description: "Interaction réussie avec l'assistant."
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl h-[calc(100vh-100px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">Chat Assistant</h1>

      <div className="flex-1 border rounded-xl overflow-hidden bg-card flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`p-2 rounded-full ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.role === "ai" ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`rounded-lg p-3 max-w-[80%] ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-3 flex-row">
                <div className="p-2 rounded-full bg-muted">
                  <Bot size={20} />
                </div>
                <div className="rounded-lg p-3 bg-muted text-foreground flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-150"></span>
                  <span className="w-2 h-2 rounded-full bg-primary/80 animate-bounce delay-300"></span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSend} className="p-4 border-t bg-background flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question à l'IA..."
            className="flex-1"
          />
          <Button type="submit" disabled={isTyping || !input.trim()}>
            <Send size={18} className="mr-2" />
            Envoyer
          </Button>
        </form>
      </div>
    </div>
  )
}
