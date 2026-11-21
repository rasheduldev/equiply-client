import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"

import { API_BASE_URL } from "./constants/api"

export const getEquipments = async (query = ""): Promise<Equipment[]> => {
  const res = await fetch(`${API_BASE_URL}/equipments?${query}`)

  if (!res.ok) {
    throw new Error(`Failed to load equipment (${res.status})`)
  }

  const data = await res.json()

  return Array.isArray(data) ? data : []
}
