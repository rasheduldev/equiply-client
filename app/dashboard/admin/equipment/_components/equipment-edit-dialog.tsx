"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { Loader2, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateAdminEquipment } from "@/lib/admin"

import { AdminDialog } from "../../_components/admin-dialog"
import type { AdminEquipment, EquipmentEditValues } from "../../_lib/types"

const rentalTypes = ["Daily", "Weekly", "Monthly"]

const selectClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm text-brand-navy outline-none transition focus-visible:border-brand-amber focus-visible:ring-3 focus-visible:ring-brand-amber/20 dark:border-white/15 dark:bg-white/5 dark:text-white"

const textareaClass =
  "min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm text-brand-navy outline-none transition placeholder:text-muted-foreground focus-visible:border-brand-amber focus-visible:ring-3 focus-visible:ring-brand-amber/20 dark:border-white/15 dark:bg-white/5 dark:text-white"

type EditForm = {
  name: string
  category: string
  location: string
  rentalPrice: string
  rentalType: string
  availableQuantity: string
  brand: string
  model: string
  condition: string
  description: string
}

function getInitialForm(equipment: AdminEquipment): EditForm {
  return {
    name: equipment.name,
    category: equipment.category,
    location: equipment.location,
    rentalPrice:
      equipment.rentalPrice === null ? "" : String(equipment.rentalPrice),
    rentalType: equipment.rentalType || "Daily",
    availableQuantity: String(equipment.availableQuantity),
    brand: equipment.brand,
    model: equipment.model,
    condition: equipment.condition,
    description: equipment.description,
  }
}

type EquipmentEditDialogProps = {
  equipment: AdminEquipment
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (values: EquipmentEditValues) => void
}

export function EquipmentEditDialog({
  equipment,
  open,
  onOpenChange,
  onSaved,
}: EquipmentEditDialogProps) {
  const [form, setForm] = useState<EditForm>(() => getInitialForm(equipment))
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const rentalTypeOptions = Array.from(
    new Set([...rentalTypes, equipment.rentalType].filter(Boolean))
  )

  function updateField<K extends keyof EditForm>(field: K, value: EditForm[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return

    const name = form.name.trim()
    const category = form.category.trim()
    const price = Number(form.rentalPrice)
    const quantity = Number(form.availableQuantity)

    if (!name || !category) {
      setFormError("Equipment name and category are required.")
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Enter a valid rental price greater than 0.")
      return
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setFormError("Available quantity must be 0 or greater.")
      return
    }

    const values: EquipmentEditValues = {
      name,
      category,
      location: form.location.trim(),
      rentalPrice: price,
      rentalType: form.rentalType,
      availableQuantity: quantity,
      brand: form.brand.trim(),
      model: form.model.trim(),
      condition: form.condition.trim(),
      description: form.description.trim(),
    }

    setSubmitting(true)
    setFormError(null)

    try {
      await updateAdminEquipment(equipment.id, values)

      toast.success("Equipment updated", {
        description: `${values.name} was saved successfully.`,
      })

      onSaved(values)
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update this equipment. Please try again."

      setFormError(message)
      toast.error("Update failed", { description: message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!submitting) onOpenChange(nextOpen)
      }}
      title="Edit equipment"
      description={equipment.name}
      className="max-w-2xl"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="h-10 w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="admin-equipment-edit-form"
            disabled={submitting}
            className="h-10 w-full bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand sm:w-auto"
          >
            {submitting && (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            )}
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </>
      }
    >
      <form
        id="admin-equipment-edit-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            <p>{formError}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="admin-equipment-name"
            label="Equipment Name"
            required
            className="sm:col-span-2"
          >
            <Input
              id="admin-equipment-name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="h-10 bg-slate-50 dark:bg-white/5"
            />
          </Field>

          <Field id="admin-equipment-category" label="Category" required>
            <Input
              id="admin-equipment-category"
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="h-10 bg-slate-50 dark:bg-white/5"
            />
          </Field>

          <Field id="admin-equipment-location" label="Hub Location">
            <Input
              id="admin-equipment-location"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              className="h-10 bg-slate-50 dark:bg-white/5"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="admin-equipment-price" label="Rental Price ($)" required>
            <Input
              id="admin-equipment-price"
              type="number"
              min="0"
              step="0.01"
              value={form.rentalPrice}
              onChange={(event) =>
                updateField("rentalPrice", event.target.value)
              }
              className="h-10 bg-slate-50 dark:bg-white/5"
            />
          </Field>

          <Field id="admin-equipment-rental-type" label="Rental Type" required>
            <select
              id="admin-equipment-rental-type"
              value={form.rentalType}
              onChange={(event) =>
                updateField("rentalType", event.target.value)
              }
              className={selectClass}
            >
              {rentalTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>

          <Field id="admin-equipment-quantity" label="Available Qty" required>
            <Input
              id="admin-equipment-quantity"
              type="number"
              min="0"
              step="1"
              value={form.availableQuantity}
              onChange={(event) =>
                updateField("availableQuantity", event.target.value)
              }
              className="h-10 bg-slate-50 dark:bg-white/5"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="admin-equipment-brand" label="Brand">
            <Input
              id="admin-equipment-brand"
              value={form.brand}
              onChange={(event) => updateField("brand", event.target.value)}
              className="h-10 bg-slate-50 dark:bg-white/5"
            />
          </Field>

          <Field id="admin-equipment-model" label="Model">
            <Input
              id="admin-equipment-model"
              value={form.model}
              onChange={(event) => updateField("model", event.target.value)}
              className="h-10 bg-slate-50 dark:bg-white/5"
            />
          </Field>

          <Field id="admin-equipment-condition" label="Condition">
            <Input
              id="admin-equipment-condition"
              value={form.condition}
              onChange={(event) => updateField("condition", event.target.value)}
              className="h-10 bg-slate-50 dark:bg-white/5"
            />
          </Field>
        </div>

        <Field id="admin-equipment-description" label="Description">
          <textarea
            id="admin-equipment-description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className={textareaClass}
          />
        </Field>
      </form>
    </AdminDialog>
  )
}

type FieldProps = {
  id: string
  label: string
  required?: boolean
  className?: string
  children: ReactNode
}

function Field({ id, label, required, className, children }: FieldProps) {
  return (
    <div className={className ? `space-y-1.5 ${className}` : "space-y-1.5"}>
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
