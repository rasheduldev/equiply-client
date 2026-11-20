"use client"

import { ImagePlus, LoaderCircle, ShieldCheck } from "lucide-react"

import { useAddEquipmentForm } from "../_hooks/use-add-equipment-form"
import { categories, conditions, rentalTypes } from "../_lib/equipment-form"
import { FormAlert } from "./form-alert"
import { FormField, TextareaField, TextField } from "./form-field"
import { FormGrid } from "./form-grid"
import { SelectField } from "./select-field"

export function AddEquipmentForm() {
  const {
    form,
    imageUrl,
    setImageUrl,
    updateField,
    handleSubmit,
    submitting,
    formError,
    success,
    isPending,
  } = useAddEquipmentForm()

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-40px_rgba(13,32,55,0.45)] dark:border-white/10 dark:bg-brand-navy-soft"
    >
      <div className="border-b border-slate-200/80 px-5 py-6 sm:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl dark:text-white">
          List New Equipment For Rent
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted dark:text-white/55">
          Submitted listings enter{" "}
          <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200 dark:bg-brand-amber/10 dark:text-brand-amber dark:ring-brand-amber/20">
            Pending
          </span>{" "}
          status for Admin quality approval before appearing in the public
          catalog.
        </p>

        <p className="mt-2 text-xs text-brand-muted dark:text-white/40">
          Owner details are attached automatically from your signed-in account.
        </p>
      </div>

      <div className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        {formError && <FormAlert variant="error">{formError}</FormAlert>}

        {success && <FormAlert variant="success">{success}</FormAlert>}

        <FormGrid>
          <FormField id="equipment-name" label="Equipment Name" required>
            <TextField
              id="equipment-name"
              name="name"
              required
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="e.g. Bobcat S650 Skid-Steer Loader"
            />
          </FormField>

          <FormField id="category" label="Category" required>
            <SelectField
              id="category"
              name="category"
              value={form.category}
              onChange={(value) => updateField("category", value)}
              options={categories}
              placeholder="Select category"
              required
            />
          </FormField>
        </FormGrid>

        <FormField
          id="description"
          label="Description & Included Attachments"
          hint="Include specs, horsepower, capacity, and any accessories included with the rental."
        >
          <TextareaField
            id="description"
            name="description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe specs, horsepower, capacity, and included accessories..."
          />
        </FormField>

        <FormGrid columns={3}>
          <FormField id="rental-price" label="Rental Price ($)" required>
            <TextField
              id="rental-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="280"
              leading={<span className="text-sm font-semibold">$</span>}
            />
          </FormField>

          <FormField id="rental-type" label="Rental Type" required>
            <SelectField
              id="rental-type"
              name="rentalType"
              value={form.rentalType}
              onChange={(value) => updateField("rentalType", value)}
              options={rentalTypes}
              required
            />
          </FormField>

          <FormField id="quantity" label="Available Quantity" required>
            <TextField
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              required
              value={form.quantity}
              onChange={(event) => updateField("quantity", event.target.value)}
              placeholder="2"
            />
          </FormField>
        </FormGrid>

        <FormGrid columns={3}>
          <FormField id="brand" label="Brand">
            <TextField
              id="brand"
              name="brand"
              value={form.brand}
              onChange={(event) => updateField("brand", event.target.value)}
              placeholder="Bobcat"
            />
          </FormField>

          <FormField id="model" label="Model">
            <TextField
              id="model"
              name="model"
              value={form.model}
              onChange={(event) => updateField("model", event.target.value)}
              placeholder="S650"
            />
          </FormField>

          <FormField id="condition" label="Equipment Condition" required>
            <SelectField
              id="condition"
              name="condition"
              value={form.condition}
              onChange={(value) => updateField("condition", value)}
              options={conditions}
              required
            />
          </FormField>
        </FormGrid>

        <FormGrid>
          <FormField id="location" label="Hub Location" required>
            <TextField
              id="location"
              name="location"
              required
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="Austin, TX"
            />
          </FormField>

          <FormField
            id="equipment-image-url"
            label="Equipment Image URL (ImgBB)"
            hint="Paste the direct image URL from ImgBB."
            required
          >
            <TextField
              id="equipment-image-url"
              name="imageUrl"
              type="url"
              required
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://i.ibb.co/..."
              leading={<ImagePlus aria-hidden className="size-4" />}
            />
          </FormField>
        </FormGrid>

        <FormField
          id="terms"
          label="Rental Terms & Conditions"
          hint="Set expectations for fuel, insurance, cleaning, and return conditions."
          required
        >
          <TextareaField
            id="terms"
            name="terms"
            required
            size="compact"
            value={form.terms}
            onChange={(event) => updateField("terms", event.target.value)}
            placeholder="Return with full fuel tank. Valid site insurance required."
          />
        </FormField>

        <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <button
            type="submit"
            disabled={submitting || isPending}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-amber px-6 text-xs font-bold tracking-[0.12em] text-brand-navy uppercase transition-colors hover:bg-brand-sand focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:focus-visible:ring-offset-brand-navy-soft"
          >
            {submitting ? (
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
            ) : (
              <ShieldCheck aria-hidden className="size-4" />
            )}
            {submitting
              ? "Submitting listing..."
              : "Submit Listing for Approval"}
          </button>

          <p className="text-xs leading-relaxed text-brand-muted dark:text-white/40">
            Listings are reviewed by Equiply admin before publishing.
          </p>
        </div>
      </div>
    </form>
  )
}
