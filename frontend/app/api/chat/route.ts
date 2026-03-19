import { NextResponse } from "next/server"
import {
  ACCEPTED_CHAT_FILE_EXTENSIONS,
  CHAT_SYSTEM_PROMPT,
  DEFAULT_OPENROUTER_MODEL,
  OPENROUTER_FALLBACK_MODELS,
  MAX_CHAT_ATTACHMENTS,
  MAX_CHAT_ATTACHMENT_BYTES,
  MAX_CHAT_ATTACHMENT_CHARS,
  MAX_CHAT_HISTORY,
  OPENROUTER_API_URL,
  type ChatAttachment,
  type ChatMessage,
} from "@/lib/chat-config"
import sql from "@/lib/db"
import { getSession } from "@/lib/session"

export const runtime = "nodejs"

type OpenRouterResponse = {
  model?: string
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>
    }
  }>
  error?: {
    message?: string
  }
}

type OpenRouterMessageContent = string | Array<{ type?: string; text?: string }> | undefined
const ACCEPTED_CHAT_FILE_EXTENSION_SET = new Set(ACCEPTED_CHAT_FILE_EXTENSIONS)
const RETRYABLE_PROVIDER_ERROR_PATTERN =
  /provider returned error|no provider|temporarily unavailable|insufficient credits|quota/i

function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".")
  if (lastDotIndex === -1) {
    return ""
  }

  return filename.slice(lastDotIndex).toLowerCase()
}

function normalizeContent(content: OpenRouterMessageContent): string {
  if (typeof content === "string") {
    return content.trim()
  }

  if (Array.isArray(content)) {
    return content
      .flatMap((item) => (item?.type === "text" && typeof item.text === "string" ? [item.text.trim()] : []))
      .filter(Boolean)
      .join("\n")
  }

  return ""
}

function sanitizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter(
      (item): item is ChatMessage =>
        !!item &&
        typeof item === "object" &&
        (item as ChatMessage).role !== undefined &&
        ((item as ChatMessage).role === "user" || (item as ChatMessage).role === "assistant") &&
        typeof (item as ChatMessage).content === "string",
    )
    .map((item) => ({
      role: item.role,
      content: item.content.trim(),
    }))
    .filter((item) => item.content.length > 0)
    .slice(-MAX_CHAT_HISTORY)
}

async function extractAttachmentContext(files: File[]): Promise<{
  attachmentContext: string
  attachments: ChatAttachment[]
}> {
  if (files.length > MAX_CHAT_ATTACHMENTS) {
    throw new Error(`Maximum ${MAX_CHAT_ATTACHMENTS} files per message.`)
  }

  const sections: string[] = []
  const attachments: ChatAttachment[] = []

  for (const file of files) {
    const extension = getFileExtension(file.name)
    if (!ACCEPTED_CHAT_FILE_EXTENSION_SET.has(extension as (typeof ACCEPTED_CHAT_FILE_EXTENSIONS)[number])) {
      throw new Error(`Unsupported file type for ${file.name}.`)
    }

    if (file.size > MAX_CHAT_ATTACHMENT_BYTES) {
      throw new Error(`${file.name} exceeds the ${Math.floor(MAX_CHAT_ATTACHMENT_BYTES / 1024 / 1024)} MB limit.`)
    }

    const rawContent = await file.text()
    const trimmedContent = rawContent.trim()
    if (!trimmedContent) {
      throw new Error(`${file.name} is empty.`)
    }

    const excerpt =
      trimmedContent.length > MAX_CHAT_ATTACHMENT_CHARS
        ? `${trimmedContent.slice(0, MAX_CHAT_ATTACHMENT_CHARS)}\n[Truncated to fit the context window.]`
        : trimmedContent

    attachments.push({
      name: file.name,
      size: file.size,
    })

    sections.push(`File: ${file.name}\n${excerpt}`)
  }

  return {
    attachmentContext: sections.join("\n\n"),
    attachments,
  }
}

function applyAttachmentContext(messages: ChatMessage[], attachmentContext: string) {
  if (!attachmentContext) {
    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")

    return {
      messages,
      userMessageContent: latestUserMessage?.content || "",
    }
  }

  const nextMessages = [...messages]
  for (let index = nextMessages.length - 1; index >= 0; index -= 1) {
    if (nextMessages[index]?.role !== "user") {
      continue
    }

    const enhancedContent = `${nextMessages[index].content}\n\nAttached files:\n${attachmentContext}`
    nextMessages[index] = {
      ...nextMessages[index],
      content: enhancedContent,
    }

    return {
      messages: nextMessages,
      userMessageContent: enhancedContent,
    }
  }

  return {
    messages,
    userMessageContent: "",
  }
}

function getCandidateModels() {
  const configuredModel = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL

  return [configuredModel, ...OPENROUTER_FALLBACK_MODELS].filter(
    (model, index, allModels) => model && allModels.indexOf(model) === index,
  )
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured on the frontend server." },
      { status: 500 },
    )
  }

  const contentType = request.headers.get("content-type") || ""
  let rawMessages: unknown
  let files: File[] = []

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ error: "Invalid form payload." }, { status: 400 })
    }

    try {
      rawMessages = JSON.parse(String(formData.get("messages") || "[]"))
    } catch {
      return NextResponse.json({ error: "Invalid messages payload." }, { status: 400 })
    }

    files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File && value.size > 0)
  } else {
    let body: { messages?: unknown }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
    }

    rawMessages = body.messages
  }

  const messages = sanitizeMessages(rawMessages)
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")

  if (!latestUserMessage) {
    return NextResponse.json({ error: "A user message is required." }, { status: 400 })
  }

  if (latestUserMessage.content.length > 4000) {
    return NextResponse.json({ error: "Message too long." }, { status: 400 })
  }

  let attachmentContext = ""
  try {
    attachmentContext = (await extractAttachmentContext(files)).attachmentContext
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid attachment."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const preparedMessages = applyAttachmentContext(messages, attachmentContext)
  const temperature = Number(process.env.OPENROUTER_TEMPERATURE || "0.7")
  const maxTokens = Number(process.env.OPENROUTER_MAX_TOKENS || "700")

  const basePayload = {
    messages: [{ role: "system", content: CHAT_SYSTEM_PROMPT }, ...preparedMessages.messages],
    temperature: Number.isFinite(temperature) ? temperature : 0.7,
    max_tokens: Number.isFinite(maxTokens) ? maxTokens : 700,
  }

  const candidateModels = getCandidateModels()
  const sessionUser = await getSession()
  const userMessageContent = preparedMessages.userMessageContent || latestUserMessage.content
  let lastProviderError = "OpenRouter is unreachable right now."

  for (const [index, model] of candidateModels.entries()) {
    let response: Response
    try {
      response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.OPENROUTER_APP_NAME || "DetectIA",
        },
        body: JSON.stringify({
          ...basePayload,
          model,
        }),
        cache: "no-store",
      })
    } catch {
      if (index < candidateModels.length - 1) {
        continue
      }

      return NextResponse.json({ error: lastProviderError }, { status: 502 })
    }

    let data: OpenRouterResponse | null = null
    try {
      data = (await response.json()) as OpenRouterResponse
    } catch {
      data = null
    }

    const providerMessage = data?.error?.message?.trim()
    if (!response.ok) {
      lastProviderError = providerMessage || `OpenRouter request failed with status ${response.status}.`

      const shouldRetry =
        index < candidateModels.length - 1 &&
        (response.status >= 500 || RETRYABLE_PROVIDER_ERROR_PATTERN.test(lastProviderError))

      if (shouldRetry) {
        continue
      }

      return NextResponse.json({ error: lastProviderError }, { status: 502 })
    }

    const reply = normalizeContent(data?.choices?.[0]?.message?.content)
    if (!reply) {
      lastProviderError = "OpenRouter returned an empty reply."

      if (index < candidateModels.length - 1) {
        continue
      }

      return NextResponse.json({ error: lastProviderError }, { status: 502 })
    }

    try {
      await sql`
        INSERT INTO chat_transcripts (user_id, user_message, assistant_message, model)
        VALUES (${sessionUser?.id ?? null}, ${userMessageContent}, ${reply}, ${data?.model || model})
      `
    } catch {
      // Ignore persistence failures so chat still returns the reply.
    }

    return NextResponse.json({
      reply,
      model: data?.model || model,
      userMessageContent: preparedMessages.userMessageContent,
    })
  }

  return NextResponse.json({ error: lastProviderError }, { status: 502 })
}
