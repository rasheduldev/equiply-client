import { Skeleton } from "@/components/ui/skeleton"

import {
  formatAmount,
  formatDate,
  getEquipmentName,
  getPaymentBadge,
  getStatusBadge,
} from "../_lib/booking-utils"
import type { BookingItem } from "../_lib/types"
import { BookingBadge } from "./booking-badge"

type RentalBookingsTableProps = {
  bookings: BookingItem[]
  loading?: boolean
}

export function RentalBookingsTable({
  bookings,
  loading = false,
}: RentalBookingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/10">
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              EQUIPMENT NAME
            </th>
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              START DATE
            </th>
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              END DATE
            </th>
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              BOOKING DATE
            </th>
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              TOTAL AMOUNT
            </th>
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              PAYMENT
            </th>
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              BOOKING STATUS
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {loading ? (
            <BookingSkeletonRows />
          ) : (
            bookings.map((booking, index) => (
              <BookingRow
                key={booking._id || booking.id || `booking-${index}`}
                booking={booking}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function BookingRow({ booking }: { booking: BookingItem }) {
  const equipmentName = getEquipmentName(booking)
  const startDate = formatDate(booking.startDate)
  const endDate = formatDate(booking.endDate)
  const bookingDate = formatDate(booking.bookingDate || booking.createdAt)
  const total = formatAmount(booking.totalAmount ?? booking.totalPrice)
  const paymentBadge = getPaymentBadge(booking.paymentStatus || booking.payment)
  const statusBadge = getStatusBadge(booking.status || booking.bookingStatus)

  return (
    <tr className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
      {/* EQUIPMENT NAME */}
      <td className="py-5 pr-4 align-middle">
        <span className="text-sm font-bold text-brand-navy dark:text-white">
          {equipmentName}
        </span>
      </td>

      {/* START DATE */}
      <td className="px-4 py-5 align-middle">
        <span className="text-sm text-slate-600 dark:text-white/70">
          {startDate}
        </span>
      </td>

      {/* END DATE */}
      <td className="px-4 py-5 align-middle">
        <span className="text-sm text-slate-600 dark:text-white/70">
          {endDate}
        </span>
      </td>

      {/* BOOKING DATE */}
      <td className="px-4 py-5 align-middle">
        <span className="text-sm text-slate-600 dark:text-white/70">
          {bookingDate}
        </span>
      </td>

      {/* TOTAL AMOUNT */}
      <td className="px-4 py-5 align-middle">
        <span className="text-sm font-extrabold text-brand-navy dark:text-white">
          {total}
        </span>
      </td>

      {/* PAYMENT */}
      <td className="px-4 py-5 align-middle">
        <BookingBadge badge={paymentBadge} />
      </td>

      {/* BOOKING STATUS */}
      <td className="py-5 pl-4 align-middle">
        <BookingBadge badge={statusBadge} />
      </td>
    </tr>
  )
}

function BookingSkeletonRows() {
  return (
    <>
      {[1, 2, 3].map((row) => (
        <tr key={row}>
          <td className="py-5 pr-4">
            <Skeleton className="h-5 w-56 max-w-full" />
          </td>
          <td className="px-4 py-5">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-5">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-5">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-5">
            <Skeleton className="h-5 w-20" />
          </td>
          <td className="px-4 py-5">
            <Skeleton className="h-6 w-14 rounded-md" />
          </td>
          <td className="py-5 pl-4">
            <Skeleton className="h-6 w-20 rounded-md" />
          </td>
        </tr>
      ))}
    </>
  )
}
