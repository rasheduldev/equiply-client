import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

import { controlClass } from "./form-field"

type SelectFieldProps<T extends string> = {
  id: string
  name: string
  value: T
  onChange: (value: T) => void
  options: readonly T[]
  placeholder?: string
  required?: boolean
  className?: string
}

export function SelectField<T extends string>({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  className,
}: SelectFieldProps<T>) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(
          controlClass,
          "appearance-none pr-10",
          placeholder && !value && "text-slate-400 dark:text-white/35",
          className
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-brand-muted dark:text-white/50"
      />
    </div>
  )
}
