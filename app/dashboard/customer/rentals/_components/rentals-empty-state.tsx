import Link from "next/link"
import { Calendar, PackageOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

export function RentalsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/40">
        <PackageOpen className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-bold text-brand-navy dark:text-white">
        No rental bookings found
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-white/60">
        You haven&apos;t placed any equipment rental bookings yet. Browse our
        verified inventory to get started.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/all-equipment" />}
        className="mt-6 rounded-lg bg-brand-amber font-semibold text-brand-navy hover:bg-brand-amber/90"
      >
        <Calendar className="mr-2 h-4 w-4" />
        Browse Equipment
      </Button>
    </div>
  )
}
