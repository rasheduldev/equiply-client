import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"

import type { FavoriteItem } from "./types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isEquipment(value: unknown): value is Equipment {
  return (
    isRecord(value) &&
    typeof value._id === "string" &&
    typeof value.name === "string" &&
    typeof value.rentalPrice === "number" &&
    typeof value.rentalType === "string" &&
    typeof value.availableQuantity === "number"
  )
}

export function parseFavoritesResponse(response: unknown): FavoriteItem[] {
  if (!Array.isArray(response)) return []

  const favorites: FavoriteItem[] = []

  for (const value of response) {
    if (!isRecord(value) || typeof value._id !== "string") continue

    favorites.push({
      _id: value._id,
      equipmentId:
        typeof value.equipmentId === "string" ? value.equipmentId : undefined,
      equipment: isEquipment(value.equipment) ? value.equipment : null,
      createdAt:
        typeof value.createdAt === "string" ? value.createdAt : undefined,
    })
  }

  return favorites
}
