"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Camera,
  Cpu,
  Hammer,
  Layers,
  Tractor,
  Truck,
} from "lucide-react"

const categoriesData = [
  {
    name: "Construction Equipment",
    description: "Excavators, loaders, compactors & scaffolding",
    units: "2 units",
    icon: Hammer,
  },
  {
    name: "Photography Equipment",
    description: "Cinema cameras, prime lenses, gimbals & lighting",
    units: "1 units",
    icon: Camera,
  },
  {
    name: "Vehicles & Transportation",
    description: "Flatbed trucks, cargo vans, trailers & forklifts",
    units: "1 units",
    icon: Truck,
  },
  {
    name: "Agriculture Equipment",
    description: "Compact tractors, harvesters, tillers & sprayers",
    units: "1 units",
    icon: Tractor,
  },
  {
    name: "Electronics",
    description: "Silent generators, workstations, LiDAR & drones",
    units: "1 units",
    icon: Cpu,
  },
  {
    name: "Event Equipment",
    description: "Line-array PA systems, LED walls, stages & tents",
    units: "1 units",
    icon: Layers,
  },
]

export function Categories() {
  return (
    <section className="bg-white py-16 sm:py-20 dark:bg-brand-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber-600 uppercase dark:text-brand-amber">
              BROWSE BY SECTOR
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl dark:text-white">
              Popular Equipment Categories
            </h2>
          </div>

          <Link
            href="/all-equipment"
            className="inline-flex w-fit items-center gap-1.5 text-xs font-bold text-brand-navy transition-colors hover:text-brand-amber sm:text-sm dark:text-white/80 dark:hover:text-brand-amber"
          >
            View full catalog
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </motion.div>

        {/* Categories Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesData.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                whileHover={{ y: -3 }}
              >
                <Link
                  href={`/all-equipment?category=${encodeURIComponent(category.name)}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-brand-amber/50 hover:shadow-md dark:border-white/10 dark:bg-brand-navy-soft"
                >
                  {/* Icon box */}
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-brand-amber shadow-sm transition-colors group-hover:bg-brand-navy-light dark:bg-white/10 dark:text-brand-amber">
                    <Icon className="size-5" />
                  </div>

                  {/* Text details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-bold text-brand-navy transition-colors group-hover:text-brand-amber sm:text-base dark:text-white">
                        {category.name}
                      </h3>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-white/10 dark:text-white/60">
                        {category.units}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-white/50">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
