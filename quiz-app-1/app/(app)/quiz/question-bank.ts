export type OptionKey = "A" | "B" | "C"

export interface QuizOption {
  key: OptionKey
  text: string
}

export interface QuizQuestion {
  id: number
  question: string
  options: QuizOption[]
  answer: OptionKey
}

const abc = (a: string, b: string, c: string): QuizOption[] => [
  { key: "A", text: a },
  { key: "B", text: b },
  { key: "C", text: c },
]

export const QUIZ_QUESTION_BANK: QuizQuestion[] = [
  {
    id: 1,
    question: "Quelle technique génère principalement des Deepfakes ?",
    options: abc("Réseaux Adverses Génératifs (GAN)", "Calcul linéaire", "Algorithme de tri"),
    answer: "A",
  },
  {
    id: 2,
    question: "Qu'est-ce qu'une 'hallucination' en IA générative ?",
    options: abc("Une surchauffe processeur", "Une réponse fausse affirmée avec certitude", "Un bug d'affichage"),
    answer: "B",
  },
  {
    id: 3,
    question: "C'est quoi une hallucination en IA ?",
    options: abc("L'IA invente une réponse fausse", "L'écran clignote", "L'IA voit des fantômes"),
    answer: "A",
  },
  {
    id: 4,
    question: "Quel mot anglais désigne la commande donnée à l'IA ?",
    options: abc("Cheat-code", "Prompt", "Script"),
    answer: "B",
  },
  {
    id: 5,
    question: "Qu'est-ce qu'une fake news ?",
    options: abc("Info ancienne", "Blague TV", "Fausse info pour manipuler"),
    answer: "C",
  },
  {
    id: 6,
    question: "Outil efficace pour vérifier l'origine d'une image ?",
    options: abc("Recherche inversée d'image", "Dictionnaire", "Antivirus"),
    answer: "A",
  },
  {
    id: 7,
    question: "Un texte sans fautes est-il forcément vrai ?",
    options: abc("Oui", "Non, il peut être généré et faux", "Oui, sinon c'est bloqué"),
    answer: "B",
  },
  {
    id: 8,
    question: "Quel détail reste difficile pour les IA d'images ?",
    options: abc("Cheveux", "Nuages", "Mains et doigts"),
    answer: "C",
  },
  {
    id: 9,
    question: "Que signifie LLM ?",
    options: abc("Logiciel Mobile", "Large Language Model", "Lecture de Mots"),
    answer: "B",
  },
  {
    id: 10,
    question: "Face à une image choquante, meilleur réflexe ?",
    options: abc("Partager vite", "S'énerver", "Vérifier la source"),
    answer: "C",
  },
  {
    id: 11,
    question: "Le fact-checking, c'est quoi ?",
    options: abc("Vérifier les faits", "Accepter les CGU", "Bloquer quelqu'un"),
    answer: "A",
  },
  {
    id: 12,
    question: "Sur quoi l'IA apprend-elle principalement ?",
    options: abc("Jeux vidéo", "Données d'entraînement", "Humeur"),
    answer: "B",
  },
  {
    id: 13,
    question: "Le biais d'un modèle, c'est...",
    options: abc("Panne réseau", "Tendance injuste", "Antivirus"),
    answer: "B",
  },
  {
    id: 14,
    question: "Quel indice aide à vérifier une photo ?",
    options: abc("Métadonnées", "Nombre de likes", "Police du texte"),
    answer: "A",
  },
  {
    id: 15,
    question: "Un appel vocal urgent d'un proche peut être...",
    options: abc("Toujours réel", "Un clonage vocal IA", "Un bug"),
    answer: "B",
  },
  {
    id: 16,
    question: "Donnée risquée à donner à un chatbot ?",
    options: abc("Recette", "Numéro de CB", "Blague"),
    answer: "B",
  },
  {
    id: 17,
    question: "Pourquoi recouper une info IA ?",
    options: abc("L'IA peut inventer des sources", "Internet est lent", "Améliore le Wi-Fi"),
    answer: "A",
  },
  {
    id: 18,
    question: "L'IA comprend-elle comme un humain ?",
    options: abc("Oui", "Non, calcul statistique", "Seulement le jour"),
    answer: "B",
  },
  {
    id: 19,
    question: "L'automatisation abusive peut conduire à...",
    options: abc("Moins d'erreurs", "Diffusion massive d'erreurs", "Internet court"),
    answer: "B",
  },
  {
    id: 20,
    question: "Bon usage de l'IA au travail :",
    options: abc("Copier sans relire", "Assistant + revue humaine", "Laisser l'IA décider"),
    answer: "B",
  },
  {
    id: 21,
    question: "Pour éviter la désinformation :",
    options: abc("Partager vite", "Vérifier source/date", "Tout ignorer"),
    answer: "B",
  },
  {
    id: 22,
    question: "Indicateur de texte IA douteux :",
    options: abc("Sources précises", "Phrases vagues répétitives", "Méthodologie"),
    answer: "B",
  },
  {
    id: 23,
    question: "Pourquoi la date d'un post est capitale ?",
    options: abc("Ancienne info décontextualisée", "Format change", "Expire"),
    answer: "A",
  },
  {
    id: 24,
    question: "Une source primaire, c'est...",
    options: abc("Un bruit", "Le document d'origine", "Un tweet"),
    answer: "B",
  },
  {
    id: 25,
    question: "Face à une étude suspecte :",
    options: abc("Vérifier auteurs et revue", "Croire le graphisme", "Lire les likes"),
    answer: "A",
  },
  {
    id: 26,
    question: "Un titre choc doit...",
    options: abc("Être cru d'office", "Inciter à la prudence", "Être liké"),
    answer: "B",
  },
  {
    id: 27,
    question: "Le biais de confirmation, c'est...",
    options: abc("Vérifier tout", "Chercher ce qui nous arrange", "Lire l'opposé"),
    answer: "B",
  },
  {
    id: 28,
    question: "Santé et chatbot :",
    options: abc("Faire confiance", "Valider avec un médecin", "Interdit"),
    answer: "B",
  },
  {
    id: 29,
    question: "Vérifier un audio suspect :",
    options: abc("Recoupement d'infos", "Écouter fort", "Croire le ton"),
    answer: "A",
  },
  {
    id: 30,
    question: "Texte flou sur une image :",
    options: abc("Vrai à 100%", "Possible génération IA", "Sable"),
    answer: "B",
  },
  {
    id: 31,
    question: "Source IA introuvable ?",
    options: abc("Bug écran", "Hallucination IA", "Source secrète"),
    answer: "B",
  },
  {
    id: 32,
    question: "Info IA périmée ?",
    options: abc("Pas d'accès temps réel", "L'IA est timide", "Le serveur dort"),
    answer: "A",
  },
  {
    id: 33,
    question: "Détecteur IA ?",
    options: abc("Infaillible", "Indice non absolu", "Légal"),
    answer: "B",
  },
  {
    id: 34,
    question: "IA en entreprise :",
    options: abc("Contrôle humain", "Zéro contrôle", "Mode libre"),
    answer: "A",
  },
  {
    id: 35,
    question: "Clés API dans chatbot public ?",
    options: abc("Sans danger", "Danger sécurité", "Utile"),
    answer: "B",
  },
  {
    id: 36,
    question: "RGPD c'est...",
    options: abc("Recette web", "Protection données", "Type de processeur"),
    answer: "B",
  },
  {
    id: 37,
    question: "Pourquoi signaler ?",
    options: abc("Stopper la manipulation", "Gagner du temps", "Pour rire"),
    answer: "A",
  },
  {
    id: 38,
    question: "Image parfaite sans auteur :",
    options: abc("Partager", "Douter et chercher", "Cadrer"),
    answer: "B",
  },
  {
    id: 39,
    question: "Un agent IA ?",
    options: abc("Planifie des tâches", "Ne parle pas", "Est un humain"),
    answer: "A",
  },
  {
    id: 40,
    question: "Risque agent IA non cadré :",
    options: abc("Erreurs en série", "Plus de RAM", "Changement de couleur"),
    answer: "A",
  },
  {
    id: 41,
    question: "Consanguinité IA ?",
    options: abc("Entraînement sur du contenu IA", "Modèles liés", "Vitesse"),
    answer: "A",
  },
  {
    id: 42,
    question: "Chiffre choc ?",
    options: abc("Chercher la méthode", "Retweeter", "Copier"),
    answer: "A",
  },
  {
    id: 43,
    question: "Source anonyme ?",
    options: abc("Vrai", "Prudence extrême", "Génial"),
    answer: "B",
  },
  {
    id: 44,
    question: "Contre la manipulation :",
    options: abc("Esprit critique", "Vitesse", "Ignorance"),
    answer: "A",
  },
  {
    id: 45,
    question: "Photo de guerre ?",
    options: abc("Vérifier lieu et date", "Croire le titre", "Supprimer"),
    answer: "A",
  },
  {
    id: 46,
    question: "Bots en masse ?",
    options: abc("Succès réel", "Manipulation d'opinion", "Mise à jour"),
    answer: "B",
  },
  {
    id: 47,
    question: "IA et verification ?",
    options: abc("L'IA remplace l'humain", "Outil d'aide", "Inutile"),
    answer: "B",
  },
  {
    id: 48,
    question: "Géolocalisation ?",
    options: abc("Chercher des indices visuels", "Fermer les yeux", "Payer"),
    answer: "A",
  },
  {
    id: 49,
    question: "Vidéo tronquée ?",
    options: abc("Enlève le contexte", "Plus belle", "Rapide"),
    answer: "A",
  },
  {
    id: 50,
    question: "Doute sur une info ?",
    options: abc("Diffuser", "Vérifier avant d'agir", "Oublier"),
    answer: "B",
  },
]

export function pickRandomQuestions(count = 50): QuizQuestion[] {
  const arr = [...QUIZ_QUESTION_BANK]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, count)
}