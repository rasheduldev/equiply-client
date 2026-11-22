import type { ReactNode } from "react"
import { CircleCheck, CircleX } from "lucide-react"

import { cn } from "@/lib/utils"

type ProfileAlertProps = {
  variant: "error" | "success"
  children: ReactNode
}

const alertStyles = {
  error:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
}

export function ProfileAlert({ variant, children }: ProfileAlertProps) {
  const Icon = variant === "error" ? CircleX : CircleCheck

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3.5 py-2.5 text-sm",
        alertStyles[variant]
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  )
}
