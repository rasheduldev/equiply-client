"use client"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Check, Heart, Star } from "lucide-react"
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

  // Authentication check before navigating to payment page
  const handleBookNowClick = () => {
    if (!session?.user) {
      // Preserve current Equipment Details page URL and redirect to login
      const targetUrl = pathname || `/all-equipment/${equipment._id}`
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(targetUrl)}`)
      return
    }

    // When logged in, navigate to dedicated payment page
    router.push(`/payment?equipmentId=${equipment._id}`)
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

  return (
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
  )
}
