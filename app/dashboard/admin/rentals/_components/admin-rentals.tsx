"use client"

import { useMemo, useState } from "react"
import { ChevronDown, ClipboardList, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { AdminEmptyState } from "../../_components/admin-states"
import { AdminPageShell } from "../../_components/admin-page-shell"
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "../../_components/badges"
import type { AdminRental } from "../../_lib/types"
import { formatAmount, formatStatus } from "../../_lib/utils"

const headClass =
  "px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase dark:text-white/40"

export function AdminRentals({
  initialRentals,
}: {
  initialRentals: AdminRental[]
}) {
  const rentals = initialRentals
  const [query, setQuery] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [bookingFilter, setBookingFilter] = useState("")

  const paymentOptions = useMemo(
    () =>
      Array.from(new Set(rentals.map((rental) => rental.paymentStatus))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [rentals]
  )

  const bookingOptions = useMemo(
    () =>
      Array.from(new Set(rentals.map((rental) => rental.bookingStatus))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [rentals]
  )

  const filteredRentals = useMemo(() => {
    const search = query.trim().toLowerCase()
    const payment = paymentFilter.trim().toLowerCase()
    const booking = bookingFilter.trim().toLowerCase()

    return rentals.filter((rental) => {
      const matchesSearch =
        !search ||
        [
          rental.customerName,
          rental.customerEmail,
          rental.ownerName,
          rental.equipmentName,
        ].some((value) => value.toLowerCase().includes(search))

      const matchesPayment =
        !payment || rental.paymentStatus.trim().toLowerCase() === payment

      const matchesBooking =
        !booking || rental.bookingStatus.trim().toLowerCase() === booking

      return matchesSearch && matchesPayment && matchesBooking
    })
  }, [rentals, query, paymentFilter, bookingFilter])

  function clearFilters() {
    setQuery("")
    setPaymentFilter("")
    setBookingFilter("")
  }

  return (
    <AdminPageShell title="All Platform Rental Ledger" count={rentals.length}>
      {rentals.length > 0 && (
        <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted dark:text-white/40"
            />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search rentals..."
              aria-label="Search rentals by customer, owner, or equipment"
              className="h-10 bg-slate-50 pl-9 dark:bg-white/5"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <FilterSelect
              value={paymentFilter}
              onChange={setPaymentFilter}
              allLabel="All payments"
              options={paymentOptions}
              ariaLabel="Filter by payment status"
            />

            <FilterSelect
              value={bookingFilter}
              onChange={setBookingFilter}
              allLabel="All bookings"
              options={bookingOptions}
              ariaLabel="Filter by booking status"
            />
          </div>
        </div>
      )}

      {rentals.length === 0 ? (
        <AdminEmptyState
          icon={<ClipboardList aria-hidden className="size-7" />}
          title="No rentals recorded yet"
          description="Completed and pending bookings from across the marketplace will appear here."
        />
      ) : filteredRentals.length === 0 ? (
        <AdminEmptyState
          icon={<Search aria-hidden className="size-7" />}
          title="No rentals match your filters"
          description="Try a different search term or reset the payment and booking filters."
          action={
            <Button
              type="button"
              onClick={clearFilters}
              className="h-10 bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand"
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[1120px] border-collapse text-left">
              <caption className="sr-only">
                Every rental booking recorded on the Equiply platform
              </caption>

              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10">
                  <th className={`${headClass} pl-0`}>Customer</th>
                  <th className={headClass}>Owner</th>
                  <th className={headClass}>Equipment</th>
                  <th className={headClass}>Duration</th>
                  <th className={headClass}>Qty</th>
                  <th className={headClass}>Amount</th>
                  <th className={headClass}>Payment</th>
                  <th className={`${headClass} pr-0`}>Booking Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredRentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                  >
                    <td className="max-w-[190px] py-5 pr-3 pl-0 align-middle">
                      <p className="truncate text-sm font-bold text-brand-navy dark:text-white">
                        {rental.customerName}
                      </p>
                    </td>

                    <td className="max-w-[190px] px-3 py-5 align-middle">
                      <p className="truncate text-sm text-slate-600 dark:text-white/65">
                        {rental.ownerName}
                      </p>
                    </td>

                    <td className="max-w-[280px] px-3 py-5 align-middle">
                      <p className="text-sm leading-snug font-semibold text-brand-navy dark:text-white">
                        {rental.equipmentName}
                      </p>
                    </td>

                    <td className="px-3 py-5 align-middle whitespace-nowrap">
                      <p className="text-sm text-slate-600 dark:text-white/65">
                        {rental.startDate} → {rental.endDate}
                      </p>
                    </td>

                    <td className="px-3 py-5 align-middle">
                      <p className="text-sm text-slate-600 dark:text-white/65">
                        {rental.quantity}
                      </p>
                    </td>

                    <td className="px-3 py-5 align-middle whitespace-nowrap">
                      <p className="text-sm font-bold text-brand-navy dark:text-white">
                        {formatAmount(rental.amount)}
                      </p>
                    </td>

                    <td className="px-3 py-5 align-middle">
                      <PaymentStatusBadge status={rental.paymentStatus} />
                    </td>

                    <td className="py-5 pr-0 pl-3 align-middle">
                      <BookingStatusBadge status={rental.bookingStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 xl:hidden dark:divide-white/5">
            {filteredRentals.map((rental) => (
              <article
                key={rental.id}
                className="space-y-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-brand-navy dark:text-white">
                      {rental.customerName}
                    </h2>
                    <p className="mt-0.5 truncate text-xs text-brand-muted dark:text-white/50">
                      {rental.customerEmail}
                    </p>
                  </div>

                  <BookingStatusBadge status={rental.bookingStatus} />
                </div>

                <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
                  <p className="text-sm leading-snug font-semibold text-brand-navy dark:text-white">
                    {rental.equipmentName}
                  </p>
                  <p className="mt-1 text-xs text-brand-muted dark:text-white/50">
                    Owner: {rental.ownerName}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="col-span-2">
                    <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
                      Rental Duration
                    </dt>
                    <dd className="mt-1 text-sm text-slate-600 dark:text-white/65">
                      {rental.startDate} → {rental.endDate}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
                      Quantity
                    </dt>
                    <dd className="mt-1 text-sm text-slate-600 dark:text-white/65">
                      {rental.quantity}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
                      Amount
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-brand-navy dark:text-white">
                      {formatAmount(rental.amount)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
                      Payment
                    </dt>
                    <dd className="mt-1">
                      <PaymentStatusBadge status={rental.paymentStatus} />
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
                      Booking Status
                    </dt>
                    <dd className="mt-1">
                      <BookingStatusBadge status={rental.bookingStatus} />
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </>
      )}
    </AdminPageShell>
  )
}

type FilterSelectProps = {
  value: string
  onChange: (value: string) => void
  allLabel: string
  options: string[]
  ariaLabel: string
}

function FilterSelect({
  value,
  onChange,
  allLabel,
  options,
  ariaLabel,
}: FilterSelectProps) {
  return (
    <div className="relative min-w-0">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-xs font-semibold text-brand-navy shadow-sm transition outline-none focus-visible:border-brand-amber focus-visible:ring-3 focus-visible:ring-brand-amber/20 sm:w-[150px] dark:border-white/15 dark:bg-white/5 dark:text-white"
      >
        <option value="" className="text-brand-navy">
          {allLabel}
        </option>

        {options.map((option) => (
          <option key={option} value={option} className="text-brand-navy">
            {formatStatus(option)}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-brand-muted dark:text-white/50"
      />
    </div>
  )
}
