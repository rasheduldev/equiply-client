import { getOwnerAnalytics } from "@/lib/analytics"
import { OwnerBusinessAnalytics } from "./_components/owner-business-analytics"

export default async function OwnerDashboardPage() {
  let initialData = null
  let initialError: string | null = null

  try {
    initialData = await getOwnerAnalytics()
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : "Failed to load business analytics"
  }

  return (
    <OwnerBusinessAnalytics
      initialData={initialData}
      initialError={initialError}
    />
  )
}
