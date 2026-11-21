import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types"

type EquipmentOverviewProps = {
  equipment: Equipment
}

export function EquipmentOverview({ equipment }: EquipmentOverviewProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-brand-navy-soft">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-navy dark:text-white">
        Equipment Overview
      </h2>

      {/* Description */}
      <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-white/70">
        {equipment.description || "No overview description provided."}
      </p>

      {/* 4-Column Specs Row */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4 sm:gap-6 dark:border-white/10">
        {/* BRAND */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase dark:text-white/40">
            BRAND
          </p>
          <p className="mt-1 text-sm font-bold text-brand-navy dark:text-white">
            {equipment.brand || "—"}
          </p>
        </div>

        {/* MODEL */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase dark:text-white/40">
            MODEL
          </p>
          <p className="mt-1 text-sm font-bold text-brand-navy dark:text-white">
            {equipment.model || "—"}
          </p>
        </div>

        {/* CONDITION */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase dark:text-white/40">
            CONDITION
          </p>
          <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {equipment.condition || "—"}
          </p>
        </div>

        {/* HUB LOCATION */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase dark:text-white/40">
            HUB LOCATION
          </p>
          <p className="mt-1 text-sm font-bold text-brand-navy dark:text-white">
            {equipment.location || "—"}
          </p>
        </div>
      </div>

      {/* Rental Terms & Operator Requirements Sub-box */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/5">
        <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500 uppercase dark:text-white/50">
          RENTAL TERMS &amp; OPERATOR REQUIREMENTS
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 whitespace-pre-line dark:text-white/70">
          {equipment.rentalTerms ||
            "Operate outdoors in ventilated areas only. Follow standard equipment safety protocols."}
        </p>
      </div>
    </div>
  )
}
