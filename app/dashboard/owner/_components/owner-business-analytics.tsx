"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getOwnerAnalytics } from "@/lib/analytics"
import { authClient } from "@/lib/auth-client"

import {
  AnalyticsDashboard,
  type AnalyticsStat,
} from "../../components/analytics-dashboard"
import {
  buildMonthlyBookingSeries,
  formatAnalyticsCurrency,
} from "../../components/analytics-utils"

export type OwnerEquipmentRecord = {
  _id?: string
  name?: string
  status?: string
  price?: number
  [key: string]: unknown
}

export type OwnerBookingRecord = {
  _id?: string
  equipmentId?: string | { _id?: string }
  totalAmount?: number
  totalPrice?: number
  baseRate?: number
  escrowFee?: number
  paymentStatus?: string
  payment?: string
  bookingStatus?: string
  status?: string
  createdAt?: string
  bookingDate?: string
  paidAt?: string
  startDate?: string
  [key: string]: unknown
}

export type OwnerAnalyticsRawData = {
  equipments?: OwnerEquipmentRecord[]
  bookings?: OwnerBookingRecord[]
  data?: {
    equipments?: OwnerEquipmentRecord[]
    bookings?: OwnerBookingRecord[]
  }
}

type OwnerBusinessAnalyticsProps = {
  initialData?: OwnerAnalyticsRawData | null
  initialError?: string | null
}

export function OwnerBusinessAnalytics({
  initialData,
  initialError,
}: OwnerBusinessAnalyticsProps) {
  const { data: session, isPending: authPending } = authClient.useSession()
  const ownerId = session?.user?.id
  const isOwner = session?.user?.role === "owner"

  const [data, setData] = useState<OwnerAnalyticsRawData | null>(
    initialData ?? null
  )
  const [error, setError] = useState<string | null>(initialError ?? null)
  const [loading, setLoading] = useState(false)

  // Fetch data if initialData was not provided on the server
  useEffect(() => {
    if (initialData || initialError) return
    if (authPending || !ownerId || !isOwner) return

    let active = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getOwnerAnalytics()
        if (active) {
          setData(res)
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load business analytics"
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [initialData, initialError, authPending, ownerId, isOwner])

  const handleRetry = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getOwnerAnalytics()
      setData(res)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load business analytics"
      )
    } finally {
      setLoading(false)
    }
  }

  if (!authPending && (!ownerId || !isOwner)) {
    return (
      <div className="-m-4 min-h-[calc(100vh-3.5rem)] bg-slate-50 p-4 md:-m-6 md:p-6 dark:bg-[#0a1729]">
        <div className="mx-auto flex min-h-[50vh] max-w-lg items-center justify-center">
          <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-brand-navy-soft">
            <h2 className="text-lg font-bold text-brand-navy dark:text-white">
              Owner Access Required
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-white/60">
              Please sign in with an equipment owner account to view business analytics.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-brand-amber px-4 text-xs font-semibold text-brand-navy hover:bg-brand-amber/90"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="-m-4 min-h-[calc(100vh-3.5rem)] bg-slate-50 p-4 md:-m-6 md:p-6 dark:bg-[#0a1729]">
        <div className="mx-auto w-full max-w-7xl space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex min-h-[110px] flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 dark:border-white/10 dark:bg-brand-navy-soft"
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-14" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-brand-navy-soft">
            <Skeleton className="h-7 w-72" />
            <Skeleton className="mt-2 h-4 w-96 max-w-full" />
            <div className="mt-8 flex h-56 items-end justify-between gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-36 flex-1 rounded-t-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="-m-4 min-h-[calc(100vh-3.5rem)] bg-slate-50 p-4 md:-m-6 md:p-6 dark:bg-[#0a1729]">
        <div className="mx-auto flex min-h-[50vh] max-w-lg items-center justify-center">
          <div className="w-full rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-brand-navy-soft">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <AlertCircle className="size-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-brand-navy dark:text-white">
              Unable to load business analytics
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-white/60">
              {error}
            </p>
            <Button
              type="button"
              onClick={handleRetry}
              className="mt-6 h-9 gap-2 rounded-lg bg-brand-amber px-4 text-xs font-semibold text-brand-navy hover:bg-brand-amber/90"
            >
              <RotateCw className="size-3.5" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Parse owner's equipment and bookings from API response
  const raw = data?.data || data || {}
  const equipments = Array.isArray(raw.equipments) ? raw.equipments : []
  const bookings = Array.isArray(raw.bookings) ? raw.bookings : []

  // 1. Total Listed Equipment
  const totalListedEquipment = equipments.length

  // Pending equipment approvals
  const pendingApprovals = equipments.filter(
    (e) => String(e?.status || "").trim().toLowerCase() === "pending"
  ).length

  // Total bookings for owner's equipment
  const totalBookings = bookings.length

  // Active / Confirmed rentals
  const activeRentals = bookings.filter((b) => {
    const s = String(b?.bookingStatus || b?.status || "").trim().toLowerCase()
    return s === "confirmed" || s === "in progress"
  }).length

  // 2. Completed Rentals using bookingStatus === "Completed"
  const completedRentals = bookings.filter(
    (b) => b?.bookingStatus === "Completed" || b?.status === "Completed"
  ).length

  // 3. Total Earnings using successful payments, excluding the escrow fee
  // If payment data is missing from the API response, do not display fabricated earnings
  const totalEarnings = bookings.reduce((sum, b) => {
    const isSuccessfulPayment =
      String(b?.paymentStatus || b?.payment || "").trim().toLowerCase() === "paid"

    if (!isSuccessfulPayment) return sum

    // Check payment total amount
    const total =
      typeof b?.totalAmount === "number"
        ? b.totalAmount
        : typeof b?.totalPrice === "number"
        ? b.totalPrice
        : Number.parseFloat(String(b?.totalAmount || b?.totalPrice || ""))

    if (!Number.isFinite(total)) return sum

    // Exclude escrow fee from total payment
    const escrow =
      typeof b?.escrowFee === "number"
        ? b.escrowFee
        : Number.parseFloat(String(b?.escrowFee || ""))

    if (Number.isFinite(escrow)) {
      return sum + Math.max(total - escrow, 0)
    }

    // If baseRate is stored explicitly, use baseRate
    const base =
      typeof b?.baseRate === "number"
        ? b.baseRate
        : Number.parseFloat(String(b?.baseRate || ""))

    if (Number.isFinite(base)) {
      return sum + base
    }

    return sum + total
  }, 0)

  // Responsive summary cards
  const stats: AnalyticsStat[] = [
    {
      label: "TOTAL LISTED EQUIPMENT",
      value: String(totalListedEquipment),
      tone: "default",
    },
    {
      label: "PENDING APPROVALS",
      value: String(pendingApprovals),
      tone: "amber",
    },
    {
      label: "TOTAL BOOKINGS",
      value: String(totalBookings),
      tone: "default",
    },
    {
      label: "ACTIVE RENTALS",
      value: String(activeRentals),
      tone: "default",
    },
    {
      label: "COMPLETED",
      value: String(completedRentals),
      tone: "green",
    },
    {
      label: "TOTAL EARNINGS",
      value: formatAnalyticsCurrency(totalEarnings),
      tone: "amber",
    },
  ]

  // 4. Monthly earnings chart data (excluding escrow fee for each paid booking)
  const monthlyEarningsEntries = bookings
    .filter((b) => {
      const isSuccessfulPayment =
        String(b?.paymentStatus || b?.payment || "").trim().toLowerCase() === "paid"
      return isSuccessfulPayment
    })
    .map((b) => {
      const total =
        typeof b?.totalAmount === "number"
          ? b.totalAmount
          : Number.parseFloat(String(b?.totalAmount || "")) || 0

      const escrow =
        typeof b?.escrowFee === "number"
          ? b.escrowFee
          : Number.parseFloat(String(b?.escrowFee || "")) || 0

      const base =
        typeof b?.baseRate === "number"
          ? b.baseRate
          : Number.parseFloat(String(b?.baseRate || "")) || 0

      const earning = escrow > 0 ? Math.max(total - escrow, 0) : base > 0 ? base : total

      const date = (b?.paidAt ||
        b?.createdAt ||
        b?.bookingDate ||
        b?.startDate) as string | undefined

      return { date, value: earning }
    })

  const monthlyBookings = buildMonthlyBookingSeries(monthlyEarningsEntries)

  return (
    <AnalyticsDashboard
      title="Business Analytics"
      heading="Business Analytics"
      stats={stats}
      chartTitle="Monthly Business Earnings"
      chartDescription="Net rental earnings from your equipment fleet (excluding escrow protection fees)"
      monthlyBookings={monthlyBookings}
      pendingCount={pendingApprovals}
      pendingHref="/dashboard/owner/my-equipment"
    />
  )
}
