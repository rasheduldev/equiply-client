"use client"

import { useEffect } from "react"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { Equipment } from "../_lib/types"

type DeleteEquipmentDialogProps = {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (equipment: Equipment) => void
}

export function DeleteEquipmentDialog({
  equipment,
  open,
  onOpenChange,
  onConfirm,
}: DeleteEquipmentDialogProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  if (!open || !equipment) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close delete confirmation"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-brand-navy/45 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-equipment-title"
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-brand-navy-soft"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <Trash aria-hidden className="size-5" />
        </span>

        <h2
          id="delete-equipment-title"
          className="mt-4 text-lg font-bold text-brand-navy dark:text-white"
        >
          Delete equipment?
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-brand-muted dark:text-white/55">
          <span className="font-semibold text-brand-navy dark:text-white">
            {equipment.name}
          </span>{" "}
          will be removed from your listed fleet. This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={() => onConfirm(equipment)}
            className="h-10 w-full bg-red-600 font-bold text-white hover:bg-red-700 sm:w-auto dark:bg-red-500 dark:hover:bg-red-600"
          >
            <Trash aria-hidden className="size-4" />
            Delete Equipment
          </Button>
        </div>
      </div>
    </div>
  )
}
