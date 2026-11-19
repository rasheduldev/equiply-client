"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const subscribe = () => () => {}

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-white/15 bg-white/5 text-white transition-colors hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy focus-visible:outline-none",
        className
      )}
    >
      {isDark ? (
        <Sun className="size-5" strokeWidth={1.8} />
      ) : (
        <Moon className="size-5" strokeWidth={1.8} />
      )}
    </button>
  )
}
