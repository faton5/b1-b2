"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  ACCEPTED_CHAT_FILE_INPUT,
  CHAT_MODEL_LABEL,
  MAX_CHAT_ATTACHMENTS,
  MAX_CHAT_ATTACHMENT_BYTES,
  type ChatAttachment,
  type ChatMessage,
} from "@/lib/chat-config"
import { cn } from "@/lib/utils"
import { Bot, Paperclip, RefreshCcw, SendHorizontal, ShieldAlert, Sparkles, X } from "lucide-react"

type ChatPageProps = {
  username?: string | null
}

type UiMessage = ChatMessage & {
  id: string
  attachments?: ChatAttachment[]
  transportContent?: string
}

function buildWelcomeMessage(username?: string | null): UiMessage {
  const prefix = username ? `${username}, ` : ""

  return {
    id: "welcome",
    role: "assistant",
    content:
      `${prefix}je suis Aether. Je peux t'aider a comprendre l'IA, verifier un prompt, expliquer un deepfake, ou montrer les bons reflexes pour utiliser une IA sans te faire pieger.`,
  }
}

export function ChatPage({ username }: ChatPageProps) {
  const [messages, setMessages] = useState<UiMessage[]>(() => [buildWelcomeMessage(username)])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeModel, setActiveModel] = useState(CHAT_MODEL_LABEL)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages, isLoading])

  async function handleSubmit() {
    const textValue = input.trim()
    const content =
      textValue || (pendingFiles.length > 1 ? "Analyse les fichiers joints et resume l'essentiel." : "Analyse le fichier joint et resume l'essentiel.")

    if ((!textValue && pendingFiles.length === 0) || isLoading) {
      return
    }

    const userMessage: UiMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      transportContent: content,
      attachments: pendingFiles.map((file) => ({
        name: file.name,
        size: file.size,
      })),
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput("")
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.set(
        "messages",
        JSON.stringify(
          nextMessages.map(({ role, transportContent, content: messageContent }) => ({
            role,
            content: transportContent || messageContent,
          })),
        ),
      )
      pendingFiles.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      })

      const data = (await response.json()) as {
        reply?: string
        model?: string
        error?: string
        userMessageContent?: string
        requestId?: string
      }

      if (!response.ok || !data.reply) {
        const suffix = data.requestId ? ` (ref: ${data.requestId})` : ""
        throw new Error((data.error || "Le service IA a renvoye une erreur.") + suffix)
      }

      setActiveModel(data.model || CHAT_MODEL_LABEL)
      setMessages((current) => [
        ...current.map((message) =>
          message.id === userMessage.id
            ? {
                ...message,
                transportContent: data.userMessageContent || message.transportContent || message.content,
              }
            : message,
        ),
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply!,
        },
      ])
      setPendingFiles([])
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : "Impossible de contacter le chat."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setMessages([buildWelcomeMessage(username)])
    setInput("")
    setError(null)
    setIsLoading(false)
    setPendingFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const incomingFiles = Array.from(event.target.files || [])
    event.target.value = ""

    if (incomingFiles.length === 0) {
      return
    }

    const nextFiles = [...pendingFiles]
    for (const file of incomingFiles) {
      const duplicate = nextFiles.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified,
      )

      if (!duplicate) {
        nextFiles.push(file)
      }
    }

    if (nextFiles.length > MAX_CHAT_ATTACHMENTS) {
      setError(`Tu peux envoyer jusqu'a ${MAX_CHAT_ATTACHMENTS} fichiers par message.`)
      setPendingFiles(nextFiles.slice(0, MAX_CHAT_ATTACHMENTS))
      return
    }

    const oversizedFile = nextFiles.find((file) => file.size > MAX_CHAT_ATTACHMENT_BYTES)
    if (oversizedFile) {
      setError(`${oversizedFile.name} depasse la limite de ${Math.floor(MAX_CHAT_ATTACHMENT_BYTES / 1024 / 1024)} Mo.`)
      return
    }

    setError(null)
    setPendingFiles(nextFiles)
  }

  function handleRemoveFile(fileToRemove: File) {
    setPendingFiles((current) =>
      current.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          ),
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-sky-100 bg-white/90 shadow-sm backdrop-blur">
            <CardHeader className="flex flex-col gap-4 border-b border-sky-100 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-sm">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-950">Chat IA DetectIA</CardTitle>
                    <CardDescription>
                      Pose une question sur l'IA, les deepfakes, les biais, les prompts ou les bons usages.
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50">
                    via OpenRouter
                  </Badge>
                  <Badge variant="outline">{activeModel}</Badge>
                </div>
              </div>
              <Button variant="outline" className="gap-2" onClick={handleReset} disabled={isLoading}>
                <RefreshCcw className="size-4" />
                Reinitialiser
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 p-0">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4 p-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex w-full",
                        message.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm",
                          message.role === "user"
                            ? "bg-slate-950 text-white"
                            : "border border-sky-100 bg-sky-50 text-slate-800",
                        )}
                      >
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                          {message.role === "user" ? "Vous" : "Aether"}
                        </p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {message.attachments.map((attachment) => (
                              <span
                                key={`${message.id}-${attachment.name}-${attachment.size}`}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]",
                                  message.role === "user"
                                    ? "border-white/20 bg-white/10 text-white/90"
                                    : "border-sky-200 bg-white text-sky-700",
                                )}
                              >
                                <Paperclip className="size-3" />
                                {attachment.name}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-3xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
                        Aether reflechit...
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              <div className="border-t border-sky-100 p-6 pt-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ACCEPTED_CHAT_FILE_INPUT}
                      className="hidden"
                      onChange={handleFilesSelected}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Paperclip className="size-4" />
                      Ajouter un fichier
                    </Button>
                    <p className="text-xs text-slate-500">
                      Fichiers texte seulement, {MAX_CHAT_ATTACHMENTS} max, 1 Mo chacun.
                    </p>
                  </div>
                  {pendingFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {pendingFiles.map((file) => (
                        <span
                          key={`${file.name}-${file.size}-${file.lastModified}`}
                          className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-800"
                        >
                          <Paperclip className="size-3.5" />
                          {file.name}
                          <button
                            type="button"
                            className="rounded-full p-0.5 hover:bg-sky-100"
                            onClick={() => handleRemoveFile(file)}
                            aria-label={`Retirer ${file.name}`}
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <Textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        void handleSubmit()
                      }
                    }}
                    placeholder="Exemple: comment reconnaitre un deepfake convaincant ?"
                    className="min-h-28 resize-none border-sky-100 bg-white"
                    disabled={isLoading}
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                      Entree pour envoyer, Maj + Entree pour une nouvelle ligne.
                    </p>
                    <Button
                      className="gap-2 sm:min-w-40"
                      onClick={() => void handleSubmit()}
                      disabled={isLoading || (!input.trim() && pendingFiles.length === 0)}
                    >
                      <SendHorizontal className="size-4" />
                      Envoyer
                    </Button>
                  </div>
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-sky-100 bg-white/80 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-sky-600" />
                  Ce que le chat sait faire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>Expliquer simplement un concept IA.</p>
                <p>Aider a analyser un prompt ou une reponse douteuse.</p>
                <p>Donner des reflexes concrets pour verifier une info.</p>
                <p>Montrer les limites d'un modele generatif sans survendre ses reponses.</p>
              </CardContent>
            </Card>

            <Card className="border-amber-100 bg-amber-50/80 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-amber-950">
                  <ShieldAlert className="size-4 text-amber-600" />
                  Rappel utile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-amber-900/80">
                <p>Ne colle pas de donnees sensibles, mots de passe ou infos personnelles.</p>
                <p>Le chat peut se tromper: verifie les faits importants avec des sources fiables.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
