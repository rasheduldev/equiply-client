"use client"

import { ChevronDown, Loader2, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { useDebouncedParam } from "../_hooks/use-debounced-param"
import { useEquipmentParams } from "../_hooks/use-equipment-params"
import {
  defaultEquipmentSort,
  equipmentSortOptions,
  isEquipmentSort,
} from "../_lib/query"
import { equipmentControlClass, equipmentLabelClass } from "./control-styles"

export function EquipmentToolbar() {
  const { searchParams, update, isPending } = useEquipmentParams()
  const [search, setSearch] = useDebouncedParam("search", 350)

  const sortParam = searchParams.get("sort")
  const sort = isEquipmentSort(sortParam) ? sortParam : defaultEquipmentSort

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_18px_45px_-38px_rgba(13,32,55,0.5)] sm:p-5 dark:border-white/10 dark:bg-brand-navy-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <form
          role="search"
          className="min-w-0 flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            update({ search: search.trim() })
          }}
        >
          <label htmlFor="equipment-search" className={equipmentLabelClass}>
            Search name, location, or category
          </label>

          <div className="relative mt-2">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted dark:text-white/40"
            />

            <input
              id="equipment-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="e.g. Excavator, Austin, Cinema..."
              className={cn(
                equipmentControlClass,
                "pr-10 pl-9 [&::-webkit-search-cancel-button]:appearance-none"
              )}
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("")
                  update({ search: undefined })
                }}
                className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-brand-muted transition-colors hover:bg-slate-100 hover:text-brand-navy dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>
        </form>

        <div className="w-full sm:w-56 sm:shrink-0">
          <label htmlFor="equipment-sort" className={equipmentLabelClass}>
            Sort results
          </label>

          <div className="relative mt-2">
            <select
              id="equipment-sort"
              value={sort}
              onChange={(event) =>
                update({
                  sort:
                    event.target.value === defaultEquipmentSort
                      ? undefined
                      : event.target.value,
                })
              }
              className={cn(equipmentControlClass, "appearance-none pr-10")}
            >
              {equipmentSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-brand-muted dark:text-white/50"
            />
          </div>
        </div>
      </div>

      {isPending && (
        <p
          role="status"
          className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-brand-muted dark:text-white/50"
        >
          <Loader2 aria-hidden className="size-3.5 animate-spin" />
          Updating results...
        </p>
      )}
    </div>
  )
}
