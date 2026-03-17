"use client"

import { createContext, useContext, useRef, useState } from "react"

type XpState = {
  xp: number
  level: number
  xpToNextLevel: number
}

type XpContextValue = {
  xpState: XpState
  lastGain: number
  addXp: (amount: number) => void
  isLoggedIn: boolean
}

function computeLevel(xp: number): number {
  if (xp <= 0) return 1
  return Math.floor(xp / 200) + 1
}

const XpContext = createContext<XpContextValue | null>(null)

export function XpProvider({
  children,
  initialXp,
  initialLevel,
  isLoggedIn,
}: {
  children: React.ReactNode
  initialXp: number
  initialLevel: number
  isLoggedIn: boolean
}) {
  const [xpState, setXpState] = useState<XpState>({
    xp: initialXp,
    level: initialLevel,
    xpToNextLevel: initialLevel * 200,
  })
  const [lastGain, setLastGain] = useState(0)
  const gainTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function addXp(amount: number) {
    if (amount <= 0 || !isLoggedIn) return
    setXpState((prev) => {
      const newXp = prev.xp + amount
      const newLevel = computeLevel(newXp)
      return { xp: newXp, level: newLevel, xpToNextLevel: newLevel * 200 }
    })
    setLastGain(amount)
    if (gainTimerRef.current) clearTimeout(gainTimerRef.current)
    gainTimerRef.current = setTimeout(() => setLastGain(0), 2500)
  }

  return (
    <XpContext.Provider value={{ xpState, lastGain, addXp, isLoggedIn }}>
      {children}
    </XpContext.Provider>
  )
}

export function useXp(): XpContextValue {
  const ctx = useContext(XpContext)
  if (!ctx) throw new Error("useXp must be used inside XpProvider")
  return ctx
}
