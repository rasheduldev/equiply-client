import { Skeleton } from "@/components/ui/skeleton"

import { EquipmentResultsSkeleton } from "./_components/equipment-results-skeleton"

export default function AllEquipmentLoading() {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-6">
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <Skeleton className="h-[112px] w-full rounded-2xl" />
        </div>

        <div className="hidden lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:block">
          <Skeleton className="h-[430px] w-full rounded-2xl bg-brand-navy/90" />
        </div>

        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
          <EquipmentResultsSkeleton />
        </div>
      </div>
    </main>
  )
}
