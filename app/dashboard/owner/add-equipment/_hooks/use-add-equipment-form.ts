"use client"

import { useState, type FormEvent } from "react"

import { authClient } from "@/lib/auth-client"

import {
  initialForm,
  type EquipmentForm,
  type EquipmentData,
} from "../_lib/equipment-form"
import { createEquipment } from "@/lib/actions/equipments"

export function useAddEquipmentForm() {
  const { data: session, isPending } = authClient.useSession()

  const [form, setForm] = useState<EquipmentForm>(initialForm)
  const [imageUrl, setImageUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const ownerName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "Equiply owner"

  function updateField<K extends keyof EquipmentForm>(
    field: K,
    value: EquipmentForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  setFormError(null)
  setSuccess(null)

  if (!session?.user) {
    setFormError("Please sign in as an owner before submitting a listing.")
    return
  }

  if (
    !form.name.trim() ||
    !form.category ||
    !form.location.trim() ||
    !form.terms.trim()
  ) {
    setFormError("Please complete all required fields.")
    return
  }

  const price = Number(form.price)

  if (!Number.isFinite(price) || price <= 0) {
    setFormError("Enter a valid rental price greater than 0.")
    return
  }

  const quantity = Number(form.quantity)

  if (!Number.isInteger(quantity) || quantity < 1) {
    setFormError("Available quantity must be at least 1.")
    return
  }

  const trimmedImageUrl = imageUrl.trim()

  if (!trimmedImageUrl) {
    setFormError("Paste a direct equipment image URL from ImgBB.")
    return
  }

  setSubmitting(true)

  try {
    const equipmentData: EquipmentData = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      location: form.location.trim(),
      rentalPrice: price,
      rentalType: form.rentalType,
      availableQuantity: quantity,
      condition: form.condition,
      brand: form.brand.trim(),
      model: form.model.trim(),
      imageUrl: trimmedImageUrl,
      rentalTerms: form.terms.trim(),
      status: "Pending",
      ownerId: session.user.id,
      ownerName,
      ownerEmail: session.user.email,
      ownerImage: session.user.image ?? "",
    }

    const result = await createEquipment(equipmentData)

    if (!result.insertedId) {
      throw new Error("Equipment submission failed")
    }

    setSuccess(
      "Your equipment listing was submitted for approval. Status: Pending."
    )

    setForm(initialForm)
    setImageUrl("")
  } catch {
    setFormError("We couldn't save your listing. Please try again.")
  } finally {
    setSubmitting(false)
  }
}


  return {
    form,
    imageUrl,
    setImageUrl,
    updateField,
    handleSubmit,
    submitting,
    formError,
    success,
    isPending,
  }
}
