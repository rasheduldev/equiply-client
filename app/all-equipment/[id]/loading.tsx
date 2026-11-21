import { Skeleton } from "@/components/ui/skeleton"

export default function EquipmentDetailsLoading() {
  return (
    <div className="bg-slate-50/60 py-6 sm:py-8 lg:py-10 dark:bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <span className="text-slate-300 dark:text-white/20">/</span>
          <Skeleton className="h-4 w-24" />
          <span className="text-slate-300 dark:text-white/20">/</span>
          <Skeleton className="h-4 w-48" />
        </div>

        {/* 2-Column Grid Skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-7 xl:col-span-7">
            <Skeleton className="aspect-[16/10] w-full rounded-3xl" />
            <Skeleton className="h-72 w-full rounded-3xl" />
          </div>

          <div className="lg:col-span-5 xl:col-span-5">
            <Skeleton className="h-[480px] w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
