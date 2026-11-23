"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"
import { getFeaturedEquipment } from "@/lib/actions/equipments"
import { Skeleton } from "@/components/ui/skeleton"
import { HomeEquipmentCard } from "./HomeEquipmentCard"

type FeaturedEquipmentProps = {
  initialEquipment?: Equipment[]
}

export function FeaturedEquipment({ initialEquipment }: FeaturedEquipmentProps) {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(
    initialEquipment ?? []
  )
  const [loading, setLoading] = useState(
    !initialEquipment || initialEquipment.length === 0
  )

  useEffect(() => {
    if (initialEquipment && initialEquipment.length > 0) return

    let active = true

    const loadFeatured = async () => {
      try {
        setLoading(true)
        const data = await getFeaturedEquipment()
        if (!active) return

        const raw = Array.isArray(data)
          ? data
          : Array.isArray((data as unknown as { data?: Equipment[] })?.data)
          ? (data as unknown as { data: Equipment[] }).data
          : []

        // Ensure approved items and limit to 6
        const approved = raw
          .filter(
            (item) => !item.status || item.status.toLowerCase() === "approved"
          )
          .slice(0, 6)

        setEquipmentList(approved)
      } catch (err) {
        console.error("Failed to load featured equipment:", err)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadFeatured()

    return () => {
      active = false
    }
  }, [initialEquipment])

  const countLabel = equipmentList.length > 0 ? `(${equipmentList.length})` : ""

  return (
    <section className="bg-slate-50/70 py-16 sm:py-20 dark:bg-[#071322]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber-600 uppercase dark:text-brand-amber">
              INSPECTED & READY FOR DISPATCH
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl dark:text-white">
              Featured Rental Equipment
            </h2>
          </div>

          <Link
            href="/all-equipment"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-brand-navy px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-colors hover:bg-brand-navy/90 dark:bg-white/10 dark:hover:bg-white/15"
          >
            EXPLORE ALL {countLabel}
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </motion.div>

        {/* Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-brand-navy-soft"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-xl" />
                <Skeleton className="mt-4 h-4 w-32" />
                <Skeleton className="mt-2 h-5 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            ))
          ) : equipmentList.length > 0 ? (
            equipmentList.map((item, idx) => (
              <HomeEquipmentCard key={item._id} equipment={item} index={idx} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500 dark:border-white/10 dark:text-white/60">
              No featured equipment available right now.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
