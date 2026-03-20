import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { XpProvider } from "@/lib/xp-context"
import { getSession } from "@/lib/session"
import { isTeacher } from "@/lib/roles"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
	const user = await getSession()
	const navItems = isTeacher(user)
		? [
				{ label: "Tableau de bord", href: "/dashboard", icon: "dashboard" as const },
				{ label: "Modules", href: "/modules", icon: "book" as const },
				{ label: "Chat IA", href: "/chat", icon: "chat" as const },
				{ label: "Quiz", href: "/quiz", icon: "quiz" as const },
				{ label: "Mini-jeux", href: "/games", icon: "game" as const },
				{ label: "Badges", href: "/badges", icon: "trophy" as const },
			]
		: [
				{ label: "Modules", href: "/modules", icon: "book" as const },
				{ label: "Chat IA", href: "/chat", icon: "chat" as const },
				{ label: "Quiz", href: "/quiz", icon: "quiz" as const },
				{ label: "Mini-jeux", href: "/games", icon: "game" as const },
				{ label: "Badges", href: "/badges", icon: "trophy" as const },
			]
	return (
		<XpProvider
			initialXp={user?.xp ?? 0}
			initialLevel={user?.level ?? 1}
			isLoggedIn={!!user}
		>
			<div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
				<AppSidebar />
				<MobileNav
					navItems={navItems}
					user={user ? { username: user.username, email: user.email } : null}
				/>
				<main className="min-h-screen pb-24 md:ml-64 md:pb-0">{children}</main>
			</div>
		</XpProvider>
	)
}
