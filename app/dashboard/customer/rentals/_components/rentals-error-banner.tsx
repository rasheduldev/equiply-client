import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

type RentalsErrorBannerProps = {
  message: string
  onRetry: () => void
}

export function RentalsErrorBanner({
  message,
  onRetry,
}: RentalsErrorBannerProps) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
      <div className="flex-1">
        <p className="font-semibold">Unable to load your rental bookings</p>
        <p className="mt-0.5 text-xs text-rose-700/80 dark:text-rose-300/80">
          {message}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRetry}
        className="h-7 text-xs text-rose-800 hover:bg-rose-100 hover:text-rose-900 dark:text-rose-300 dark:hover:bg-rose-900/30"
      >
        Try Again
      </Button>
    </div>
  )
}
