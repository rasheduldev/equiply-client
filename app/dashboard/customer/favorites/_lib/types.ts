import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"

export type FavoriteItem = {
  _id: string
  equipmentId?: string
  equipment?: Equipment | null
  createdAt?: string
}
