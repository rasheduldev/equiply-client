"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AdminDashboardError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="-m-4 min-h-[calc(100vh-3.5rem)] bg-slate-50 p-4 md:-m-6 md:p-6 dark:bg-[#0a1729]">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_24px_60px_-40px_rgba(13,32,55,0.45)] dark:border-white/10 dark:bg-brand-navy-soft">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-300">
            <AlertTriangle aria-hidden className="size-7" />
          </span>

          <h1 className="mt-4 text-xl font-bold text-brand-navy dark:text-white">
            Couldn&apos;t load admin data
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-brand-muted dark:text-white/55">
            Something went wrong while fetching platform records. Please try
            again in a moment.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => retry()}
              className="h-10 bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand"
            >
              <RotateCcw aria-hidden className="size-4" />
              Try again
            </Button>

            <Button
              nativeButton={false}
              render={<Link href="/dashboard/admin/users" />}
              variant="outline"
              className="h-10"
            >
              <UsersRound aria-hidden className="size-4" />
              Back to users
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
