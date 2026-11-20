import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  approved:
    "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
  pending:
    "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-brand-amber/10 dark:text-brand-amber dark:ring-brand-amber/20",
  rejected:
    "bg-red-100 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20",
  default:
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/10 dark:text-white/65 dark:ring-white/10",
}

type StatusBadgeProps = {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style =
    statusStyles[status.trim().toLowerCase()] ?? statusStyles.default

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold whitespace-nowrap ring-1",
        style,
        className
      )}
    >
      {status}
    </span>
  )
}
