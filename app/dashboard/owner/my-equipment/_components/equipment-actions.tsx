"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EquipmentActionsProps = {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  className?: string
}

export function EquipmentActions({
  onView,
  onEdit,
  onDelete,
  className,
}: EquipmentActionsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={onView}
        className="h-9 rounded-md bg-slate-100 px-3.5 text-sm font-semibold text-brand-navy hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
      >
        Details
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onEdit}
        className="h-9 rounded-md bg-amber-100 px-3.5 text-sm font-semibold text-amber-700 hover:bg-amber-200 dark:bg-brand-amber/10 dark:text-brand-amber dark:hover:bg-brand-amber/20"
      >
        Update
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onDelete}
        className="h-9 rounded-md bg-red-100 px-3.5 text-sm font-semibold text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
      >
        Delete
      </Button>
    </div>
  )
}
