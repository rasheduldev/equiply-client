"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Loader2, PackageOpen } from "lucide-react"

import { formatRentalPrice } from "@/app/dashboard/owner/my-equipment/_lib/format"
import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import type { FavoriteItem } from "../_lib/types"

type FavoritesTableProps = {
  favorites: FavoriteItem[]
  loading?: boolean
  removingId: string | null
  onRemove: (favorite: FavoriteItem) => void
}

export function FavoritesTable({
  favorites,
  loading = false,
  removingId,
  onRemove,
}: FavoritesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <caption className="sr-only">Saved favorite equipment</caption>
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/10">
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              EQUIPMENT
            </th>
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              CATEGORY
            </th>
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              RATE
            </th>
            <th className="pb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              LOCATION
            </th>
            <th className="pb-4 pl-4 text-right text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {loading ? (
            <FavoriteSkeletonRows />
          ) : (
            favorites.map((favorite) => (
              <FavoriteRow
                key={favorite._id}
                favorite={favorite}
                removing={removingId === favorite._id}
                removalDisabled={removingId !== null}
                onRemove={onRemove}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

type FavoriteRowProps = {
  favorite: FavoriteItem
  removing: boolean
  removalDisabled: boolean
  onRemove: (favorite: FavoriteItem) => void
}

function FavoriteRow({
  favorite,
  removing,
  removalDisabled,
  onRemove,
}: FavoriteRowProps) {
  const equipment = favorite.equipment ?? null
  const equipmentName = equipment?.name ?? "Equipment no longer available"
  const available = Boolean(equipment && equipment.availableQuantity > 0)

  return (
    <tr className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
      <td className="py-5 pr-4 align-middle">
        <div className="flex items-center gap-4">
          <FavoriteEquipmentImage equipment={equipment} />

          <div className="min-w-0">
            <p className="text-sm leading-snug font-bold text-brand-navy dark:text-white">
              {equipmentName}
            </p>
            <AvailabilityBadge
              available={available}
              quantity={equipment?.availableQuantity}
            />
          </div>
        </div>
      </td>

      <td className="px-4 py-5 align-middle">
        <span className="text-sm text-slate-600 dark:text-white/70">
          {equipment?.category || "-"}
        </span>
      </td>

      <td className="px-4 py-5 align-middle whitespace-nowrap">
        <span className="text-sm font-extrabold text-brand-navy dark:text-white">
          {equipment ? formatRentalPrice(equipment) : "-"}
        </span>
      </td>

      <td className="px-4 py-5 align-middle">
        <span className="text-sm text-slate-600 dark:text-white/70">
          {equipment?.location || "Location not listed"}
        </span>
      </td>

      <td className="py-5 pl-4 align-middle">
        <div className="flex flex-nowrap items-center justify-end gap-2">
          {equipment && (
            <Button
              nativeButton={false}
              render={<Link href={`/all-equipment/${equipment._id}`} />}
              variant="ghost"
              aria-label={`View details for ${equipment.name}`}
              className="h-9 rounded-md bg-brand-navy px-4 text-xs font-bold text-white hover:bg-brand-navy/90 dark:bg-brand-navy dark:text-white"
            >
              View Details
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            onClick={() => onRemove(favorite)}
            disabled={removalDisabled}
            className="h-9 rounded-md bg-rose-100 px-4 text-xs font-bold text-rose-600 hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
          >
            {removing && (
              <Loader2 aria-hidden className="size-3.5 animate-spin" />
            )}
            {removing ? "Removing..." : "Remove"}
          </Button>
        </div>
      </td>
    </tr>
  )
}

function FavoriteEquipmentImage({
  equipment,
}: {
  equipment: Equipment | null
}) {
  const [imageError, setImageError] = useState(false)

  if (!equipment?.imageUrl || imageError) {
    return (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/40">
        <PackageOpen aria-hidden className="size-6" />
      </div>
    )
  }

  return (
    <Image
      src={equipment.imageUrl}
      alt={equipment.name}
      width={56}
      height={56}
      unoptimized
      className="size-14 shrink-0 rounded-lg object-cover"
      onError={() => setImageError(true)}
    />
  )
}

function AvailabilityBadge({
  available,
  quantity,
}: {
  available: boolean
  quantity?: number
}) {
  return (
    <span
      className={cn(
        "mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        available
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white/50"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          available ? "bg-emerald-500" : "bg-slate-400"
        )}
      />
      {available ? `${quantity ?? 0} available` : "Unavailable"}
    </span>
  )
}

function FavoriteSkeletonRows() {
  return (
    <>
      {[1, 2, 3].map((row) => (
        <tr key={row}>
          <td className="py-5 pr-4">
            <div className="flex items-center gap-4">
              <Skeleton className="size-14 shrink-0 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-52 max-w-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
            </div>
          </td>
          <td className="px-4 py-5">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="px-4 py-5">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-5">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="py-5 pl-4">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}
