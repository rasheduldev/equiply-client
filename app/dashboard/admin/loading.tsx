import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading admin dashboard data"
      className="-m-4 min-h-[calc(100vh-3.5rem)] bg-slate-50 p-4 md:-m-6 md:p-6 dark:bg-[#0a1729]"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-40px_rgba(13,32,55,0.45)] dark:border-white/10 dark:bg-brand-navy-soft">
          <div className="px-5 pt-6 pb-2 sm:px-7 sm:pt-7">
            <Skeleton className="h-8 w-72 max-w-full" />
          </div>

          <div className="space-y-4 px-5 pb-6 sm:px-7">
            <div className="hidden grid-cols-6 gap-4 border-b border-slate-100 py-4 md:grid dark:border-white/5">
              {[1, 2, 3, 4, 5, 6].map((column) => (
                <Skeleton key={column} className="h-3 w-20 max-w-full" />
              ))}
            </div>

            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div
                key={row}
                className="grid gap-4 border-b border-slate-100 py-4 last:border-0 md:grid-cols-6 dark:border-white/5"
              >
                <div className="flex items-center gap-3 md:col-span-2">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-36 max-w-full" />
                </div>
                <Skeleton className="hidden h-4 w-32 md:block" />
                <Skeleton className="hidden h-4 w-24 md:block" />
                <Skeleton className="hidden h-6 w-20 rounded-md md:block" />
                <Skeleton className="hidden h-9 w-28 justify-self-end rounded-md md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
