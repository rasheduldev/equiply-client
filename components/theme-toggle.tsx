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
        "flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-slate-200 bg-[#fbfbfc] text-brand-navy transition-colors hover:border-slate-300 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2 focus-visible:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/25 dark:hover:bg-white/10",
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
