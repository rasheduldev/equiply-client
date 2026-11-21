import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"
import { API_BASE_URL } from "@/lib/api/constants/api"

export const getEquipmentById = async (
  id: string
): Promise<Equipment | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/equipments/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`Failed to load equipment (${res.status})`)
    }

    const data = await res.json()
    return data ?? null
  } catch (err) {
    console.error("Error fetching equipment by id:", err)
    return null
  }
}
