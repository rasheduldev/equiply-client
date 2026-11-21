import {
  rentalTypes,
  type RentalType,
} from "@/app/dashboard/owner/add-equipment/_lib/equipment-form"

export type EquipmentSearchParams = {
  [key: string]: string | string[] | undefined
}

// The marketplace inventory uses these category names. They are kept here so
// the public filter only offers categories that match the live listings.
export const equipmentCategories = [
  "Agriculture Equipment",
  "Construction Equipment",
  "Electronics",
  "Event Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
] as const

export const equipmentFilterKeys = [
  "category",
  "rentalType",
  "minPrice",
  "maxPrice",
  "availability",
] as const

export const equipmentSortOptions = [
  { value: "recent", label: "Recently Added" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
] as const

export type EquipmentSort = (typeof equipmentSortOptions)[number]["value"]

export const defaultEquipmentSort: EquipmentSort = "recent"

export const availabilityOptions = [
  { value: "", label: "Any" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
] as const

export function isEquipmentSort(
  value: string | null | undefined
): value is EquipmentSort {
  return equipmentSortOptions.some((option) => option.value === value)
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function normalizePrice(value: string | undefined) {
  if (!value) {
    return undefined
  }

  const price = Number(value)

  return Number.isFinite(price) && price >= 0 ? String(price) : undefined
}

/**
 * Turns the page's search params into the query string expected by the
 * equipments API. Invalid or unsupported values are ignored so the page never
 * sends junk to the backend.
 */
export function buildEquipmentQuery(params: EquipmentSearchParams) {
  const query = new URLSearchParams()
  const search = firstValue(params.search)?.trim()

  if (search) {
    query.set("search", search)
  }

  const category = firstValue(params.category)
  if (category && equipmentCategories.some((option) => option === category)) {
    query.set("category", category)
  }

  const rentalType = firstValue(params.rentalType)
  if (rentalType && rentalTypes.includes(rentalType as RentalType)) {
    query.set("rentalType", rentalType)
  }

  const minPrice = normalizePrice(firstValue(params.minPrice))
  if (minPrice) {
    query.set("minPrice", minPrice)
  }

  const maxPrice = normalizePrice(firstValue(params.maxPrice))
  if (maxPrice) {
    query.set("maxPrice", maxPrice)
  }

  const availability = firstValue(params.availability)
  if (availability === "available" || availability === "unavailable") {
    query.set("availability", availability)
  }

  const sort = firstValue(params.sort)
  query.set("sort", isEquipmentSort(sort) ? sort : defaultEquipmentSort)

  return query.toString()
}
