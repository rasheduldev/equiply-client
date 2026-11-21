"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

type AllEquipmentErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function AllEquipmentError({
  error,
  retry,
}: AllEquipmentErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_24px_60px_-40px_rgba(13,32,55,0.45)] dark:border-white/10 dark:bg-brand-navy-soft">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle aria-hidden className="size-7" />
        </span>

        <h1 className="mt-4 text-xl font-bold text-brand-navy dark:text-white">
          Couldn&apos;t load equipment
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-brand-muted dark:text-white/55">
          Something went wrong while fetching the marketplace listings. Please
          try again in a moment.
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
            render={<Link href="/" />}
            variant="outline"
            className="h-10"
          >
            <Home aria-hidden className="size-4" />
            Back home
          </Button>
        </div>
      </div>
    </main>
  )
}
