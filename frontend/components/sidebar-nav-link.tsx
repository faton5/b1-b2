"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Gamepad2, HelpCircle, LayoutDashboard, Trophy } from "lucide-react"

const icons = {
  dashboard: LayoutDashboard,
  book: BookOpen,
  quiz: HelpCircle,
  game: Gamepad2,
  trophy: Trophy,
}

type IconName = keyof typeof icons

type Props = {
  href: string
  label: string
  icon: IconName
}

export function SidebarNavLink({ href, label, icon }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + "/")
  const Icon = icons[icon]

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4 flex-shrink-0" />
      {label}
    </Link>
  )
}
