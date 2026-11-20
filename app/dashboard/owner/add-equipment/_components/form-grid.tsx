import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type FormGridProps = {
  columns?: 2 | 3
  className?: string
  children: ReactNode
}

const columnsClass = {
  2: "md:grid-cols-2",
  3: "sm:grid-cols-3",
} as const

export function FormGrid({ columns = 2, className, children }: FormGridProps) {
  return (
    <div
      className={cn("grid gap-x-5 gap-y-5", columnsClass[columns], className)}
    >
      {children}
    </div>
  )
}
