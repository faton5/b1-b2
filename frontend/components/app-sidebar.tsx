import Link from "next/link"
import { getSession } from "@/lib/session"
import { signOut } from "@/lib/auth.actions"
import { isTeacher } from "@/lib/roles"
import { SidebarNavLink, type IconName } from "@/components/sidebar-nav-link"
import { SidebarXp } from "@/components/sidebar-xp"
import { LogOut, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const publicNavItems: Array<{ label: string; href: string; icon: IconName }> = [
  { label: "Modules", href: "/modules", icon: "book" },
  { label: "Chat IA", href: "/chat", icon: "chat" },
  { label: "Quiz", href: "/quiz", icon: "quiz" },
  { label: "Mini-jeux", href: "/games", icon: "game" },
  { label: "Badges", href: "/badges", icon: "trophy" },
]

type AppSidebarProps = {
  mobile?: boolean
}

export async function AppSidebar({ mobile = false }: AppSidebarProps) {
  const user = await getSession()
  const showTeacherPanel = isTeacher(user)
  const navItems: Array<{ label: string; href: string; icon: IconName }> = showTeacherPanel
    ? [{ label: "Tableau de bord", href: "/dashboard", icon: "dashboard" }, ...publicNavItems]
    : publicNavItems

  const containerClassName = mobile
    ? "flex h-full min-h-full flex-col bg-card"
    : "fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card md:flex"

  return (
    <aside className={containerClassName}>
      <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-border px-5">
        <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary">
          <ShieldCheck className="size-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">DetectIA</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        {navItems.map(({ label, href, icon }) => (
          <SidebarNavLink key={href} href={href} icon={icon} label={label} />
        ))}
      </nav>

      {user ? (
        <div className="space-y-3 border-t border-border px-3 py-4">
          <SidebarXp />

          <div className="flex items-center gap-3 px-2">
            <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
              {user.username[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="size-7 flex-shrink-0 text-muted-foreground hover:text-foreground"
                title="Se deconnecter"
              >
                <LogOut className="size-3.5" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="border-t border-border px-3 py-4">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Se connecter
          </Link>
        </div>
      )}
    </aside>
  )
}
