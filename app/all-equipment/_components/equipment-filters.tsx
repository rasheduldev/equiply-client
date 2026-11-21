"use client"

import { useState } from "react"
import {
  ChevronDown,
  Loader2,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react"

import { rentalTypes } from "@/app/dashboard/owner/add-equipment/_lib/equipment-form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { useDebouncedParam } from "../_hooks/use-debounced-param"
import { useEquipmentParams } from "../_hooks/use-equipment-params"
import {
  availabilityOptions,
  equipmentCategories,
  equipmentFilterKeys,
} from "../_lib/query"
import {
  equipmentSidebarControlClass,
  equipmentSidebarLabelClass,
} from "./control-styles"

type EquipmentFiltersProps = {
  className?: string
}

export function EquipmentFilters({ className }: EquipmentFiltersProps) {
  const { searchParams, update, resetFilters, isPending } = useEquipmentParams()
  const [open, setOpen] = useState(false)
  const [minPrice, setMinPrice] = useDebouncedParam("minPrice", 500)
  const [maxPrice, setMaxPrice] = useDebouncedParam("maxPrice", 500)

  const category = searchParams.get("category") ?? ""
  const rentalType = searchParams.get("rentalType") ?? ""
  const availability = searchParams.get("availability") ?? ""

  const activeCount = equipmentFilterKeys.filter((key) =>
    searchParams.get(key)
  ).length

  const hasPendingDraft =
    minPrice !== (searchParams.get("minPrice") ?? "") ||
    maxPrice !== (searchParams.get("maxPrice") ?? "")

  function handleReset() {
    setMinPrice("")
    setMaxPrice("")
    resetFilters()
  }

  const panel = (
    <div
      aria-busy={isPending}
      className="rounded-2xl border border-white/10 bg-brand-navy p-5 text-white shadow-xl shadow-brand-navy/20"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-[0.14em] text-white uppercase">
          <SlidersHorizontal
            aria-hidden
            className="size-4 text-brand-amber"
          />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-amber text-[10px] font-extrabold text-brand-navy">
              {activeCount}
            </span>
          )}
          {isPending && (
            <Loader2
              aria-hidden
              className="size-3.5 animate-spin text-white/50"
            />
          )}
        </h2>

        <button
          type="button"
          onClick={handleReset}
          disabled={activeCount === 0 && !hasPendingDraft}
          className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.1em] text-brand-amber uppercase transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw aria-hidden className="size-3.5" />
          Reset
        </button>
      </div>

      <div className="space-y-5 pt-5">
        <div>
          <label htmlFor="filter-category" className={equipmentSidebarLabelClass}>
            Equipment category
          </label>

          <div className="relative mt-2">
            <select
              id="filter-category"
              value={category}
              onChange={(event) =>
                update({ category: event.target.value || undefined })
              }
              className={cn(equipmentSidebarControlClass, "appearance-none pr-10")}
            >
              <option value="" className="bg-brand-navy text-white">
                All Categories
              </option>
              {equipmentCategories.map((option) => (
                <option key={option} value={option} className="bg-brand-navy text-white">
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="filter-rental-type" className={equipmentSidebarLabelClass}>
            Rental type
          </label>

          <div className="relative mt-2">
            <select
              id="filter-rental-type"
              value={rentalType}
              onChange={(event) =>
                update({ rentalType: event.target.value || undefined })
              }
              className={cn(equipmentSidebarControlClass, "appearance-none pr-10")}
            >
              <option value="" className="bg-brand-navy text-white">
                All Rental Types
              </option>
              {rentalTypes.map((option) => (
                <option key={option} value={option} className="bg-brand-navy text-white">
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50"
            />
          </div>
        </div>

        <fieldset>
          <legend className={equipmentSidebarLabelClass}>Price range</legend>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="relative">
              <span className="sr-only">Minimum price</span>
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-semibold text-white/40"
              >
                $
              </span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Min"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                className={cn(equipmentSidebarControlClass, "pl-6")}
              />
            </label>

            <label className="relative">
              <span className="sr-only">Maximum price</span>
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-semibold text-white/40"
              >
                $
              </span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Max"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className={cn(equipmentSidebarControlClass, "pl-6")}
              />
            </label>
          </div>

          <p className="mt-2 text-[11px] text-white/40">
            Price per rental period
          </p>
        </fieldset>

        <fieldset>
          <legend className={equipmentSidebarLabelClass}>Availability</legend>

          <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-white/5 p-1 ring-1 ring-white/10">
            {availabilityOptions.map((option) => {
              const selected = availability === option.value

              return (
                <button
                  key={option.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    update({ availability: option.value || undefined })
                  }
                  className={cn(
                    "rounded-md px-1.5 py-2 text-[11px] font-bold transition-colors",
                    selected
                      ? "bg-brand-amber text-brand-navy shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      </div>

      <Button
        type="button"
        onClick={() => setOpen(false)}
        className="mt-5 h-10 w-full bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand lg:hidden"
      >
        Show results
      </Button>
    </div>
  )

  return (
    <div className={cn("lg:sticky lg:top-28 lg:self-start", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="equipment-filter-panel"
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-brand-navy px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:border-brand-amber/60 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal
            aria-hidden
            className="size-4 text-brand-amber"
          />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-amber text-[10px] font-extrabold text-brand-navy">
              {activeCount}
            </span>
          )}
        </span>

        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 text-white/50 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        id="equipment-filter-panel"
        className={cn("mt-3 lg:mt-0", !open && "hidden lg:block")}
      >
        {panel}
      </div>
    </div>
  )
}
