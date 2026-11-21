import { EquipmentData } from "@/app/dashboard/owner/add-equipment/_lib/equipment-form"
import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"
import { API_BASE_URL } from "../api/constants/api"

export const createEquipment = async (data: EquipmentData) => {
  const res = await fetch(`${API_BASE_URL}/equipments`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

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
    return await res.json()
  } catch (err) {
    console.error("Error fetching equipment by id:", err)
    return null
  }
}

export const deleteEquipment = async (equipmentId: string) => {
  const res = await fetch(`${API_BASE_URL}/equipments/${equipmentId}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete equipment")
  }

  return res.json()
}
