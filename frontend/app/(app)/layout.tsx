import { AppSidebar } from "@/components/app-sidebar"
import { XpProvider } from "@/lib/xp-context"
import { getSession } from "@/lib/session"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
	const user = await getSession()
	return (
		<XpProvider
			initialXp={user?.xp ?? 0}
			initialLevel={user?.level ?? 1}
			isLoggedIn={!!user}
		>
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
				<AppSidebar />
				<main className="ml-64 min-h-screen">{children}</main>
			</div>
		</XpProvider>
	)
}
