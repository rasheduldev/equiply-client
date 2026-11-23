"use client"

import type { ReactNode } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AdminDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

export function AdminDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: AdminDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-brand-navy/45 backdrop-blur-sm transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />

        <DialogPrimitive.Popup
          className={cn(
            "fixed top-1/2 left-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl transition duration-150 outline-none sm:p-6 dark:border-white/10 dark:bg-brand-navy-soft",
            "data-ending-style:opacity-0 data-starting-style:opacity-0",
            className
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-lg font-bold tracking-tight text-brand-navy dark:text-white">
                {title}
              </DialogPrimitive.Title>

              {description && (
                <DialogPrimitive.Description className="mt-1.5 text-sm leading-relaxed text-brand-muted dark:text-white/55">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>

            <DialogPrimitive.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close dialog"
                  className="-mt-1 shrink-0 text-brand-muted hover:bg-slate-100 dark:text-white/50 dark:hover:bg-white/10"
                />
              }
            >
              <X aria-hidden className="size-4" />
            </DialogPrimitive.Close>
          </div>

          {children && <div className="mt-5">{children}</div>}

          {footer && (
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
