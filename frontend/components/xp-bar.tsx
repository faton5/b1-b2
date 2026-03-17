"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Zap } from "lucide-react"
import { useXp } from "@/lib/xp-context"

export function XpBar() {
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
    <div className="fixed bottom-0 left-64 right-0 z-50 h-12 bg-card border-t border-border flex items-center px-5 gap-4">
      {/* Level badge */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-bold text-foreground">Niv. {xpState.level}</span>
      </div>

      {/* Progress bar */}
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* XP counter */}
      <span className="text-xs text-muted-foreground flex-shrink-0 font-medium tabular-nums">
        {xpInLevel} / 200 XP
      </span>

      {/* +X XP popup */}
      {lastGain > 0 && (
        <span
          key={popupKey}
          className="animate-xp-popup pointer-events-none absolute right-36 bottom-10 flex items-center gap-1 text-sm font-bold text-primary"
        >
          <Zap className="size-3.5" />
          +{lastGain} XP
        </span>
      )}

      {/* Level up banner */}
      {showLevelUp && (
        <div className="animate-level-up pointer-events-none absolute left-1/2 bottom-14 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
          <Star className="size-4 fill-primary-foreground" />
          LEVEL UP ! Niveau {xpState.level}
          <Star className="size-4 fill-primary-foreground" />
        </div>
      )}
    </div>
  )
}
