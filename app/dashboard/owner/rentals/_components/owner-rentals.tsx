"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { getAllBookings, getAllEquipments } from "@/lib/api/bookings"
import { authClient } from "@/lib/auth-client"

import { getAllUsers } from "../_lib/rentals-api"
import { buildRentalRows, parseListResponse } from "../_lib/rentals-utils"
import type {
  RentalBooking,
  RentalEquipment,
  RentalRow,
  RentalUser,
} from "../_lib/types"
import { RentalsTable } from "./rentals-table"
import {
  OwnerOnlyState,
  RentalsAuthRequired,
  RentalsEmptyState,
  RentalsErrorState,
} from "./rentals-states"

export function OwnerRentals() {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  const ownerId = session?.user?.id
  const isOwner = session?.user?.role === "owner"

  const [rentals, setRentals] = useState<RentalRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (isPending || !ownerId || !isOwner) return

    let active = true

    const loadRentals = async () => {
      try {
        setLoading(true)
        setError(null)

        const [bookingsResponse, equipmentsResponse, usersResponse] =
          await Promise.all([
            getAllBookings(),
            getAllEquipments(),
            getAllUsers(),
          ])

        if (!active) return

        setRentals(
          buildRentalRows({
            bookings: parseListResponse<RentalBooking>(bookingsResponse),
            equipments: parseListResponse<RentalEquipment>(equipmentsResponse),
            users: parseListResponse<RentalUser>(usersResponse),
            ownerId,
          })
        )
      } catch (err: unknown) {
        if (!active) return

        setError(
          err instanceof Error
            ? err.message
            : "We couldn't load customer rentals. Please try again."
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadRentals()

    return () => {
      active = false
    }
  }, [isPending, ownerId, isOwner, retryCount])

  const countLabel =
    !isPending && ownerId && isOwner && !loading && !error
      ? `(${rentals.length})`
      : ""

  function handleRetry() {
    setError(null)
    setLoading(true)
    setRetryCount((count) => count + 1)
  }

  return (
    <div className="-m-4 min-h-[calc(100vh-3.5rem)] bg-slate-50 p-4 md:-m-6 md:p-6 dark:bg-[#0a1729]">
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-40px_rgba(13,32,55,0.45)] dark:border-white/10 dark:bg-brand-navy-soft">
          <header className="px-5 pt-6 pb-2 sm:px-8 sm:pt-8">
            <h1 className="text-xl font-bold tracking-tight text-brand-navy sm:text-2xl dark:text-white">
              Customer Rentals On My Equipment {countLabel}
            </h1>
          </header>

          <div className="px-5 pb-6 sm:px-8">
            {!isPending && !ownerId ? (
              <RentalsAuthRequired callbackUrl={pathname} />
            ) : !isPending && ownerId && !isOwner ? (
              <OwnerOnlyState />
            ) : error ? (
              <RentalsErrorState message={error} onRetry={handleRetry} />
            ) : isPending || loading ? (
              <RentalsTable rentals={[]} loading />
            ) : rentals.length === 0 ? (
              <RentalsEmptyState />
            ) : (
              <RentalsTable rentals={rentals} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
