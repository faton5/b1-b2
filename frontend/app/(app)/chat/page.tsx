import { ChatPage } from "@/components/chat-page"
import { getSession } from "@/lib/session"

export default async function ChatRoutePage() {
  const user = await getSession()

  return <ChatPage username={user?.username ?? null} />
}
