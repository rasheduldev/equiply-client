import type { InputHTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

const profileInputClass =
  "h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-amber focus:bg-white focus:ring-2 focus:ring-brand-amber/25 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:focus:bg-white/10"

type ProfileFieldProps = {
  id: string
  label: string
  className?: string
  children: ReactNode
}

export function ProfileField({
  id,
  label,
  className,
  children,
}: ProfileFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-bold tracking-[0.08em] text-brand-muted uppercase dark:text-white/55"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export function ProfileInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(profileInputClass, className)} />
}

type ProfileImageFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ProfileImageField({
  id,
  value,
  onChange,
  disabled,
}: ProfileImageFieldProps) {
  return (
    <ProfileField id={id} label="Profile Image URL">
      <ProfileInput
        id={id}
        name="image"
        type="url"
        autoComplete="url"
        inputMode="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="https://example.com/avatar.jpg"
      />
    </ProfileField>
  )
}
