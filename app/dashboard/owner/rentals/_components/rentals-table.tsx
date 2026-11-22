"use client"

import Image from "next/image"
import { useState } from "react"
import { PackageOpen, UserRound } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

import { formatAmount } from "../_lib/rentals-utils"
import type { RentalRow } from "../_lib/types"
import { BookingStatus, PaymentBadge } from "./rental-badges"

type RentalsTableProps = {
  rentals: RentalRow[]
  loading?: boolean
}

const headClassName =
  "px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase dark:text-white/40"

export function RentalsTable({ rentals, loading = false }: RentalsTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <caption className="sr-only">
            Customer rentals for equipment owned by the current owner
          </caption>

          <thead>
            <tr className="border-b border-slate-100 dark:border-white/10">
              <th className={`${headClassName} pl-0`}>Customer</th>
              <th className={headClassName}>Equipment</th>
              <th className={headClassName}>Duration</th>
              <th className={headClassName}>Qty</th>
              <th className={headClassName}>Amount</th>
              <th className={headClassName}>Payment</th>
              <th className={`${headClassName} pr-0`}>Booking Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {loading ? (
              <RentalSkeletonRows />
            ) : (
              rentals.map((rental) => (
                <tr
                  key={rental.id}
                  className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                >
                  <td className="max-w-[280px] py-5 pr-3 pl-0 align-middle">
                    <CustomerCell rental={rental} />
                  </td>

                  <td className="max-w-[320px] px-3 py-5 align-middle">
                    <EquipmentCell rental={rental} />
                  </td>

                  <td className="px-3 py-5 align-middle whitespace-nowrap">
                    <span className="text-sm text-slate-600 dark:text-white/70">
                      {rental.startDate} → {rental.endDate}
                    </span>
                  </td>

                  <td className="px-3 py-5 align-middle">
                    <span className="text-sm text-slate-600 dark:text-white/70">
                      {rental.quantity}
                    </span>
                  </td>

                  <td className="px-3 py-5 align-middle whitespace-nowrap">
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatAmount(rental.amount)}
                    </span>
                  </td>

                  <td className="px-3 py-5 align-middle">
                    <PaymentBadge status={rental.paymentStatus} />
                  </td>

                  <td className="py-5 pr-0 pl-3 align-middle">
                    <BookingStatus status={rental.bookingStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 xl:hidden dark:divide-white/5">
        {loading ? (
          <RentalSkeletonCards />
        ) : (
          rentals.map((rental) => (
            <RentalCard key={rental.id} rental={rental} />
          ))
        )}
      </div>
    </>
  )
}

function RentalCard({ rental }: { rental: RentalRow }) {
  return (
    <article className="space-y-4 py-5 first:pt-0 last:pb-0">
      <CustomerCell rental={rental} />

      <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
        <EquipmentImage rental={rental} />
        <p className="min-w-0 text-sm leading-snug font-semibold text-brand-navy dark:text-white">
          {rental.equipmentName}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="col-span-2">
          <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
            Rental Duration
          </dt>
          <dd className="mt-1 text-sm text-slate-600 dark:text-white/70">
            {rental.startDate} → {rental.endDate}
          </dd>
        </div>

        <div>
          <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
            Quantity
          </dt>
          <dd className="mt-1 text-sm text-slate-600 dark:text-white/70">
            {rental.quantity}
          </dd>
        </div>

        <div>
          <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
            Amount
          </dt>
          <dd className="mt-1 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatAmount(rental.amount)}
          </dd>
        </div>

        <div>
          <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
            Payment
          </dt>
          <dd className="mt-1">
            <PaymentBadge status={rental.paymentStatus} />
          </dd>
        </div>

        <div>
          <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
            Booking Status
          </dt>
          <dd className="mt-1">
            <BookingStatus status={rental.bookingStatus} />
          </dd>
        </div>
      </dl>
    </article>
  )
}

function CustomerCell({ rental }: { rental: RentalRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <CustomerAvatar rental={rental} />

      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-brand-navy dark:text-white">
          {rental.customerName}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-white/50">
          {rental.customerEmail}
        </p>
      </div>
    </div>
  )
}

function EquipmentCell({ rental }: { rental: RentalRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <EquipmentImage rental={rental} />
      <p className="line-clamp-2 text-sm leading-snug font-semibold text-brand-navy dark:text-white">
        {rental.equipmentName}
      </p>
    </div>
  )
}

function CustomerAvatar({ rental }: { rental: RentalRow }) {
  const [imageError, setImageError] = useState(false)
  const initials = getInitials(rental.customerName)

  if (!rental.customerImage || imageError) {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-amber-soft text-xs font-bold text-brand-amber-deep dark:bg-brand-amber/10 dark:text-brand-amber">
        {initials || <UserRound aria-hidden className="size-4" />}
      </span>
    )
  }

  return (
    <Image
      src={rental.customerImage}
      alt={`${rental.customerName} profile photo`}
      width={40}
      height={40}
      unoptimized
      className="size-10 shrink-0 rounded-full object-cover"
      onError={() => setImageError(true)}
    />
  )
}

function EquipmentImage({ rental }: { rental: RentalRow }) {
  const [imageError, setImageError] = useState(false)

  if (!rental.equipmentImage || imageError) {
    return (
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-white/10 dark:text-white/40">
        <PackageOpen aria-hidden className="size-5" />
      </span>
    )
  }

  return (
    <Image
      src={rental.equipmentImage}
      alt={rental.equipmentName}
      width={48}
      height={48}
      unoptimized
      className="size-12 shrink-0 rounded-lg object-cover"
      onError={() => setImageError(true)}
    />
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function RentalSkeletonRows() {
  return (
    <>
      {[1, 2, 3].map((row) => (
        <tr key={row}>
          <td className="py-5 pr-3 pl-0">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          </td>
          <td className="px-3 py-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <Skeleton className="h-4 w-44" />
            </div>
          </td>
          <td className="px-3 py-5">
            <Skeleton className="h-4 w-36" />
          </td>
          <td className="px-3 py-5">
            <Skeleton className="h-4 w-6" />
          </td>
          <td className="px-3 py-5">
            <Skeleton className="h-4 w-20" />
          </td>
          <td className="px-3 py-5">
            <Skeleton className="h-6 w-14 rounded-md" />
          </td>
          <td className="py-5 pr-0 pl-3">
            <Skeleton className="h-8 w-28 rounded-md" />
          </td>
        </tr>
      ))}
    </>
  )
}

function RentalSkeletonCards() {
  return (
    <>
      {[1, 2, 3].map((card) => (
        <div key={card} className="space-y-4 py-5 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <Skeleton className="h-4 w-48 max-w-full" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="col-span-2 h-8 w-56 max-w-full" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-14 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      ))}
    </>
  )
}
