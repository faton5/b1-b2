"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Zap } from "lucide-react"
import { useXp } from "@/lib/xp-context"

export function SidebarXp() {
  const { xpState, lastGain, isLoggedIn } = useXp()
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [popupKey, setPopupKey] = useState(0)
  const prevLevelRef = useRef(xpState.level)

  useEffect(() => {
    if (xpState.level > prevLevelRef.current) {
      setShowLevelUp(true)
      const t = setTimeout(() => setShowLevelUp(false), 3200)
      prevLevelRef.current = xpState.level
      return () => clearTimeout(t)
    }
    prevLevelRef.current = xpState.level
  }, [xpState.level])

  useEffect(() => {
    if (lastGain > 0) setPopupKey((k) => k + 1)
  }, [lastGain])

  if (!isLoggedIn) return null

  const xpInLevel = xpState.xp % 200
  const percent = Math.min(100, Math.round((xpInLevel / 200) * 100))

  return (
    <div className="px-2 space-y-1.5 relative">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 font-medium text-foreground">
          <Star className="size-3 text-yellow-500 fill-yellow-500" />
          Niveau {xpState.level}
        </span>
        <span className="text-muted-foreground tabular-nums">
          {xpInLevel} / 200 XP
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* +X XP popup */}
      {lastGain > 0 && (
        <span
          key={popupKey}
          className="animate-xp-popup pointer-events-none absolute -top-5 right-0 flex items-center gap-1 text-xs font-bold text-primary"
        >
          <Zap className="size-3" />
          +{lastGain} XP
        </span>
      )}

      {/* Level up banner */}
      {showLevelUp && (
        <div className="animate-level-up pointer-events-none absolute left-1/2 -top-10 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
          <Star className="size-3 fill-primary-foreground" />
          LEVEL UP ! Niv. {xpState.level}
          <Star className="size-3 fill-primary-foreground" />
        </div>
      )}
    </div>
  )
}
