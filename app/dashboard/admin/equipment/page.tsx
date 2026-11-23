import { getAdminEquipments } from "@/lib/admin"

import { normalizeEquipments } from "../_lib/utils"
import { AdminEquipment } from "./_components/admin-equipment"

export default async function AdminAllEquipmentPage() {
  const response = await getAdminEquipments()

  return <AdminEquipment initialEquipments={normalizeEquipments(response)} />
}
