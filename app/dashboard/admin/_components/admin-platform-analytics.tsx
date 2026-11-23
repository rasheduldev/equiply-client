"use client"

import { useState } from "react"
import { AlertCircle, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getAdminAnalytics } from "@/lib/analytics"

import {
  AnalyticsDashboard,
  type AnalyticsStat,
} from "../../components/analytics-dashboard"
import {
  buildMonthlyBookingSeries,
  formatAnalyticsCurrency,
} from "../../components/analytics-utils"

export type AdminAnalyticsRawData = {
  users?: Array<Record<string, unknown>>
  equipments?: Array<Record<string, unknown>>
  bookings?: Array<Record<string, unknown>>
  payments?: Array<Record<string, unknown>>
  data?: {
    users?: Array<Record<string, unknown>>
    equipments?: Array<Record<string, unknown>>
    bookings?: Array<Record<string, unknown>>
    payments?: Array<Record<string, unknown>>
  }
}

type AdminPlatformAnalyticsProps = {
  initialData?: AdminAnalyticsRawData | null
  initialError?: string | null
}

export function AdminPlatformAnalytics({
  initialData,
  initialError,
}: AdminPlatformAnalyticsProps) {
  const [data, setData] = useState<AdminAnalyticsRawData | null>(
    initialData ?? null
  )
  const [error, setError] = useState<string | null>(initialError ?? null)
  const [loading, setLoading] = useState(false)

  const handleRetry = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getAdminAnalytics()
      setData(res)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load platform analytics"
      )
    } finally {
      setLoading(false)
    }
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
              Unable to load platform analytics
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

  // Calculate statistics in the frontend
  const raw = data?.data || data || {}
  const users = Array.isArray(raw.users) ? raw.users : []
  const equipments = Array.isArray(raw.equipments) ? raw.equipments : []
  const bookings = Array.isArray(raw.bookings) ? raw.bookings : []
  const payments = Array.isArray(raw.payments) ? raw.payments : []

  const totalUsers = users.length
  const totalEquipment = equipments.length
  const totalBookings = bookings.length

  const pendingApprovals = equipments.filter((e) => {
    const status = String(e?.status || "").trim().toLowerCase()
    return status === "pending"
  }).length

  const completedRentals = bookings.filter((b) => {
    const status = String(b?.status || b?.bookingStatus || "").trim().toLowerCase()
    return status === "completed"
  }).length

  // Calculate revenue from verified payments or paid bookings
  const paymentsRevenue = payments.reduce((sum, p) => {
    const val =
      typeof p?.amount === "number"
        ? p.amount
        : Number.parseFloat(String(p?.amount || "")) || 0
    return sum + val
  }, 0)

  const bookingsRevenue = bookings
    .filter((b) => {
      const pStatus = String(b?.paymentStatus || b?.payment || "").trim().toLowerCase()
      return pStatus === "paid"
    })
    .reduce((sum, b) => {
      const val =
        typeof b?.totalAmount === "number"
          ? b.totalAmount
          : typeof b?.totalPrice === "number"
          ? b.totalPrice
          : Number.parseFloat(String(b?.totalAmount || b?.totalPrice || "")) || 0
      return sum + val
    }, 0)

  const totalRevenue = paymentsRevenue > 0 ? paymentsRevenue : bookingsRevenue

  // Summary cards matching design reference
  const stats: AnalyticsStat[] = [
    {
      label: "TOTAL USERS",
      value: String(totalUsers),
      tone: "default",
    },
    {
      label: "TOTAL EQUIPMENT",
      value: String(totalEquipment),
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
      label: "COMPLETED",
      value: String(completedRentals),
      tone: "green",
    },
    {
      label: "TOTAL GMV",
      value: formatAnalyticsCurrency(totalRevenue),
      tone: "amber",
    },
  ]

  // Monthly booking series using existing bookings data
  const monthlyBookings = buildMonthlyBookingSeries(
    bookings.map((booking) => {
      const date = (booking.createdAt ||
        booking.bookingDate ||
        booking.paidAt ||
        booking.startDate) as string | undefined

      const value =
        typeof booking.totalAmount === "number"
          ? booking.totalAmount
          : typeof booking.totalPrice === "number"
          ? booking.totalPrice
          : Number.parseFloat(
              String(booking.totalAmount || booking.totalPrice || "")
            ) || 0

      return { date, value }
    })
  )

  return (
    <AnalyticsDashboard
      title="Platform Analytics"
      heading="Platform Analytics"
      stats={stats}
      chartTitle="Platform-Wide Monthly Booking Volume"
      chartDescription="Aggregated Stripe marketplace volume across all owners & categories"
      monthlyBookings={monthlyBookings}
      pendingCount={pendingApprovals}
      pendingHref="/dashboard/admin/equipment"
    />
  )
}
