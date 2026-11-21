"use client"

import Image from "next/image"
import { useState } from "react"
import { PackageOpen } from "lucide-react"

import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"

type EquipmentHeroImageProps = {
  equipment: Equipment
}

export function EquipmentHeroImage({ equipment }: EquipmentHeroImageProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-white/5">
      {equipment.imageUrl && !imageError ? (
        <Image
          src={equipment.imageUrl}
          alt={equipment.name}
          fill
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-brand-muted dark:text-white/35">
          <PackageOpen aria-hidden className="size-16" />
        </div>
      )}

      {/* Category Overlay Badge on Top Left */}
      {equipment.category && (
        <span className="absolute top-5 left-5 z-10 rounded-md bg-brand-navy/90 px-3.5 py-1.5 text-xs font-black tracking-[0.16em] text-brand-amber uppercase shadow-md backdrop-blur-md">
          {equipment.category}
        </span>
      )}
    </div>
  )
}
