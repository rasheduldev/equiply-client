import { Info } from "lucide-react"

export function ProfileIncompleteNotice() {
  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <p>
        Your profile is missing a few details. Add a phone number and address so
        owners and admins can reach you about bookings and deliveries.
      </p>
    </div>
  )
}
