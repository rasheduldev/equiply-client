import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export function RentalsAuthRequired() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-brand-navy-soft">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-brand-navy dark:text-white">
            Authentication Required
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-white/60">
            Please log in to your account to view your rental bookings and
            reservation history.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            className="mt-6 rounded-lg bg-brand-amber font-semibold text-brand-navy hover:bg-brand-amber/90"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  )
}
