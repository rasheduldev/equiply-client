"use client"

import Image from "next/image"
import { useState } from "react"
import { PackageOpen, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { formatRentalPrice } from "../_lib/format"
import type { Equipment } from "../_lib/types"
import { StatusBadge } from "./status-badge"

type EquipmentDetailsSheetProps = {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (equipment: Equipment) => void
}

export function EquipmentDetailsSheet({
  equipment,
  open,
  onOpenChange,
  onEdit,
}: EquipmentDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-white data-[side=right]:w-full data-[side=right]:sm:max-w-xl dark:bg-brand-navy-soft"
      >
        {equipment && (
          <>
            <SheetHeader className="border-b border-slate-200/80 px-6 py-5 dark:border-white/10">
              <div className="flex items-start justify-between gap-3 pr-8">
                <div className="min-w-0">
                  <SheetTitle className="text-xl font-bold tracking-tight text-brand-navy dark:text-white">
                    Equipment Details
                  </SheetTitle>
                  <SheetDescription className="mt-1 text-sm text-brand-muted dark:text-white/50">
                    {equipment.name}
                  </SheetDescription>
                </div>

                <StatusBadge status={equipment.status} />
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <EquipmentImage key={equipment._id} equipment={equipment} />

              <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailItem label="Category" value={equipment.category} />
                <DetailItem
                  label="Rental Price"
                  value={formatRentalPrice(equipment)}
                />
                <DetailItem
                  label="Available Quantity"
                  value={String(equipment.availableQuantity)}
                />
                <DetailItem label="Location" value={equipment.location} />
                <DetailItem label="Brand" value={equipment.brand || "—"} />
                <DetailItem label="Model" value={equipment.model || "—"} />
                <DetailItem
                  label="Condition"
                  value={equipment.condition || "—"}
                />
                <DetailItem label="Rental Type" value={equipment.rentalType} />
              </dl>

              <div className="mt-6 space-y-2">
                <h3 className="text-[10px] font-bold tracking-[0.12em] text-brand-muted uppercase dark:text-white/40">
                  Description
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-white/65">
                  {equipment.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-[10px] font-bold tracking-[0.12em] text-brand-muted uppercase dark:text-white/40">
                  Rental Terms & Conditions
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-white/65">
                  {equipment.rentalTerms || "No rental terms provided."}
                </p>
              </div>
            </div>

            <SheetFooter className="border-t border-slate-200/80 p-6 sm:flex-row sm:justify-end dark:border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 w-full sm:w-auto"
              >
                Close
              </Button>

              <Button
                type="button"
                onClick={() => onEdit(equipment)}
                className="h-10 w-full bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand sm:w-auto"
              >
                <Pencil aria-hidden className="size-4" />
                Update Listing
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function EquipmentImage({ equipment }: { equipment: Equipment }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
      {equipment.imageUrl && !imageError ? (
        <Image
          src={equipment.imageUrl}
          alt={equipment.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 560px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-brand-muted dark:text-white/40">
          <PackageOpen aria-hidden className="size-10" />
        </div>
      )}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold tracking-[0.12em] text-brand-muted uppercase dark:text-white/40">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-brand-navy dark:text-white">
        {value}
      </dd>
    </div>
  )
}
