import { getAdminAnalytics } from "@/lib/analytics"
import { AdminPlatformAnalytics } from "./_components/admin-platform-analytics"

export default async function AdminDashboardPage() {
  let initialData = null
  let initialError: string | null = null

  try {
    initialData = await getAdminAnalytics()
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : "Failed to load platform analytics"
  }

  return (
    <AdminPlatformAnalytics
      initialData={initialData}
      initialError={initialError}
    />
  )
}
