"use client"

import { useEffect, useState } from "react"
import { RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getUserBookings } from "@/lib/actions/payment"
import { authClient } from "@/lib/auth-client"

import { parseBookingsResponse } from "../_lib/booking-utils"
import type { BookingItem } from "../_lib/types"
import { RentalBookingsTable } from "./rental-bookings-table"
import { RentalsAuthRequired } from "./rentals-auth-required"
import { RentalsEmptyState } from "./rentals-empty-state"
import { RentalsErrorBanner } from "./rentals-error-banner"

export function MyRentals() {
  const { data: session, isPending: authPending } = authClient.useSession()
  const userId = session?.user?.id

  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (authPending) return

    if (!userId) return

    let isMounted = true

    const fetchBookings = async () => {
      try {
        setLoading(true)
        setError(null)

        const response: unknown = await getUserBookings(userId)
        if (!isMounted) return

        setBookings(parseBookingsResponse(response))
      } catch (err: unknown) {
        if (!isMounted) return

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load rental bookings. Please try again."
        )
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void fetchBookings()

    return () => {
      isMounted = false
    }
  }, [authPending, userId, retryCount])

  if (!authPending && !userId) {
    return <RentalsAuthRequired />
  }

  const handleRetry = () => {
    setRetryCount((count) => count + 1)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-brand-navy-soft">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold tracking-tight text-brand-navy sm:text-2xl dark:text-white">
            My Rental Bookings {loading ? "" : `(${bookings.length})`}
          </h1>
          {error && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="w-fit gap-2 text-xs"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          )}
        </div>

        {/* Error State Banner */}
        {error && <RentalsErrorBanner message={error} onRetry={handleRetry} />}

        {/* Loading State */}
        {loading ? (
          <RentalBookingsTable bookings={[]} loading />
        ) : bookings.length === 0 ? (
          /* Empty State */
          <RentalsEmptyState />
        ) : (
          /* Bookings Table */
          <RentalBookingsTable bookings={bookings} />
        )}
      </div>
    </div>
  )
}
