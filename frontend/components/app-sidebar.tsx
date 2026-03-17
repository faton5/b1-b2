import Link from "next/link"
import { getSession } from "@/lib/session"
import { signOut } from "@/lib/auth.actions"
import { isTeacherEmail } from "@/lib/roles"
import { SidebarNavLink } from "@/components/sidebar-nav-link"
import { SidebarXp } from "@/components/sidebar-xp"
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Gamepad2,
  Trophy,
  LogOut,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const publicNavItems = [
  { label: "Modules", href: "/modules", icon: "book" },
  { label: "Quiz", href: "/quiz", icon: "quiz" },
  { label: "Mini-jeux", href: "/games", icon: "game" },
  { label: "Badges", href: "/badges", icon: "trophy" },
]

export async function AppSidebar() {
  const user = await getSession()
  const isTeacher = isTeacherEmail(user?.email)
  const navItems = isTeacher
    ? [{ label: "Tableau de bord", href: "/dashboard", icon: "dashboard" }, ...publicNavItems]
    : publicNavItems

  return (
    <aside className="fixed inset-y-0 left-0 w-64 flex flex-col bg-card border-r border-border z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border flex-shrink-0">
        <div className="size-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="size-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">DetectIA</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        {navItems.map(({ label, href, icon }) => (
          <SidebarNavLink key={href} href={href} icon={icon} label={label} />
        ))}
      </nav>

      {/* User section */}
      {user ? (
        <div className="px-3 py-4 border-t border-border space-y-3">
          {/* XP bar */}
          <SidebarXp />

          {/* Avatar + name + logout */}
          <div className="flex items-center gap-3 px-2">
            <div className="size-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-accent-foreground text-sm font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground flex-shrink-0"
                title="Se déconnecter"
              >
                <LogOut className="size-3.5" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="px-3 py-4 border-t border-border">
          <Link
            href="/login"
            className="flex items-center justify-center w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      )}
    </aside>
  )
}
