
"use client"

import { Eye, Pencil, Trash2 } from "lucide-react"

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
    <div className={cn("flex flex-nowrap items-center gap-2", className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={onView}
        className="h-9 gap-1.5 rounded-md bg-slate-100 px-3 text-sm font-semibold text-brand-navy hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
      >
        <Eye className="size-4" />
        Details
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onEdit}
        aria-label="Update equipment"
        title="Update equipment"
        className="size-9 shrink-0 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-brand-amber/10 dark:text-brand-amber dark:hover:bg-brand-amber/20"
      >
        <Pencil className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDelete}
        aria-label="Delete equipment"
        title="Delete equipment"
        className="size-9 shrink-0 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
