"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, PackageOpen, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { createPendingBooking } from "@/lib/actions/payment"
import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"

type PaymentFormProps = {
  equipment: Equipment
}

export function PaymentForm({ equipment }: PaymentFormProps) {
  const { data: session } = authClient.useSession()
  // Default dates: tomorrow and +3 days
  const defaultDates = useMemo(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(start.getDate() + 1)
    const end = new Date(start)
    end.setDate(end.getDate() + 3)

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
      min: today.toISOString().split("T")[0],
    }
  }, [])

  // Form State
  const [startDate, setStartDate] = useState(defaultDates.start)
  const [endDate, setEndDate] = useState(defaultDates.end)
  const [quantity, setQuantity] = useState(1)
  const [contactNumber, setContactNumber] = useState("+1 (512) 490-8821")
  const [deliveryAddress, setDeliveryAddress] = useState(
    "742 Industrial Pkwy, Austin, TX 78701"
  )
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Dynamic Rental Calculation based on dates, rental type, and quantity
  const calculation = useMemo(() => {
    const price = equipment.rentalPrice || 0
    const qty = Math.max(
      1,
      Math.min(quantity || 1, equipment.availableQuantity || 1)
    )
    const type = equipment.rentalType?.toLowerCase() || "daily"

    let durationUnits = 1
    let unitLabel = "Day"
    let unitPlural = "Days"

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)))

      if (type === "weekly") {
        const weeks = Math.max(1, Math.ceil(diffDays / 7))
        durationUnits = weeks
        unitLabel = "Week"
        unitPlural = "Weeks"
      } else if (type === "monthly") {
        const months = Math.max(1, Math.ceil(diffDays / 30))
        durationUnits = months
        unitLabel = "Month"
        unitPlural = "Months"
      } else {
        durationUnits = diffDays
        unitLabel = "Day"
        unitPlural = "Days"
      }
    } else {
      if (type === "weekly") {
        unitLabel = "Week"
        unitPlural = "Weeks"
      } else if (type === "monthly") {
        unitLabel = "Month"
        unitPlural = "Months"
      }
    }

    const durationText = `${durationUnits} ${durationUnits === 1 ? unitLabel : unitPlural}`
    const quantityText = `${qty} ${qty === 1 ? "unit" : "units"}`

    const baseRate = price * durationUnits * qty
    const fee = Math.round(baseRate * 0.075 * 100) / 100
    const total = baseRate + fee

    const baseRateFormula = `Base Rate ($${price} × ${durationText} × ${quantityText})`

    return {
      durationUnits,
      durationText,
      quantityText,
      baseRateFormula,
      baseRate,
      fee,
      total,
    }
  }, [
    equipment.rentalPrice,
    equipment.rentalType,
    equipment.availableQuantity,
    startDate,
    endDate,
    quantity,
  ])

  

const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!startDate) {
        toast.error("Please select a rental start date.")
        return
    }

    if (!endDate) {
        toast.error("Please select a rental end date.")
        return
    }

    if (new Date(endDate) <= new Date(startDate)) {
        toast.error("Rental end date must be after the start date.")
        return
    }

    if (quantity < 1 || quantity > equipment.availableQuantity) {
        toast.error(
            `Quantity must be between 1 and ${equipment.availableQuantity}.`
        )
        return
    }

    if (!contactNumber.trim()) {
        toast.error("Please enter a site contact number.")
        return
    }

    if (!deliveryAddress.trim()) {
        toast.error("Please enter a delivery or job site address.")
        return
    }

    if (!session?.user) {
        toast.error("Please log in before booking equipment.")
        return
    }

    try {
        setSubmitting(true)

        // 1. Save pending booking in MongoDB
        const result = await createPendingBooking({
            equipmentId: equipment._id,
            equipmentName: equipment.name,
            userId: session.user.id,
            userEmail: session.user.email,
            startDate,
            endDate,
            quantity,
            contactNumber,
            deliveryAddress,
            notes,
            rentalType: equipment.rentalType || "Daily",
            baseRate: calculation.baseRate,
            escrowFee: calculation.fee,
            totalAmount: calculation.total,
        })

        if (!result.success || !result.bookingId) {
            throw new Error("Booking could not be saved.")
        }

        // 2. Create Stripe Checkout Session
        const response = await fetch("/api/checkout_sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bookingId: result.bookingId,
                totalAmount: calculation.total,
            }),
        })

        const checkoutData = await response.json()

        if (!response.ok || !checkoutData.success || !checkoutData.url) {
            throw new Error(
                checkoutData.error || "Failed to create Stripe Checkout Session."
            )
        }

        // 3. Redirect customer to Stripe Checkout
        window.location.href = checkoutData.url

    } catch (error) {
        console.error("Booking submission error:", error)

        toast.error(
            error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."
        )

        setSubmitting(false)
    }
}



  return (
    <div className="mx-auto w-full max-w-[620px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl dark:border-white/10 dark:bg-brand-navy sm:rounded-3xl">
      {/* Header Bar: Deep Navy with Step Eyebrow */}
      <div className="flex items-center justify-between bg-brand-navy px-6 py-5 text-white sm:px-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] text-brand-amber uppercase">
            STEP 1 OF 2 • RENTAL RESERVATION
          </p>
          <h1 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Book Equipment
          </h1>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="size-4" />
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Body Container */}
      <div className="p-6 sm:p-8">
        {/* Selected Equipment Summary Card */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-white/10 dark:bg-white/5 sm:p-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-white/10 sm:size-20">
            {equipment.imageUrl ? (
              <Image
                src={equipment.imageUrl}
                alt={equipment.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-slate-400">
                <PackageOpen className="size-8" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-1 text-sm font-bold text-brand-navy dark:text-white sm:text-base">
              {equipment.name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-white/60">
              {equipment.location || "Location not listed"} • Available Stock:{" "}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {equipment.availableQuantity} units
              </span>
            </p>
            <p className="mt-1 flex items-baseline">
              <span className="text-sm font-extrabold text-brand-amber sm:text-base">
                ${equipment.rentalPrice}
              </span>
              <span className="ml-1 text-xs text-slate-500 dark:text-white/60">
                / {equipment.rentalType?.toLowerCase() || "daily"}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Form connected to Stripe Checkout Session API */}
        <form
          action="/api/checkout_sessions"
          method="POST"
          onSubmit={handleBookingSubmit}
          className="mt-6 space-y-4"
        >
          {/* Hidden Booking Information Sent with Checkout Request */}
          <input type="hidden" name="equipmentId" value={equipment._id} />
          <input type="hidden" name="equipmentName" value={equipment.name} />
          <input
            type="hidden"
            name="totalAmount"
            value={calculation.total.toFixed(2)}
          />
          <input
            type="hidden"
            name="baseRate"
            value={calculation.baseRate.toFixed(2)}
          />
          <input
            type="hidden"
            name="escrowFee"
            value={calculation.fee.toFixed(2)}
          />
          <input
            type="hidden"
            name="rentalType"
            value={equipment.rentalType || "Daily"}
          />

          {/* Row 1: Start Date and End Date */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="payment-start-date"
                className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
              >
                RENTAL START DATE
              </label>
              <input
                id="payment-start-date"
                name="startDate"
                type="date"
                required
                min={defaultDates.min}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-brand-navy outline-none transition focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="payment-end-date"
                className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
              >
                RENTAL END DATE
              </label>
              <input
                id="payment-end-date"
                name="endDate"
                type="date"
                required
                min={startDate || defaultDates.min}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-brand-navy outline-none transition focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          {/* Row 2: Required Quantity and Site Contact Number */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="payment-quantity"
                className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
              >
                REQUIRED QUANTITY (MAX {equipment.availableQuantity})
              </label>
              <input
                id="payment-quantity"
                name="quantity"
                type="number"
                required
                min={1}
                max={equipment.availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-brand-navy outline-none transition focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="payment-phone"
                className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
              >
                SITE CONTACT NUMBER
              </label>
              <input
                id="payment-phone"
                name="contactNumber"
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+1 (512) 490-8821"
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35"
              />
            </div>
          </div>

          {/* Row 3: Delivery / Job Site Address */}
          <div>
            <label
              htmlFor="payment-address"
              className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
            >
              DELIVERY / JOB SITE ADDRESS
            </label>
            <input
              id="payment-address"
              name="deliveryAddress"
              type="text"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="742 Industrial Pkwy, Austin, TX 78701"
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35"
            />
          </div>

          {/* Row 4: Additional Site Notes (Optional) */}
          <div>
            <label
              htmlFor="payment-notes"
              className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
            >
              ADDITIONAL SITE NOTES (OPTIONAL)
            </label>
            <textarea
              id="payment-notes"
              name="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery window preferences, attachment requests, or site access notes..."
              className="mt-1.5 h-20 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35"
            />
          </div>

          {/* Rental Price Calculation Box */}
          <div className="rounded-2xl border border-amber-300/80 bg-amber-50/50 p-4 dark:border-amber-400/20 dark:bg-amber-400/5 sm:p-5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-700 dark:text-white/80">
                {calculation.baseRateFormula}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ${calculation.baseRate.toFixed(2)}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-700 dark:text-white/80">
                Equiply Damage Waiver &amp; Escrow Protection (7.5%)
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ${calculation.fee.toFixed(2)}
              </span>
            </div>

            <div className="my-3 border-t border-amber-200/80 dark:border-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                Total Payable Amount
              </span>
              <span className="text-xl font-extrabold text-brand-navy sm:text-2xl dark:text-white">
                ${calculation.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <Link
              href={`/all-equipment/${equipment._id}`}
              className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-brand-amber px-6 text-sm font-bold text-brand-navy shadow-sm transition hover:bg-brand-sand active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? "Redirecting to Stripe..." : "Proceed to Stripe Checkout"}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
