import type { Metadata } from "next"
import { Suspense } from "react"

import { EquipmentFilters } from "./_components/equipment-filters"
import { EquipmentResults } from "./_components/equipment-results"
import { EquipmentResultsSkeleton } from "./_components/equipment-results-skeleton"
import { EquipmentToolbar } from "./_components/equipment-toolbar"
import { buildEquipmentQuery, type EquipmentSearchParams } from "./_lib/query"

export const metadata: Metadata = {
  title: "All Available Equipment | Equiply",
  description:
    "Browse verified equipment for rent. Search by name, location, or category, and filter by rental type, price, and availability.",
}

type AllEquipmentPageProps = {
  searchParams: Promise<EquipmentSearchParams>
}

export default async function AllEquipmentPage({
  searchParams,
}: AllEquipmentPageProps) {
  const query = buildEquipmentQuery(await searchParams)

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-6">
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <EquipmentToolbar />
        </div>

        <EquipmentFilters className="lg:col-start-1 lg:row-span-2 lg:row-start-1" />

        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
          <Suspense key={query} fallback={<EquipmentResultsSkeleton />}>
            <EquipmentResults query={query} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
