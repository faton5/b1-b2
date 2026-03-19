export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
export const DEFAULT_OPENROUTER_MODEL = "mistralai/mistral-small-3.1-24b-instruct:free"
export const OPENROUTER_FALLBACK_MODELS = [
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "mistralai/mistral-small-3.2-24b-instruct",
] as const
export const CHAT_MODEL_LABEL = "Mistral Small 3.1 (free)"
export const MAX_CHAT_HISTORY = 12
export const MAX_CHAT_ATTACHMENTS = 3
export const MAX_CHAT_ATTACHMENT_BYTES = 1024 * 1024
export const MAX_CHAT_ATTACHMENT_CHARS = 12000

export const ACCEPTED_CHAT_FILE_EXTENSIONS = [
  ".txt",
  ".md",
  ".csv",
  ".json",
  ".xml",
  ".html",
  ".css",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".c",
  ".cpp",
  ".cs",
  ".php",
  ".sql",
  ".yml",
  ".yaml",
] as const

export const ACCEPTED_CHAT_FILE_INPUT = ACCEPTED_CHAT_FILE_EXTENSIONS.join(",")

export const CHAT_SYSTEM_PROMPT = `
Tu es Aether, l'assistant IA de DetectIA.
Ta mission est d'aider les utilisateurs a comprendre l'IA, ses limites, ses usages utiles et ses risques.

Regles:
- reponds de facon claire, concrete et pedagogique
- reste accessible a un public scolaire et enseignant sans etre infantilisant
- aide a developper l'esprit critique plutot que donner une confiance aveugle
- souligne les risques de hallucinations, biais, deepfakes, manipulation, vie privee et abus quand c'est pertinent
- si une affirmation semble incertaine, dis-le franchement
- donne des conseils pratiques applicables dans la vraie vie
- reponds dans la langue de l'utilisateur
- recentre poliment la discussion si elle s'eloigne trop de l'objectif educatif de DetectIA
`.trim()

export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  role: ChatRole
  content: string
}

export type ChatAttachment = {
  name: string
  size: number
}
