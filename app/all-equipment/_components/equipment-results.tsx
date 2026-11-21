import Link from "next/link"
import { SearchX } from "lucide-react"

import { getEquipments } from "@/lib/api/equipments"

import { EquipmentCard } from "./equipment-card"

type EquipmentResultsProps = {
  query: string
}

export async function EquipmentResults({ query }: EquipmentResultsProps) {
  const equipments = await getEquipments(query)

  if (equipments.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-[0_18px_45px_-38px_rgba(13,32,55,0.5)] dark:border-white/10 dark:bg-brand-navy-soft">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-amber-soft text-brand-amber-deep dark:bg-brand-amber/10 dark:text-brand-amber">
          <SearchX aria-hidden className="size-7" />
        </span>

        <h2 className="mt-4 text-lg font-bold text-brand-navy dark:text-white">
          No equipment found
        </h2>

        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-brand-muted dark:text-white/50">
          Try a different search term, widen your price range, or clear the
          filters to see all available equipment.
        </p>

        <Link
          href="/all-equipment"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-brand-amber px-5 text-xs font-bold tracking-[0.1em] text-brand-navy uppercase transition-colors hover:bg-brand-sand"
        >
          Clear all filters
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-bold tracking-[0.12em] text-brand-muted uppercase dark:text-white/45">
          Showing {equipments.length}{" "}
          {equipments.length === 1 ? "listing" : "listings"}
        </p>

        <p className="text-[11px] font-semibold text-brand-muted dark:text-white/40">
          Verified by Equiply
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {equipments.map((equipment) => (
          <EquipmentCard key={equipment._id} equipment={equipment} />
        ))}
      </div>
    </div>
  )
}
