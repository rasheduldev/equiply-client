import { getAdminEquipments, getAdminRentals, getAdminUsers } from "@/lib/admin"

import {
  normalizeEquipments,
  normalizeRentals,
  normalizeUsers,
} from "../_lib/utils"
import { AdminRentals } from "./_components/admin-rentals"

export default async function AdminAllRentalsPage() {
  const [rentalsResponse, usersResponse, equipmentsResponse] =
    await Promise.all([
      getAdminRentals(),
      getAdminUsers(),
      getAdminEquipments(),
    ])

  const users = normalizeUsers(usersResponse)
  const equipments = normalizeEquipments(equipmentsResponse)
  const rentals = normalizeRentals({
    response: rentalsResponse,
    users,
    equipments,
  })

  return <AdminRentals initialRentals={rentals} />
}
