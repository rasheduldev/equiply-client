import type {
  BadgeConfig,
  RentalBooking,
  RentalEquipment,
  RentalRow,
  RentalUser,
} from "./types"

const successBadgeClassName =
  "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"

const warningBadgeClassName =
  "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"

const dangerBadgeClassName =
  "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"

const neutralBadgeClassName =
  "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function toId(value: unknown): string {
  if (typeof value === "string") return value
  if (typeof value === "number") return String(value)
  return ""
}

export function parseListResponse<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[]
  }

  if (isRecord(response)) {
    for (const key of ["data", "items", "bookings", "equipments", "users"]) {
      if (Array.isArray(response[key])) {
        return response[key] as T[]
      }
    }
  }

  return []
}

type BuildRentalRowsInput = {
  bookings: RentalBooking[]
  equipments: RentalEquipment[]
  users: RentalUser[]
  ownerId: string
}

export function buildRentalRows({
  bookings,
  equipments,
  users,
  ownerId,
}: BuildRentalRowsInput): RentalRow[] {
  const ownedEquipmentById = new Map<string, RentalEquipment>()

  for (const equipment of equipments) {
    if (toId(equipment.ownerId) !== ownerId) continue

    const equipmentId = toId(equipment._id ?? equipment.id)
    if (equipmentId) {
      ownedEquipmentById.set(equipmentId, equipment)
    }
  }

  const usersById = new Map<string, RentalUser>()

  for (const user of users) {
    const userId = toId(user._id ?? user.id)
    if (userId) {
      usersById.set(userId, user)
    }
  }

  return bookings.flatMap((booking) => {
    const equipmentId = toId(booking.equipmentId)
    const equipment = ownedEquipmentById.get(equipmentId)

    if (!equipment) return []

    const customer = usersById.get(toId(booking.userId))
    const customerEmail = customer?.email?.trim() || booking.userEmail?.trim()
    const customerName = customer?.name?.trim() || customerEmail?.split("@")[0]

    const quantity = Number(booking.quantity)

    return [
      {
        id: toId(booking._id ?? booking.id) || equipmentId,
        customerName: customerName || "Customer",
        customerEmail: customerEmail || "Email unavailable",
        customerImage: customer?.image?.trim() || "",
        equipmentName:
          equipment.name?.trim() ||
          booking.equipmentName?.trim() ||
          "Equipment rental",
        equipmentImage: equipment.imageUrl?.trim() || "",
        startDate: formatDate(booking.startDate),
        endDate: formatDate(booking.endDate),
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        amount: booking.totalAmount ?? null,
        paymentStatus: booking.paymentStatus?.trim() || "Pending",
        bookingStatus: booking.bookingStatus?.trim() || "Pending",
      },
    ]
  })
}

export function formatDate(value?: string | null): string {
  if (!value) return "—"
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toISOString().slice(0, 10)
}

export function formatAmount(value?: number | string | null): string {
  if (value == null || value === "") return "$0.00"

  const amount = typeof value === "string" ? Number.parseFloat(value) : value

  if (!Number.isFinite(amount)) return "$0.00"

  return `$${amount.toFixed(2)}`
}

export function formatStatus(value: string): string {
  return value
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function getPaymentBadge(status: string): BadgeConfig {
  const normalized = status.trim().toLowerCase()

  if (normalized === "paid") {
    return { label: "Paid", className: successBadgeClassName }
  }

  if (normalized === "pending" || normalized === "unpaid") {
    return { label: formatStatus(status), className: warningBadgeClassName }
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "failed" ||
    normalized === "refunded"
  ) {
    return { label: formatStatus(status), className: dangerBadgeClassName }
  }

  return { label: formatStatus(status), className: neutralBadgeClassName }
}

export function getBookingStatusStyle(status: string): string {
  const normalized = status.trim().toLowerCase()

  if (normalized === "completed") {
    return "border-slate-900 bg-white text-slate-900 dark:border-white dark:bg-transparent dark:text-white"
  }

  if (normalized === "pending") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "rejected"
  ) {
    return "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
  }

  return "border-slate-200 bg-white text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-white/75"
}
