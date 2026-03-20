"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarNavLink, icons, type IconName } from "@/components/sidebar-nav-link"
import { signOut } from "@/lib/auth.actions"
import { cn } from "@/lib/utils"
import { Menu, ShieldCheck } from "lucide-react"

type NavItem = {
  label: string
  href: string
  icon: IconName
}

type MobileNavProps = {
  navItems: NavItem[]
  user: {
    username: string
    email: string
  } | null
}

export function MobileNav({ navItems, user }: MobileNavProps) {
  const quickNavItems = navItems.slice(0, 4)

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur md:hidden">
        <div className="flex h-14 items-center px-4">
          <Link href="/modules" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
              <ShieldCheck className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">DetectIA</span>
          </Link>
        </div>
      </div>

      <Sheet>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 py-2 backdrop-blur md:hidden">
          <div className="grid grid-cols-5 gap-1">
            {quickNavItems.map(({ href, label, icon }) => {
              const Icon = icons[icon]

              return (
                <Link
                  key={href}
                  href={href}
                  className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                  <span className="truncate">{label}</span>
                </Link>
              )
            })}

            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-muted-foreground"
              >
                <Menu className="size-4" />
                Menu
              </Button>
            </SheetTrigger>
          </div>
        </div>

        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl px-0 pb-0 pt-6">
          <SheetTitle className="px-5 text-left text-lg">Navigation</SheetTitle>
          <SheetDescription className="px-5 text-left">
            Choisis une section, le menu se ferme automatiquement.
          </SheetDescription>

          <div className="mt-4 space-y-1 overflow-y-auto px-3 pb-4">
            {navItems.map(({ label, href, icon }) => (
              <SidebarNavLink key={href} href={href} icon={icon} label={label} closeOnNavigate />
            ))}
          </div>

          <div className="border-t border-border px-4 py-4">
            {user ? (
              <div className="space-y-3">
                <div className="rounded-2xl bg-muted/60 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-foreground">{user.username}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <form action={signOut}>
                  <SheetClose asChild>
                    <Button type="submit" variant="outline" className="w-full">
                      Se deconnecter
                    </Button>
                  </SheetClose>
                </form>
              </div>
            ) : (
              <SheetClose asChild>
                <Link
                  href="/login"
                  className={cn(
                    "flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  )}
                >
                  Se connecter
                </Link>
              </SheetClose>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
