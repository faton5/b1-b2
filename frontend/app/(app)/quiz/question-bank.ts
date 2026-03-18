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
    question: "Quelle technologie est le plus souvent utilisée pour créer des deepfakes ?",
    options: abc("Réseaux Adverses Génératifs (GAN)", "Calcul linéaire", "Algorithme de tri"),
    answer: "A",
  },
  {
    id: 2,
    question: "Qu'appelle-t-on une hallucination en IA générative ?",
    options: abc("Une surchauffe processeur", "Une réponse fausse affirmée avec certitude", "Un bug d'affichage"),
    answer: "B",
  },
  {
    id: 3,
    question: "Comment appelle-t-on l'instruction que tu donnes à une IA ?",
    options: abc("Cheat-code", "Prompt", "Script"),
    answer: "B",
  },
  {
    id: 4,
    question: "Qu'est-ce qu'une fake news ?",
    options: abc("Info ancienne", "Blague TV", "Fausse info pour manipuler"),
    answer: "C",
  },
  {
    id: 5,
    question: "Quel outil est le plus utile pour vérifier l'origine d'une image ?",
    options: abc("Recherche inversée d'image", "Dictionnaire", "Antivirus"),
    answer: "A",
  },
  {
    id: 6,
    question: "Un texte sans faute est-il forcément vrai ?",
    options: abc("Oui", "Non, il peut être généré et faux", "Oui, sinon c'est bloqué"),
    answer: "B",
  },
  {
    id: 7,
    question: "Quel détail les IA d'image ratent-elles souvent ?",
    options: abc("Cheveux", "Nuages", "Mains et doigts"),
    answer: "C",
  },
  {
    id: 8,
    question: "Que signifie l'acronyme LLM ?",
    options: abc("Logiciel Mobile", "Large Language Model", "Lecture de Mots"),
    answer: "B",
  },
  {
    id: 9,
    question: "Face à une image choquante, quel est le meilleur réflexe ?",
    options: abc("Partager vite", "S'énerver", "Vérifier la source"),
    answer: "C",
  },
  {
    id: 10,
    question: "Le fact-checking, c'est quoi exactement ?",
    options: abc("Vérifier les faits", "Accepter les CGU", "Bloquer quelqu'un"),
    answer: "A",
  },
  {
    id: 11,
    question: "Sur quoi une IA apprend-elle principalement ?",
    options: abc("Jeux vidéo", "Données d'entraînement", "Humeur"),
    answer: "B",
  },
  {
    id: 12,
    question: "Que veut dire le biais d'un modèle d'IA ?",
    options: abc("Panne réseau", "Tendance injuste", "Antivirus"),
    answer: "B",
  },
  {
    id: 13,
    question: "Quel indice peut aider à vérifier une photo en ligne ?",
    options: abc("Métadonnées", "Nombre de likes", "Police du texte"),
    answer: "A",
  },
  {
    id: 14,
    question: "Un appel urgent avec la voix d'un proche peut-il être un fake ?",
    options: abc("Toujours réel", "Un clonage vocal IA", "Un bug"),
    answer: "B",
  },
  {
    id: 15,
    question: "Quelle donnée ne faut-il jamais donner à un chatbot public ?",
    options: abc("Recette", "Numéro de CB", "Blague"),
    answer: "B",
  },
  {
    id: 16,
    question: "Pourquoi faut-il recouper une réponse donnée par une IA ?",
    options: abc("L'IA peut inventer des sources", "Internet est lent", "Améliore le Wi-Fi"),
    answer: "A",
  },
  {
    id: 17,
    question: "Une IA comprend-elle le monde comme un humain ?",
    options: abc("Oui", "Non, calcul statistique", "Seulement le jour"),
    answer: "B",
  },
  {
    id: 18,
    question: "Quel risque crée une automatisation sans contrôle humain ?",
    options: abc("Moins d'erreurs", "Diffusion massive d'erreurs", "Internet court"),
    answer: "B",
  },
  {
    id: 19,
    question: "Quel est le bon usage de l'IA en cours ou au travail ?",
    options: abc("Copier sans relire", "Assistant + revue humaine", "Laisser l'IA décider"),
    answer: "B",
  },
  {
    id: 20,
    question: "Pour limiter la désinformation, que faut-il faire en premier ?",
    options: abc("Partager vite", "Vérifier source/date", "Tout ignorer"),
    answer: "B",
  },
  {
    id: 21,
    question: "Quel signe peut révéler un texte IA peu fiable ?",
    options: abc("Sources précises", "Phrases vagues répétitives", "Méthodologie"),
    answer: "B",
  },
  {
    id: 22,
    question: "Pourquoi la date d'une publication est-elle essentielle ?",
    options: abc("Ancienne info décontextualisée", "Format change", "Expire"),
    answer: "A",
  },
  {
    id: 23,
    question: "Qu'est-ce qu'une source primaire ?",
    options: abc("Un bruit", "Le document d'origine", "Un tweet"),
    answer: "B",
  },
  {
    id: 24,
    question: "Face à une étude virale, que faut-il vérifier d'abord ?",
    options: abc("Vérifier auteurs et revue", "Croire le graphisme", "Lire les likes"),
    answer: "A",
  },
  {
    id: 25,
    question: "Comment réagir face à un titre très sensationnaliste ?",
    options: abc("Être cru d'office", "Inciter à la prudence", "Être liké"),
    answer: "B",
  },
  {
    id: 26,
    question: "Qu'est-ce que le biais de confirmation ?",
    options: abc("Vérifier tout", "Chercher ce qui nous arrange", "Lire l'opposé"),
    answer: "B",
  },
  {
    id: 27,
    question: "Pour une question de santé, que faire après une réponse de chatbot ?",
    options: abc("Faire confiance", "Valider avec un médecin", "Interdit"),
    answer: "B",
  },
  {
    id: 28,
    question: "Comment vérifier un audio potentiellement truqué ?",
    options: abc("Recoupement d'infos", "Écouter fort", "Croire le ton"),
    answer: "A",
  },
  {
    id: 29,
    question: "Si le texte d'une image est illisible, que peut-on suspecter ?",
    options: abc("Vrai à 100%", "Possible génération IA", "Sable"),
    answer: "B",
  },
  {
    id: 30,
    question: "Quand une IA cite une source introuvable, que se passe-t-il probablement ?",
    options: abc("Bug écran", "Hallucination IA", "Source secrète"),
    answer: "B",
  },
  {
    id: 31,
    question: "Pourquoi une IA peut-elle donner une info périmée ?",
    options: abc("Pas d'accès temps réel", "L'IA est timide", "Le serveur dort"),
    answer: "A",
  },
  {
    id: 32,
    question: "Un détecteur de contenu IA est-il fiable à 100 % ?",
    options: abc("Infaillible", "Indice non absolu", "Légal"),
    answer: "B",
  },
  {
    id: 33,
    question: "En entreprise ou à l'école, quel garde-fou est indispensable avec l'IA ?",
    options: abc("Contrôle humain", "Zéro contrôle", "Mode libre"),
    answer: "A",
  },
  {
    id: 34,
    question: "Peut-on coller des clés API dans un chatbot public ?",
    options: abc("Sans danger", "Danger sécurité", "Utile"),
    answer: "B",
  },
  {
    id: 35,
    question: "Le RGPD sert principalement à quoi ?",
    options: abc("Recette web", "Protection données", "Type de processeur"),
    answer: "B",
  },
  {
    id: 36,
    question: "Pourquoi est-il utile de signaler un contenu trompeur ?",
    options: abc("Stopper la manipulation", "Gagner du temps", "Pour rire"),
    answer: "A",
  },
  {
    id: 37,
    question: "Que faire devant une image parfaite sans auteur identifiable ?",
    options: abc("Partager", "Douter et chercher", "Cadrer"),
    answer: "B",
  },
  {
    id: 38,
    question: "Qu'est-ce qu'un agent IA ?",
    options: abc("Planifie des tâches", "Ne parle pas", "Est un humain"),
    answer: "A",
  },
  {
    id: 39,
    question: "Quel est le risque d'un agent IA mal configuré ?",
    options: abc("Erreurs en série", "Plus de RAM", "Changement de couleur"),
    answer: "A",
  },
  {
    id: 40,
    question: "Que risque-t-on si une IA est surtout entraînée sur du contenu généré par IA ?",
    options: abc("Entraînement sur du contenu IA", "Modèles liés", "Vitesse"),
    answer: "A",
  },
  {
    id: 41,
    question: "Face à un chiffre choc, quel est le bon réflexe ?",
    options: abc("Chercher la méthode", "Retweeter", "Copier"),
    answer: "A",
  },
  {
    id: 42,
    question: "Une source anonyme doit-elle inspirer confiance immédiatement ?",
    options: abc("Vrai", "Prudence extrême", "Génial"),
    answer: "B",
  },
  {
    id: 43,
    question: "Quelle attitude protège le mieux contre la manipulation en ligne ?",
    options: abc("Esprit critique", "Vitesse", "Ignorance"),
    answer: "A",
  },
  {
    id: 44,
    question: "Devant une photo de guerre virale, que faut-il vérifier en priorité ?",
    options: abc("Vérifier lieu et date", "Croire le titre", "Supprimer"),
    answer: "A",
  },
  {
    id: 45,
    question: "Des milliers de commentaires identiques peuvent-ils indiquer des bots ?",
    options: abc("Succès réel", "Manipulation d'opinion", "Mise à jour"),
    answer: "B",
  },
  {
    id: 46,
    question: "L'IA doit-elle remplacer totalement la vérification humaine ?",
    options: abc("L'IA remplace l'humain", "Outil d'aide", "Inutile"),
    answer: "B",
  },
  {
    id: 47,
    question: "Comment géolocaliser une image ou une vidéo de manière simple ?",
    options: abc("Chercher des indices visuels", "Fermer les yeux", "Payer"),
    answer: "A",
  },
  {
    id: 48,
    question: "Quel est l'effet d'une vidéo coupée hors contexte ?",
    options: abc("Enlève le contexte", "Plus belle", "Rapide"),
    answer: "A",
  },
  {
    id: 49,
    question: "Quand tu doutes d'une info, quelle action est la plus responsable ?",
    options: abc("Diffuser", "Vérifier avant d'agir", "Oublier"),
    answer: "B",
  },
  {
    id: 50,
    question: "Quelle posture adopter face aux contenus créés par IA ?",
    options: abc("Croire tout", "Scepticisme sain", "Peur bleue"),
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