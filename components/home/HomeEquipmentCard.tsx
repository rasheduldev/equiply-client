"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Heart, MapPin, PackageOpen } from "lucide-react"
import { toast } from "sonner"

import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"
import { authClient } from "@/lib/auth-client"
import { addToFavorites } from "@/lib/actions/favorites"
import { cn } from "@/lib/utils"

type HomeEquipmentCardProps = {
  equipment: Equipment
  index?: number
}

export function HomeEquipmentCard({ equipment, index = 0 }: HomeEquipmentCardProps) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [imageError, setImageError] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  const detailsUrl = `/all-equipment/${equipment._id}`
  const targetHref = session?.user
    ? detailsUrl
    : `/sign-in?callbackUrl=${encodeURIComponent(detailsUrl)}`

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(detailsUrl)}`)
      return
    }

    try {
      setFavLoading(true)
      await addToFavorites(session.user.id, equipment._id)
      setIsFavorited((prev) => !prev)
      toast.success(
        isFavorited
          ? "Removed from favorites"
          : "Added to favorites!"
      )
    } catch {
      toast.error("Could not update favorites")
    } finally {
      setFavLoading(false)
    }
  }

  const available = (equipment.availableQuantity ?? 0) > 0
  const period = equipment.rentalType ? equipment.rentalType.toLowerCase() : "daily"

  const meta = [equipment.brand, equipment.condition]
    .filter(Boolean)
    .join(" • ")

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_50px_-40px_rgba(13,32,55,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(13,32,55,0.3)] dark:border-white/10 dark:bg-brand-navy-soft"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-white/5">
        <Link
          href={targetHref}
          aria-label={`View ${equipment.name}`}
          className="absolute inset-0 z-0"
        >
          {equipment.imageUrl && !imageError ? (
            <Image
              src={equipment.imageUrl}
              alt={equipment.name}
              fill
              unoptimized
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400 dark:text-white/30">
              <PackageOpen aria-hidden className="size-10" />
            </div>
          )}

          {/* Gradient shadow for text readability */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-black/30"
          />

          {/* Category tag top-left */}
          {equipment.category && (
            <span className="absolute top-3 left-3 max-w-[65%] truncate rounded-md bg-brand-navy/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
              {equipment.category}
            </span>
          )}

          {/* Location bottom-left */}
          <span className="absolute bottom-3 left-3 flex max-w-[55%] items-center gap-1 text-[11px] font-semibold text-white">
            <MapPin aria-hidden className="size-3.5 shrink-0 text-brand-amber" />
            <span className="truncate">
              {equipment.location || "Available Nationwide"}
            </span>
          </span>

          {/* Available quantity bottom-right */}
          <span
            className={cn(
              "absolute right-3 bottom-3 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
              available
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 text-white"
            )}
          >
            {available
              ? `${equipment.availableQuantity} AVAILABLE`
              : "OUT OF STOCK"}
          </span>
        </Link>

        {/* Favorite heart button top-right (positioned above link) */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={favLoading}
          aria-label="Add to favorites"
          className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 dark:bg-brand-navy/90 dark:text-white"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              isFavorited
                ? "fill-rose-500 text-rose-500"
                : "text-slate-600 dark:text-white/70"
            )}
          />
        </button>
      </div>

      {/* Body content */}
      <div className="flex flex-1 flex-col p-5">
        {meta && (
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:text-white/45">
            {meta}
          </p>
        )}

        <h3 className="mt-1 line-clamp-1 text-base font-bold text-brand-navy dark:text-white">
          <Link
            href={targetHref}
            className="transition-colors hover:text-brand-amber"
          >
            {equipment.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-white/60">
          {equipment.description || "Verified industrial rental machinery available for dispatch."}
        </p>

        {/* Footer: Price and View Details Button */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
          <div className="min-w-0">
            <span className="text-xl font-extrabold text-brand-navy dark:text-white">
              ${equipment.rentalPrice}
            </span>
            <span className="ml-1 text-xs font-semibold text-slate-400 dark:text-white/45">
              / {period}
            </span>
          </div>

          <Link
            href={targetHref}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand-amber px-3.5 text-xs font-bold text-brand-navy transition-colors hover:bg-brand-sand"
          >
            View Details
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
