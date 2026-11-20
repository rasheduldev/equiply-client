export type RentalType = "Daily" | "Weekly" | "Monthly"
export type EquipmentCondition =
  "Fleet Certified" | "Excellent" | "Good" | "Fair"

export type EquipmentForm = {
  name: string
  description: string
  category: string
  location: string
  price: string
  rentalType: RentalType
  quantity: string
  condition: EquipmentCondition
  brand: string
  model: string
  terms: string
}
export type EquipmentData = {
  name: string
  description: string
  category: string
  location: string
  rentalPrice: number
  rentalType: RentalType
  availableQuantity: number
  condition: EquipmentCondition
  brand: string
  model: string
  imageUrl: string
  rentalTerms: string
  status: "Pending"
  ownerId: string
  ownerName: string
  ownerEmail: string
  ownerImage: string
}

const STORAGE_KEY = "equiply:equipment-listings"

export const categories = [
  "Construction Equipment",
  "Excavators & Earthmoving",
  "Aerial Lifts & Scaffolding",
  "Cinema & Lighting",
  "Trucks & Transport",
  "Event & Staging",
  "Power & Compaction",
]

export const rentalTypes: RentalType[] = ["Daily", "Weekly", "Monthly"]

export const conditions: EquipmentCondition[] = [
  "Fleet Certified",
  "Excellent",
  "Good",
  "Fair",
]

export const initialForm: EquipmentForm = {
  name: "",
  description: "",
  category: "",
  location: "",
  price: "",
  rentalType: "Daily",
  quantity: "1",
  condition: "Fleet Certified",
  brand: "",
  model: "",
  terms: "",
}

export function saveListing(listing: Record<string, unknown>) {
  let existing: unknown[] = []

  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]"
    )

    if (Array.isArray(parsed)) {
      existing = parsed
    }
  } catch {
    existing = []
  }

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      {
        _id: id,
        createdAt: new Date().toISOString(),
        ...listing,
      },
      ...existing,
    ])
  )
}
