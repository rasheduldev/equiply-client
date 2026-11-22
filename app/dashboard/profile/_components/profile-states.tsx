import Link from "next/link"
import { AlertCircle, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileLoadingState() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div
        aria-busy="true"
        aria-label="Loading profile"
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10 dark:border-white/10 dark:bg-brand-navy-soft"
      >
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="mt-3 h-4 w-full max-w-md" />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((field) => (
            <div key={field} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ))}

          <div className="space-y-2 md:col-span-2">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        <Skeleton className="mt-8 h-12 w-56 rounded-lg" />
      </div>
    </div>
  )
}

type ProfileErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ProfileErrorState({
  message,
  onRetry,
}: ProfileErrorStateProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-brand-navy-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h1 className="mt-4 text-xl font-bold text-brand-navy dark:text-white">
          Unable to load your profile
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-white/60">
          {message}
        </p>

        <Button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-lg bg-brand-amber font-semibold text-brand-navy hover:bg-brand-amber/90"
        >
          <RotateCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  )
}

type ProfileAuthRequiredProps = {
  callbackUrl: string
}

export function ProfileAuthRequired({ callbackUrl }: ProfileAuthRequiredProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-brand-navy-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h1 className="mt-4 text-xl font-bold text-brand-navy dark:text-white">
          Authentication Required
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-white/60">
          Please log in to your account to view and update your profile.
        </p>

        <Button
          nativeButton={false}
          render={
            <Link
              href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            />
          }
          className="mt-6 rounded-lg bg-brand-amber font-semibold text-brand-navy hover:bg-brand-amber/90"
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}
