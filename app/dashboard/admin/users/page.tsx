import { getAdminUsers } from "@/lib/admin"

import { normalizeUsers } from "../_lib/utils"
import { AdminUsers } from "./_components/admin-users"

export default async function AdminAllUsersPage() {
  const response = await getAdminUsers()

  return <AdminUsers initialUsers={normalizeUsers(response)} />
}
