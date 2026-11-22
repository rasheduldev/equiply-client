import { cn } from "@/lib/utils"

import {
  formatStatus,
  getBookingStatusStyle,
  getPaymentBadge,
} from "../_lib/rentals-utils"

export function PaymentBadge({ status }: { status: string }) {
  const badge = getPaymentBadge(status)

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-xs font-bold whitespace-nowrap",
        badge.className
      )}
    >
      {badge.label}
    </span>
  )
}

export function BookingStatus({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-bold whitespace-nowrap",
        getBookingStatusStyle(status)
      )}
    >
      {formatStatus(status)}
    </span>
  )
}
