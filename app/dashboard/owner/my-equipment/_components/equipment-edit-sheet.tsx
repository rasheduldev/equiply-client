"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { CircleX } from "lucide-react"

import {
  rentalTypes,
  type RentalType,
} from "@/app/dashboard/owner/add-equipment/_lib/equipment-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import type { Equipment } from "../_lib/types"
import { StatusBadge } from "./status-badge"

type EquipmentEditSheetProps = {
  equipment: Equipment
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (equipment: Equipment) => void
}

type EditForm = {
  name: string
  category: string
  location: string
  rentalPrice: string
  rentalType: RentalType
  availableQuantity: string
  brand: string
  model: string
  condition: string
  description: string
  rentalTerms: string
}

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-slate-50 px-2.5 text-sm text-brand-navy outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-white/5 dark:text-white"

const textareaClass =
  "min-h-24 w-full resize-y rounded-lg border border-input bg-slate-50 px-2.5 py-2 text-sm text-brand-navy outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-white/5 dark:text-white"

function getInitialForm(equipment: Equipment): EditForm {
  return {
    name: equipment.name,
    category: equipment.category,
    location: equipment.location,
    rentalPrice: String(equipment.rentalPrice),
    rentalType: equipment.rentalType,
    availableQuantity: String(equipment.availableQuantity),
    brand: equipment.brand,
    model: equipment.model,
    condition: equipment.condition,
    description: equipment.description,
    rentalTerms: equipment.rentalTerms,
  }
}

export function EquipmentEditSheet({
  equipment,
  open,
  onOpenChange,
  onSave,
}: EquipmentEditSheetProps) {
  const [form, setForm] = useState<EditForm>(() => getInitialForm(equipment))
  const [formError, setFormError] = useState<string | null>(null)

  function updateField<K extends keyof EditForm>(field: K, value: EditForm[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setFormError(null)

    if (!form.name.trim() || !form.category.trim() || !form.location.trim()) {
      setFormError(
        "Please complete the equipment name, category, and location."
      )
      return
    }

    const price = Number(form.rentalPrice)

    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Enter a valid rental price greater than 0.")
      return
    }

    const quantity = Number(form.availableQuantity)

    if (!Number.isInteger(quantity) || quantity < 1) {
      setFormError("Available quantity must be at least 1.")
      return
    }

    onSave({
      ...equipment,
      name: form.name.trim(),
      category: form.category.trim(),
      location: form.location.trim(),
      rentalPrice: price,
      rentalType: form.rentalType,
      availableQuantity: quantity,
      brand: form.brand.trim(),
      model: form.model.trim(),
      condition: form.condition.trim(),
      description: form.description.trim(),
      rentalTerms: form.rentalTerms.trim(),
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-white data-[side=right]:w-full data-[side=right]:sm:max-w-xl dark:bg-brand-navy-soft"
      >
        <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
          <SheetHeader className="border-b border-slate-200/80 px-6 py-5 dark:border-white/10">
            <div className="flex items-start justify-between gap-3 pr-8">
              <div className="min-w-0">
                <SheetTitle className="text-xl font-bold tracking-tight text-brand-navy dark:text-white">
                  Update Equipment
                </SheetTitle>
                <SheetDescription className="mt-1 truncate text-sm text-brand-muted dark:text-white/50">
                  {equipment.name}
                </SheetDescription>
              </div>

              <StatusBadge status={equipment.status} />
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {formError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
              >
                <CircleX aria-hidden className="mt-0.5 size-4 shrink-0" />
                <p>{formError}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <EditField
                id="edit-equipment-name"
                label="Equipment Name"
                required
                className="sm:col-span-2"
              >
                <Input
                  id="edit-equipment-name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="h-10 bg-slate-50 dark:bg-white/5"
                />
              </EditField>

              <EditField id="edit-category" label="Category" required>
                <Input
                  id="edit-category"
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className="h-10 bg-slate-50 dark:bg-white/5"
                />
              </EditField>

              <EditField id="edit-location" label="Hub Location" required>
                <Input
                  id="edit-location"
                  value={form.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  className="h-10 bg-slate-50 dark:bg-white/5"
                />
              </EditField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <EditField id="edit-price" label="Rental Price ($)" required>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.rentalPrice}
                  onChange={(event) =>
                    updateField("rentalPrice", event.target.value)
                  }
                  className="h-10 bg-slate-50 dark:bg-white/5"
                />
              </EditField>

              <EditField id="edit-rental-type" label="Rental Type" required>
                <select
                  id="edit-rental-type"
                  value={form.rentalType}
                  onChange={(event) =>
                    updateField("rentalType", event.target.value as RentalType)
                  }
                  className={selectClass}
                >
                  {rentalTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </EditField>

              <EditField id="edit-quantity" label="Available Qty" required>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={form.availableQuantity}
                  onChange={(event) =>
                    updateField("availableQuantity", event.target.value)
                  }
                  className="h-10 bg-slate-50 dark:bg-white/5"
                />
              </EditField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <EditField id="edit-brand" label="Brand">
                <Input
                  id="edit-brand"
                  value={form.brand}
                  onChange={(event) => updateField("brand", event.target.value)}
                  className="h-10 bg-slate-50 dark:bg-white/5"
                />
              </EditField>

              <EditField id="edit-model" label="Model">
                <Input
                  id="edit-model"
                  value={form.model}
                  onChange={(event) => updateField("model", event.target.value)}
                  className="h-10 bg-slate-50 dark:bg-white/5"
                />
              </EditField>

              <EditField id="edit-condition" label="Condition">
                <Input
                  id="edit-condition"
                  value={form.condition}
                  onChange={(event) =>
                    updateField("condition", event.target.value)
                  }
                  className="h-10 bg-slate-50 dark:bg-white/5"
                />
              </EditField>
            </div>

            <EditField id="edit-description" label="Description">
              <textarea
                id="edit-description"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className={textareaClass}
              />
            </EditField>

            <EditField id="edit-terms" label="Rental Terms & Conditions">
              <textarea
                id="edit-terms"
                value={form.rentalTerms}
                onChange={(event) =>
                  updateField("rentalTerms", event.target.value)
                }
                className={textareaClass}
              />
            </EditField>

            <p className="rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-brand-muted dark:bg-white/5 dark:text-white/45">
              Listing status is managed by Equiply admins. Updates keep the
              current status.
            </p>
          </div>

          <SheetFooter className="border-t border-slate-200/80 p-6 sm:flex-row sm:justify-end dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 w-full bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand sm:w-auto"
            >
              Save Changes
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

type EditFieldProps = {
  id: string
  label: string
  required?: boolean
  className?: string
  children: ReactNode
}

function EditField({
  id,
  label,
  required,
  className,
  children,
}: EditFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-[10px] font-bold tracking-[0.12em] text-brand-muted uppercase dark:text-white/45"
      >
        {label}
        {required && (
          <span
            aria-hidden
            className="ml-1 text-brand-amber-deep dark:text-brand-amber"
          >
            *
          </span>
        )}
      </label>

      {children}
    </div>
  )
}
