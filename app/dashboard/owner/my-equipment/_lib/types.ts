import type { EquipmentData } from "@/app/dashboard/owner/add-equipment/_lib/equipment-form"

export type Equipment = Omit<EquipmentData, "status" | "condition"> & {
  _id: string
  status: string
  condition: string
  createdAt?: string
}
