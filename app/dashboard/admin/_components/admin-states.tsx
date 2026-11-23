import type { ReactNode } from "react"

type AdminEmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function AdminEmptyState({
  icon,
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-amber-soft text-brand-amber-deep dark:bg-brand-amber/10 dark:text-brand-amber">
        {icon}
      </span>

      <h2 className="mt-4 text-lg font-bold text-brand-navy dark:text-white">
        {title}
      </h2>

      <p className="mt-1 max-w-sm text-sm leading-relaxed text-brand-muted dark:text-white/50">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
