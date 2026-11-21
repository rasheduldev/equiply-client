"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, MapPin, PackageOpen } from "lucide-react"

import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"
import { formatRentalPrice } from "@/app/dashboard/owner/my-equipment/_lib/format"
import { cn } from "@/lib/utils"

type EquipmentCardProps = {
  equipment: Equipment
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const [imageError, setImageError] = useState(false)

  const available = equipment.availableQuantity > 0
  const [price, period] = formatRentalPrice(equipment).split("/")
  const meta = [equipment.brand, equipment.condition]
    .filter(Boolean)
    .join(" • ")

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-45px_rgba(13,32,55,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_65px_-35px_rgba(13,32,55,0.35)] dark:border-white/10 dark:bg-brand-navy-soft">
      <Link
        href={`/all-equipment/${equipment._id}`}
        className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-white/5"
      >
        {equipment.imageUrl && !imageError ? (
          <Image
            src={equipment.imageUrl}
            alt={equipment.name}
            fill
            unoptimized
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-muted dark:text-white/35">
            <PackageOpen aria-hidden className="size-10" />
          </div>
        )}

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/10 to-transparent"
        />

        <span className="absolute top-3 left-3 max-w-[75%] truncate rounded-md bg-brand-navy/90 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
          {equipment.category}
        </span>

        <span
          className={cn(
            "absolute right-3 bottom-3 shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] uppercase",
            available
              ? "bg-emerald-600 text-white"
              : "bg-slate-700/90 text-white"
          )}
        >
          {available
            ? `${equipment.availableQuantity} available`
            : "Unavailable"}
        </span>

        <span className="absolute bottom-3 left-3 flex max-w-[52%] items-center gap-1 text-[11px] font-semibold text-white">
          <MapPin
            aria-hidden
            className="size-3.5 shrink-0 text-brand-amber"
          />
          <span className="truncate">
            {equipment.location || "Location not listed"}
          </span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {meta && (
          <p className="text-[10px] font-bold tracking-[0.12em] text-brand-muted uppercase dark:text-white/45">
            {meta}
          </p>
        )}

        <h3 className="mt-1.5 line-clamp-2 text-base leading-snug font-bold text-brand-navy dark:text-white">
          <Link
            href={`/all-equipment/${equipment._id}`}
            className="transition-colors hover:text-brand-amber"
          >
            {equipment.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-white/60">
          {equipment.description || "No description provided."}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
          <p className="min-w-0">
            <span className="text-2xl font-extrabold tracking-tight text-brand-navy dark:text-white">
              {price}
            </span>
            <span className="ml-1 text-xs font-semibold text-brand-muted dark:text-white/45">
              / {period}
            </span>
          </p>

          <Link
            href={`/all-equipment/${equipment._id}`}
            aria-label={`View details for ${equipment.name}`}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-brand-amber px-3.5 text-[11px] font-bold tracking-[0.08em] text-brand-navy uppercase transition-colors hover:bg-brand-sand"
          >
            View Details
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
