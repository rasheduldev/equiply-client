import type { Equipment } from "./types"

export function formatRentalPrice(
  equipment: Pick<Equipment, "rentalPrice" | "rentalType">
) {
  return `$${equipment.rentalPrice}/${equipment.rentalType.toLowerCase()}`
}
