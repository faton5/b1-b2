"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SheetClose } from "@/components/ui/sheet"
import { BookOpen, Bot, Gamepad2, HelpCircle, ImageIcon, LayoutDashboard, Trophy } from "lucide-react"

export const icons = {
  dashboard: LayoutDashboard,
  book: BookOpen,
  chat: Bot,
  gallery: ImageIcon,
  quiz: HelpCircle,
  game: Gamepad2,
  trophy: Trophy,
}

type IconName = keyof typeof icons

type Props = {
  href: string
  label: string
  icon: IconName
  closeOnNavigate?: boolean
}

export function SidebarNavLink({ href, label, icon, closeOnNavigate = false }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + "/")
  const Icon = icons[icon]

  const link = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4 flex-shrink-0" />
      {label}
    </Link>
  )

  if (closeOnNavigate) {
    return <SheetClose asChild>{link}</SheetClose>
  }

  return link
}

export type { IconName }
