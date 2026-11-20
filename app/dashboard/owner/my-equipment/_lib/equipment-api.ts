import { getEquipments } from "@/lib/api/equipments"

import { applyOverrides } from "./local-overrides"
import type { Equipment } from "./types"

function isOwnerEquipment(value: unknown, ownerId: string): value is Equipment {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    item.ownerId === ownerId &&
    typeof item._id === "string" &&
    typeof item.name === "string"
  )
}

export async function getOwnerEquipments(
  ownerId: string
): Promise<Equipment[]> {
  const data: unknown = await getEquipments()

  if (!Array.isArray(data)) {
    throw new Error("Unexpected equipment response.")
  }

  const owned = data.filter((item): item is Equipment =>
    isOwnerEquipment(item, ownerId)
  )

  return applyOverrides(owned)
}
