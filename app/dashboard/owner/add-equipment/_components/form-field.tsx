import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react"

import { cn } from "@/lib/utils"

const fieldBaseClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-amber focus:bg-white focus:ring-2 focus:ring-brand-amber/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:focus:bg-white/10"

export const controlClass = cn(fieldBaseClass, "h-11")

type FormFieldProps = {
  id: string
  label: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function FormField({
  id,
  label,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-[10px] font-bold tracking-[0.12em] text-brand-muted uppercase dark:text-white/55"
      >
        {label}
        {required && (
          <span
            aria-hidden
            className="ml-1 text-brand-amber-deep dark:text-brand-amber"
          >
            *
          </span>
        )}
      </label>

      {children}

      {hint && (
        <p className="text-xs text-brand-muted dark:text-white/40">{hint}</p>
      )}
    </div>
  )
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  leading?: ReactNode
}

export function TextField({ leading, className, ...props }: TextFieldProps) {
  if (!leading) {
    return <input {...props} className={cn(controlClass, className)} />
  }

  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-brand-muted dark:text-white/40"
      >
        {leading}
      </span>
      <input {...props} className={cn(controlClass, "pl-9", className)} />
    </div>
  )
}

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: "default" | "compact"
}

export function TextareaField({
  size = "default",
  className,
  ...props
}: TextareaFieldProps) {
  return (
    <textarea
      {...props}
      className={cn(
        fieldBaseClass,
        "resize-y py-3",
        size === "compact" ? "min-h-24" : "min-h-32",
        className
      )}
    />
  )
}
