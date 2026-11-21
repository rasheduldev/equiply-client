"use client"

import Image from "next/image"
import { useState } from "react"
import { Check, Heart, ShieldCheck, Star, X } from "lucide-react"
import { toast } from "sonner"

import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"
import { cn } from "@/lib/utils"

type EquipmentBookingSidebarProps = {
  equipment: Equipment
}

export function EquipmentBookingSidebar({
  equipment,
}: EquipmentBookingSidebarProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [quantity, setQuantity] = useState(1)
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

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setIsBookingOpen(false)
      toast.success(
        `Rental request submitted for ${equipment.name}! The owner will confirm shortly.`
      )
    }, 700)
  }

  return (
    <>
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-brand-navy-soft lg:sticky lg:top-28">
        {/* Top Header Row: Stock Status Badge & Equipment ID */}
        <div className="flex items-center justify-between gap-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-bold tracking-wide text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 uppercase">
              <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              IN STOCK ({equipment.availableQuantity} AVAILABLE)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tracking-wide text-slate-600 dark:bg-white/10 dark:text-white/60 uppercase">
              <span className="size-1.5 rounded-full bg-slate-400" />
              OUT OF STOCK
            </span>
          )}

          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-white/40">
            ID: {displayId}
          </span>
        </div>

        {/* Equipment Title */}
        <h1 className="mt-4 text-2xl sm:text-[28px] font-extrabold tracking-tight text-brand-navy dark:text-white leading-[1.2]">
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
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-amber tracking-tight">
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
            onClick={() => setIsBookingOpen(true)}
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
                <Check className="size-4 shrink-0 text-emerald-600 stroke-[3] dark:text-emerald-400" />
              </div>

              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-white/60">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>4.8 Rating • Avg response &lt; 15 mins</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal Dialog */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-white/10 dark:bg-brand-navy">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-brand-navy dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-amber">
              <ShieldCheck className="size-5" />
              <span className="text-xs font-bold tracking-wider uppercase">
                Secure Rental Booking
              </span>
            </div>

            <h3 className="mt-2 text-xl font-bold text-brand-navy dark:text-white">
              Reserve {equipment.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-white/60">
              Rate: ${equipment.rentalPrice} / {equipment.rentalType?.toLowerCase()} • Location: {equipment.location}
            </p>

            <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase dark:text-white/70">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-brand-navy outline-none focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase dark:text-white/70">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-brand-navy outline-none focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase dark:text-white/70">
                  Quantity Required (Max: {equipment.availableQuantity})
                </label>
                <input
                  type="number"
                  min={1}
                  max={equipment.availableQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-brand-navy outline-none focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/25 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 dark:bg-white/5 dark:text-white/70">
                Payment is held in escrow until pickup inspection is confirmed.
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="h-10 rounded-xl px-4 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 rounded-xl bg-brand-amber px-6 text-xs font-bold text-brand-navy shadow-sm transition hover:bg-brand-sand disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Confirm Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
