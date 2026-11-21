import { Skeleton } from "@/components/ui/skeleton"

export function EquipmentResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading equipment">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="hidden h-3.5 w-28 sm:block" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-brand-navy-soft"
          >
            <Skeleton className="aspect-[16/10] w-full rounded-none" />

            <div className="space-y-3 p-5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />

              <div className="flex items-center justify-between gap-3 pt-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
