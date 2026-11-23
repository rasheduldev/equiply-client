import type { AdminEquipment, AdminRental, AdminRole, AdminUser } from "./types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function toId(value: unknown): string {
  if (typeof value === "string") return value
  if (typeof value === "number") return String(value)

  if (isRecord(value) && typeof value.$oid === "string") {
    return value.$oid
  }

  return ""
}

function readString(
  record: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key]

    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  return ""
}

function readNumber(record: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key]

    if (typeof value === "number" && Number.isFinite(value)) {
      return value
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number.parseFloat(value)

      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }

  return null
}

function readAmount(value: unknown): number | string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim()
  }

  return null
}

function readNestedString(
  record: Record<string, unknown>,
  key: string,
  nestedKey: string
): string {
  const value = record[key]

  if (!isRecord(value)) return ""

  const nested = value[nestedKey]

  return typeof nested === "string" ? nested.trim() : ""
}

export function parseListResponse(response: unknown): unknown[] {
  if (Array.isArray(response)) {
    return response
  }

  if (isRecord(response)) {
    for (const key of [
      "data",
      "items",
      "users",
      "equipments",
      "bookings",
      "rentals",
    ]) {
      if (Array.isArray(response[key])) {
        return response[key]
      }
    }
  }

  return []
}

export function normalizeRole(value: unknown): AdminRole {
  if (typeof value !== "string") return "customer"

  const role = value.trim().toLowerCase()

  if (role === "owner" || role === "admin") {
    return role
  }

  return "customer"
}

export function normalizeUsers(response: unknown): AdminUser[] {
  return parseListResponse(response).flatMap((item, index) => {
    if (!isRecord(item)) return []

    const email = readString(item, "email")
    const name =
      readString(item, "name") ||
      (email ? email.split("@")[0] : "") ||
      "Unnamed user"

    return [
      {
        id: toId(item._id ?? item.id) || `user-${index}`,
        name,
        email: email || "Email unavailable",
        image: readString(item, "image"),
        role: normalizeRole(item.role),
        createdAt: readString(item, "createdAt", "created_at") || "",
      },
    ]
  })
}

export function normalizeEquipments(response: unknown): AdminEquipment[] {
  return parseListResponse(response).flatMap((item, index) => {
    if (!isRecord(item)) return []

    const ownerEmail = readString(item, "ownerEmail", "owner_email")
    const ownerName =
      readString(item, "ownerName", "owner_name") ||
      readNestedString(item, "owner", "name") ||
      (ownerEmail ? ownerEmail.split("@")[0] : "")

    return [
      {
        id: toId(item._id ?? item.id) || `equipment-${index}`,
        name: readString(item, "name") || "Untitled equipment",
        ownerName: ownerName || "Owner unavailable",
        ownerEmail,
        category: readString(item, "category") || "Uncategorized",
        rentalPrice: readNumber(item, "rentalPrice", "price"),
        rentalType: readString(item, "rentalType", "rental_type") || "Daily",
        status: readString(item, "status") || "Pending",
        location: readString(item, "location"),
        availableQuantity:
          readNumber(item, "availableQuantity", "quantity") ?? 0,
        condition: readString(item, "condition"),
        brand: readString(item, "brand"),
        model: readString(item, "model"),
        description: readString(item, "description"),
        imageUrl: readString(item, "imageUrl", "image"),
        createdAt: readString(item, "createdAt", "created_at") || "",
      },
    ]
  })
}

type NormalizeRentalsInput = {
  response: unknown
  users: AdminUser[]
  equipments: AdminEquipment[]
}

export function normalizeRentals({
  response,
  users,
  equipments,
}: NormalizeRentalsInput): AdminRental[] {
  const usersById = new Map<string, AdminUser>()
  const usersByEmail = new Map<string, AdminUser>()

  for (const user of users) {
    usersById.set(user.id, user)

    if (user.email) {
      usersByEmail.set(user.email.trim().toLowerCase(), user)
    }
  }

  const equipmentsById = new Map<string, AdminEquipment>()

  for (const equipment of equipments) {
    equipmentsById.set(equipment.id, equipment)
  }

  return parseListResponse(response).flatMap((item, index) => {
    if (!isRecord(item)) return []

    const equipmentId = toId(item.equipmentId ?? item.equipment)
    const equipment = equipmentsById.get(equipmentId)
    const bookingUserEmail = readString(item, "userEmail", "customerEmail")
    const user =
      usersById.get(toId(item.userId ?? item.customerId)) ||
      usersByEmail.get(bookingUserEmail.toLowerCase())

    const userEmail = user?.email || bookingUserEmail
    const ownerEmail = readString(item, "ownerEmail", "owner_email")
    const customerName =
      user?.name ||
      readString(item, "customerName") ||
      (userEmail ? userEmail.split("@")[0] : "") ||
      "Customer"
    const ownerName =
      readString(item, "ownerName", "owner_name") ||
      equipment?.ownerName ||
      (ownerEmail ? ownerEmail.split("@")[0] : "") ||
      "Owner unavailable"

    const quantity = readNumber(item, "quantity")

    return [
      {
        id: toId(item._id ?? item.id) || `rental-${index}`,
        customerName,
        customerEmail: userEmail || "Email unavailable",
        ownerName,
        equipmentName:
          readString(item, "equipmentName") ||
          equipment?.name ||
          "Equipment rental",
        startDate: formatDate(readString(item, "startDate", "start_date")),
        endDate: formatDate(readString(item, "endDate", "end_date")),
        quantity: quantity !== null && quantity > 0 ? Math.floor(quantity) : 1,
        amount: readAmount(item.totalAmount ?? item.amount),
        paymentStatus: readString(item, "paymentStatus") || "Pending",
        bookingStatus: readString(item, "bookingStatus") || "Pending",
        createdAt: readString(item, "createdAt", "created_at") || "",
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
  if (value === null || value === undefined || value === "") return "$0.00"

  const amount = typeof value === "string" ? Number.parseFloat(value) : value

  if (!Number.isFinite(amount)) return "$0.00"

  return `$${amount.toFixed(2)}`
}

export function formatRate(
  price: number | null,
  rentalType?: string | null
): string {
  if (price === null || !Number.isFinite(price)) return "—"

  const formatted = Number.isInteger(price) ? String(price) : price.toFixed(2)
  const period = rentalType?.trim().toLowerCase()

  return period ? `$${formatted}/${period}` : `$${formatted}`
}

export function formatStatus(value?: string | null): string {
  if (!value) return "Unknown"

  return value
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}
