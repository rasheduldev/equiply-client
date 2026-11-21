"use client"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { ArrowRight, Check, Heart, PackageOpen, Star, X } from "lucide-react"
import { toast } from "sonner"

import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type EquipmentBookingSidebarProps = {
  equipment: Equipment
}

export function EquipmentBookingSidebar({
  equipment,
}: EquipmentBookingSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = authClient.useSession()

  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

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

  // Booking Form State
  const [startDate, setStartDate] = useState(defaultDates.start)
  const [endDate, setEndDate] = useState(defaultDates.end)
  const [quantity, setQuantity] = useState(1)
  const [contactNumber, setContactNumber] = useState("+1 (512) 490-8821")
  const [deliveryAddress, setDeliveryAddress] = useState(
    "742 Industrial Pkwy, Austin, TX 78701"
  )
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const isAvailable = equipment.availableQuantity > 0

  const displayId = equipment._id
    ? `EQ-${equipment._id.slice(-4).toUpperCase()}`
    : "EQ-100"

  const ownerInitials = (equipment.ownerName || "A")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase()

  // Dynamic Rental Calculation
  const calculation = useMemo(() => {
    const price = equipment.rentalPrice || 0
    const qty = Math.max(1, Math.min(quantity || 1, equipment.availableQuantity || 1))
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

  // Authentication check before opening booking modal
  const handleBookNowClick = () => {
    if (!session?.user) {
      // Preserve current URL and redirect to login
      const targetUrl = pathname || `/all-equipment/${equipment._id}`
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(targetUrl)}`)
      return
    }

    setIsBookingOpen(true)
  }

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => {
      const next = !prev
      if (next) {
        toast.success(`Added ${equipment.name} to your favorites!`)
      } else {
        toast.info(`Removed ${equipment.name} from your favorites.`)
      }
      return next
    })
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate) {
      toast.error("Please select a rental start date.")
      return
    }

    if (!endDate) {
      toast.error("Please select a rental end date.")
      return
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error("Rental end date cannot be earlier than start date.")
      return
    }

    if (quantity < 1 || quantity > equipment.availableQuantity) {
      toast.error(`Quantity must be between 1 and ${equipment.availableQuantity}.`)
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

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setIsBookingOpen(false)
      toast.success(
        `Reservation confirmed! Total: $${calculation.total.toFixed(2)}. Proceeding to checkout...`
      )
    }, 800)
  }

  return (
    <>
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-brand-navy-soft lg:sticky lg:top-28">
        {/* Top Header Row: Stock Status Badge & Equipment ID */}
        <div className="flex items-center justify-between gap-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-bold tracking-wide text-emerald-800 uppercase dark:bg-emerald-500/20 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              IN STOCK ({equipment.availableQuantity} AVAILABLE)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tracking-wide text-slate-600 uppercase dark:bg-white/10 dark:text-white/60">
              <span className="size-1.5 rounded-full bg-slate-400" />
              OUT OF STOCK
            </span>
          )}

          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-white/40">
            ID: {displayId}
          </span>
        </div>

        {/* Equipment Title */}
        <h1 className="mt-4 text-2xl font-extrabold leading-[1.2] tracking-tight text-brand-navy sm:text-[28px] dark:text-white">
          {equipment.name}
        </h1>

        {/* Standard Rental Rate Box (Navy) */}
        <div className="mt-6 rounded-2xl bg-brand-navy p-5 text-white shadow-md dark:bg-brand-navy">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold tracking-[0.14em] text-white/60 uppercase">
              STANDARD RENTAL RATE
            </span>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
              Stripe Escrowed
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-brand-amber sm:text-4xl">
              ${equipment.rentalPrice}
            </span>
            <span className="text-sm font-semibold text-white/70">
              / {equipment.rentalType?.toLowerCase() || "daily"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {/* Primary Action Button */}
          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleBookNowClick}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-amber text-sm font-bold tracking-wide text-brand-navy shadow-sm transition-all hover:bg-brand-sand active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Book Equipment Now →
          </button>

          {/* Secondary Action Button: Add to Favorites */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition-all hover:bg-slate-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                isFavorite
                  ? "fill-brand-amber text-brand-amber"
                  : "text-slate-600 dark:text-white/70"
              )}
            />
            <span>{isFavorite ? "Saved to Favorites" : "Add to Favorites"}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-slate-100 dark:border-white/10" />

        {/* Verified Fleet Owner Section */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase dark:text-white/40">
            VERIFIED FLEET OWNER
          </p>

          <div className="mt-3 flex items-center gap-3">
            {/* Owner Avatar */}
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-navy font-bold text-white ring-2 ring-slate-100 dark:ring-white/10">
              {equipment.ownerImage ? (
                <Image
                  src={equipment.ownerImage}
                  alt={equipment.ownerName || "Owner"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span>{ownerInitials}</span>
              )}
            </div>

            {/* Owner Name and Status */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold text-brand-navy dark:text-white">
                  {equipment.ownerName || "Apex Site Rentals LLC"}
                </span>
                <Check className="size-4 shrink-0 stroke-[3] text-emerald-600 dark:text-emerald-400" />
              </div>

              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-white/60">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>4.8 Rating • Avg response &lt; 15 mins</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal Dialog matching Design Image */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm sm:p-6">
          <div className="relative my-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-brand-navy sm:rounded-3xl">
            {/* Modal Header: Deep Navy with Step Eyebrow and Close Button */}
            <div className="flex items-center justify-between bg-brand-navy px-6 py-5 text-white sm:px-7">
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-brand-amber uppercase">
                  STEP 1 OF 2 • RENTAL RESERVATION
                </p>
                <h3 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-[22px]">
                  Book Equipment
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                aria-label="Close modal"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-5 sm:p-7">
              {/* Selected Equipment Card */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-white/10 dark:bg-white/5 sm:p-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-white/10 sm:size-18">
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
                      <PackageOpen className="size-7" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-1 text-sm font-bold text-brand-navy dark:text-white">
                    {equipment.name}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-white/60">
                    {equipment.location || "Location not listed"} • Available Stock:{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {equipment.availableQuantity} units
                    </span>
                  </p>
                  <p className="mt-1 flex items-baseline">
                    <span className="text-sm font-extrabold text-brand-amber">
                      ${equipment.rentalPrice}
                    </span>
                    <span className="ml-1 text-xs text-slate-500 dark:text-white/60">
                      / {equipment.rentalType?.toLowerCase() || "daily"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Booking Form Fields */}
              <form onSubmit={handleBookingSubmit} className="mt-5 space-y-4">
                {/* Row 1: Start Date and End Date */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="booking-start-date"
                      className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
                    >
                      RENTAL START DATE
                    </label>
                    <input
                      id="booking-start-date"
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
                      htmlFor="booking-end-date"
                      className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
                    >
                      RENTAL END DATE
                    </label>
                    <input
                      id="booking-end-date"
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
                      htmlFor="booking-quantity"
                      className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
                    >
                      REQUIRED QUANTITY (MAX {equipment.availableQuantity})
                    </label>
                    <input
                      id="booking-quantity"
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
                      htmlFor="booking-phone"
                      className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
                    >
                      SITE CONTACT NUMBER
                    </label>
                    <input
                      id="booking-phone"
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
                    htmlFor="booking-address"
                    className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
                  >
                    DELIVERY / JOB SITE ADDRESS
                  </label>
                  <input
                    id="booking-address"
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
                    htmlFor="booking-notes"
                    className="block text-[10px] font-bold tracking-[0.12em] text-slate-600 uppercase dark:text-white/70"
                  >
                    ADDITIONAL SITE NOTES (OPTIONAL)
                  </label>
                  <textarea
                    id="booking-notes"
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

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="h-11 cursor-pointer rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-brand-amber px-6 text-sm font-bold text-brand-navy shadow-sm transition hover:bg-brand-sand active:scale-[0.99] disabled:opacity-50"
                  >
                    {submitting ? "Processing..." : "Proceed to Stripe Checkout"}
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
