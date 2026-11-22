import Link from "next/link"
import type { ReactNode } from "react"
import {
  CircleX,
  ClipboardList,
  RotateCw,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"

type RentalsErrorStateProps = {
  message: string
  onRetry: () => void
}

export function RentalsErrorState({
  message,
  onRetry,
}: RentalsErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
    >
      <div className="flex items-start gap-2">
        <CircleX aria-hidden className="mt-0.5 size-4 shrink-0" />
        <p>{message}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        className="h-9 shrink-0 border-red-200 bg-white text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10"
      >
        <RotateCw aria-hidden className="size-4" />
        Retry
      </Button>
    </div>
  )
}

export function RentalsEmptyState() {
  return (
    <StatePanel
      icon={<ClipboardList aria-hidden className="size-7" />}
      title="No customer rentals yet"
      description="When a customer books one of your machines, the rental details will appear here."
      action={
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/owner/my-equipment" />}
          className="h-10 bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand"
        >
          View My Equipment
        </Button>
      }
    />
  )
}

export function RentalsAuthRequired({ callbackUrl }: { callbackUrl: string }) {
  return (
    <StatePanel
      icon={<UserRound aria-hidden className="size-7" />}
      title="Sign in to view your rentals"
      description="Customer rentals are tied to your owner account. Sign in to see bookings for your equipment."
      action={
        <Button
          nativeButton={false}
          render={
            <Link
              href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            />
          }
          className="h-10 bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand"
        >
          Sign In
        </Button>
      }
    />
  )
}

export function OwnerOnlyState() {
  return (
    <StatePanel
      icon={<ShieldCheck aria-hidden className="size-7" />}
      title="Owner account required"
      description="This page is only available to owner accounts. Sign in with an owner account to view rentals for your equipment."
    />
  )
}

type StatePanelProps = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

function StatePanel({ icon, title, description, action }: StatePanelProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-amber-soft text-brand-amber-deep dark:bg-brand-amber/10 dark:text-brand-amber">
        {icon}
      </span>

      <h2 className="mt-4 text-lg font-bold text-brand-navy dark:text-white">
        {title}
      </h2>

      <p className="mt-1 max-w-sm text-sm leading-relaxed text-brand-muted dark:text-white/50">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
