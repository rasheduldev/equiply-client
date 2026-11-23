import { cn } from "@/lib/utils"

import type { AdminRole } from "../_lib/types"
import { formatStatus, normalizeRole } from "../_lib/utils"

const roleLabels: Record<AdminRole, string> = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
}

export function RoleBadge({
  role,
  className,
}: {
  role: AdminRole
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-brand-navy px-3 py-1 text-xs font-bold whitespace-nowrap text-brand-amber dark:bg-brand-amber dark:text-brand-navy",
        className
      )}
    >
      {roleLabels[normalizeRole(role)]}
    </span>
  )
}

const equipmentStatusStyles: Record<string, string> = {
  approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  default: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60",
}

export function EquipmentStatusBadge({ status }: { status: string }) {
  const key = status.trim().toLowerCase()

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-xs font-bold whitespace-nowrap",
        equipmentStatusStyles[key] ?? equipmentStatusStyles.default
      )}
    >
      {formatStatus(status)}
    </span>
  )
}

const paymentStatusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  unpaid:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  failed: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  refunded: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  default: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60",
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const key = status.trim().toLowerCase()

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-xs font-bold whitespace-nowrap",
        paymentStatusStyles[key] ?? paymentStatusStyles.default
      )}
    >
      {formatStatus(status)}
    </span>
  )
}

const bookingStatusStyles: Record<string, string> = {
  completed:
    "border-slate-300 bg-white text-slate-800 dark:border-white/20 dark:bg-white/5 dark:text-white/80",
  confirmed:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
  "in progress":
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300",
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  cancelled:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  default:
    "border-slate-200 bg-white text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-white/70",
}

export function BookingStatusBadge({ status }: { status: string }) {
  const key = status.trim().toLowerCase().replace(/[_-]+/g, " ")

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-bold whitespace-nowrap",
        bookingStatusStyles[key] ?? bookingStatusStyles.default
      )}
    >
      {formatStatus(status)}
    </span>
  )
}
