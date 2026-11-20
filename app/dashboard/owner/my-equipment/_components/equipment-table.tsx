"use client"

import { formatRentalPrice } from "../_lib/format"
import type { Equipment } from "../_lib/types"
import { EquipmentActions } from "./equipment-actions"
import { StatusBadge } from "./status-badge"

type EquipmentTableProps = {
  equipments: Equipment[]
  onView: (equipment: Equipment) => void
  onEdit: (equipment: Equipment) => void
  onDelete: (equipment: Equipment) => void
}

export function EquipmentTable({
  equipments,
  onView,
  onEdit,
  onDelete,
}: EquipmentTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-white/10">
              <th className="px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-brand-muted uppercase dark:text-white/45">
                Equipment Name
              </th>
              <th className="px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-brand-muted uppercase dark:text-white/45">
                Category
              </th>
              <th className="px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-brand-muted uppercase dark:text-white/45">
                Rental Price
              </th>
              <th className="px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-brand-muted uppercase dark:text-white/45">
                Available Qty
              </th>
              <th className="px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-brand-muted uppercase dark:text-white/45">
                Status
              </th>
              <th className="px-3 py-4 text-right text-[11px] font-bold tracking-[0.14em] text-brand-muted uppercase dark:text-white/45">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {equipments.map((equipment) => (
              <tr
                key={equipment._id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-white/5 dark:hover:bg-white/[0.03]"
              >
                <td className="max-w-[340px] px-3 py-5 align-middle">
                  <p className="text-sm font-bold text-brand-navy dark:text-white">
                    {equipment.name}
                  </p>
                </td>

                <td className="px-3 py-5 align-middle">
                  <p className="text-sm text-slate-600 dark:text-white/60">
                    {equipment.category}
                  </p>
                </td>

                <td className="px-3 py-5 align-middle whitespace-nowrap">
                  <p className="text-sm font-bold text-brand-navy dark:text-white">
                    {formatRentalPrice(equipment)}
                  </p>
                </td>

                <td className="px-3 py-5 align-middle">
                  <p className="text-sm text-slate-600 dark:text-white/60">
                    {equipment.availableQuantity}
                  </p>
                </td>

                <td className="px-3 py-5 align-middle">
                  <StatusBadge status={equipment.status} />
                </td>

                <td className="px-3 py-5 align-middle">
                  <EquipmentActions
                    className="justify-end"
                    onView={() => onView(equipment)}
                    onEdit={() => onEdit(equipment)}
                    onDelete={() => onDelete(equipment)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 lg:hidden dark:divide-white/5">
        {equipments.map((equipment) => (
          <article key={equipment._id} className="py-5 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-brand-navy dark:text-white">
                  {equipment.name}
                </h3>
                <p className="mt-1 text-xs text-brand-muted dark:text-white/50">
                  {equipment.category}
                </p>
              </div>

              <StatusBadge status={equipment.status} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-[10px] font-bold tracking-[0.12em] text-brand-muted uppercase dark:text-white/40">
                  Rental Price
                </dt>
                <dd className="mt-1 text-sm font-bold text-brand-navy dark:text-white">
                  {formatRentalPrice(equipment)}
                </dd>
              </div>

              <div>
                <dt className="text-[10px] font-bold tracking-[0.12em] text-brand-muted uppercase dark:text-white/40">
                  Available Qty
                </dt>
                <dd className="mt-1 text-sm font-semibold text-brand-navy dark:text-white">
                  {equipment.availableQuantity}
                </dd>
              </div>
            </dl>

            <EquipmentActions
              className="mt-4"
              onView={() => onView(equipment)}
              onEdit={() => onEdit(equipment)}
              onDelete={() => onDelete(equipment)}
            />
          </article>
        ))}
      </div>
    </>
  )
}
