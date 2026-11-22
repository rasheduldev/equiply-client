import type { BadgeConfig, BookingItem } from "./types"

const successBadgeClassName =
  "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold"

const warningBadgeClassName =
  "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 font-semibold"

const neutralBadgeClassName =
  "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/70 font-semibold"

export function getEquipmentName(booking: BookingItem): string {
  if (booking.equipmentName) return booking.equipmentName
  if (booking.equipment?.name) return booking.equipment.name
  if (booking.equipment?.title) return booking.equipment.title
  if (typeof booking.equipmentId === "object" && booking.equipmentId?.name) {
    return booking.equipmentId.name
  }
  return "Equipment Rental"
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toISOString().split("T")[0]
  } catch {
    return dateStr
  }
}

export function formatAmount(amount?: number | string | null): string {
  if (amount == null) return "$0.00"

  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount

  if (isNaN(numericAmount)) return `$${amount}`
  return `$${numericAmount.toFixed(2)}`
}

export function getPaymentBadge(status?: string | null): BadgeConfig {
  const normalized = (status || "Paid").trim().toLowerCase()

  if (normalized === "paid") {
    return {
      label: "Paid",
      className: successBadgeClassName,
    }
  }

  if (normalized === "pending" || normalized === "unpaid") {
    return {
      label: normalized === "pending" ? "Pending" : "Unpaid",
      className: warningBadgeClassName,
    }
  }

  return {
    label: status || "Paid",
    className: neutralBadgeClassName,
  }
}

export function getStatusBadge(status?: string | null): BadgeConfig {
  const normalized = (status || "Pending").trim().toLowerCase()

  if (normalized === "completed") {
    return {
      label: "Completed",
      className: successBadgeClassName,
    }
  }

  if (normalized === "confirmed") {
    return {
      label: "Confirmed",
      className:
        "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 font-semibold",
    }
  }

  if (normalized === "pending") {
    return {
      label: "Pending",
      className: warningBadgeClassName,
    }
  }

  if (normalized === "cancelled" || normalized === "rejected") {
    return {
      label: "Cancelled",
      className:
        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 font-semibold",
    }
  }

  return {
    label: status || "Pending",
    className: neutralBadgeClassName,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function parseBookingsResponse(response: unknown): BookingItem[] {
  if (Array.isArray(response)) {
    return response as BookingItem[]
  }

  if (isRecord(response)) {
    if (Array.isArray(response.data)) {
      return response.data as BookingItem[]
    }

    if (Array.isArray(response.bookings)) {
      return response.bookings as BookingItem[]
    }
  }

  return []
}
