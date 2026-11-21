
"use client"

import Link from "next/link"
import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  CircleCheck,
  CircleX,
  PackageOpen,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"

import {
  getOwnerEquipments,
} from "../_lib/equipment-api"
import { persistUpdate } from "../_lib/local-overrides"
import type { Equipment } from "../_lib/types"
import { DeleteEquipmentDialog } from "./delete-equipment-dialog"
import { EquipmentDetailsSheet } from "./equipment-details-sheet"
import { EquipmentEditSheet } from "./equipment-edit-sheet"
import { EquipmentTable } from "./equipment-table"
import { toast } from "sonner"
import { deleteEquipment } from "@/lib/actions/equipments"

export function MyEquipmentList() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedOwnerId, setLoadedOwnerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [viewing, setViewing] = useState<Equipment | null>(null)
  const [editing, setEditing] = useState<Equipment | null>(null)
  const [deleting, setDeleting] = useState<Equipment | null>(null)

  const ownerId = session?.user?.id
  const isOwner = session?.user?.role === "owner"

  const isLoading =
    isPending || (isOwner && (loading || loadedOwnerId !== ownerId))

  const countLabel = isLoading ? "..." : equipments.length

  useEffect(() => {
    if (isPending || !ownerId || !isOwner) {
      return
    }

    let active = true

    getOwnerEquipments(ownerId)
      .then((data) => {
        if (active) {
          setEquipments(data)
          setLoadedOwnerId(ownerId)
          setError(null)
        }
      })
      .catch(() => {
        if (active) {
          setError(
            "We couldn't load your equipment right now. Please try again."
          )
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [isPending, ownerId, isOwner, reloadToken])

  useEffect(() => {
    if (!feedback) {
      return
    }

    const timer = window.setTimeout(() => setFeedback(null), 4000)

    return () => window.clearTimeout(timer)
  }, [feedback])

  function handleView(equipment: Equipment) {
    setFeedback(null)
    setViewing(equipment)
  }

  function handleEdit(equipment: Equipment) {
    setFeedback(null)
    setViewing(null)
    setEditing(equipment)
  }

  function handleDelete(equipment: Equipment) {
    setFeedback(null)
    setDeleting(equipment)
  }

  function handleSave(updated: Equipment) {
    setEquipments((current) =>
      current.map((equipment) =>
        equipment._id === updated._id ? updated : equipment
      )
    )

    persistUpdate(updated._id, {
      name: updated.name,
      category: updated.category,
      location: updated.location,
      rentalPrice: updated.rentalPrice,
      rentalType: updated.rentalType,
      availableQuantity: updated.availableQuantity,
      brand: updated.brand,
      model: updated.model,
      condition: updated.condition,
      description: updated.description,
      rentalTerms: updated.rentalTerms,
    })

    setEditing(null)
    setFeedback("Equipment updated successfully.")
  }

  async function handleConfirmDelete(equipment: Equipment) {
    try {
      await deleteEquipment(equipment._id)

      setEquipments((current) =>
        current.filter((item) => item._id !== equipment._id)
      )

      setDeleting(null)

      setViewing((current) =>
        current?._id === equipment._id ? null : current
      )

      toast.success("Equipment deleted", {
        description: "The equipment has been permanently deleted.",
      })

      router.refresh()
    } catch {
      toast.error("Deletion failed", {
        description: "Could not delete the equipment. Please try again.",
      })
    }
  }

  return (
    <div className="-m-4 min-h-[calc(100vh-3.5rem)] bg-slate-50 p-4 md:-m-6 md:p-6 dark:bg-[#0a1729]">
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-40px_rgba(13,32,55,0.45)] dark:border-white/10 dark:bg-brand-navy-soft">
          <div className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-[28px] dark:text-white">
              My Listed Fleet ({countLabel})
            </h1>

            <Button
              nativeButton={false}
              render={<Link href="/dashboard/owner/add-equipment" />}
              className="h-11 w-full rounded-lg bg-brand-amber px-5 text-sm font-bold text-brand-navy hover:bg-brand-sand sm:w-auto"
            >
              <Plus aria-hidden className="size-4" />
              Add Equipment
            </Button>
          </div>

          <div className="p-5 sm:p-7">
            {feedback && (
              <div
                role="status"
                className="mb-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              >
                <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
                <p>{feedback}</p>
              </div>
            )}

            {error ? (
              <ErrorState
                message={error}
                onRetry={() => {
                  setError(null)
                  setLoading(true)
                  setReloadToken((value) => value + 1)
                }}
              />
            ) : isLoading ? (
              <LoadingState />
            ) : !session?.user ? (
              <StatePanel
                icon={<UserRound aria-hidden className="size-7" />}
                title="Sign in to manage your equipment"
                description="Your equipment listings are tied to your owner account. Sign in to view and manage them."
                action={
                  <Button
                    nativeButton={false}
                    render={<Link href="/sign-in" />}
                    className="h-10 bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand"
                  >
                    Sign In
                  </Button>
                }
              />
            ) : !isOwner ? (
              <StatePanel
                icon={<ShieldCheck aria-hidden className="size-7" />}
                title="Owner account required"
                description="This page is only available to owner accounts. Sign in with an owner account to manage equipment."
              />
            ) : equipments.length === 0 ? (
              <StatePanel
                icon={<PackageOpen aria-hidden className="size-7" />}
                title="No equipment listed yet"
                description="Add your first piece of equipment to start renting it out to customers."
                action={
                  <Button
                    nativeButton={false}
                    render={<Link href="/dashboard/owner/add-equipment" />}
                    className="h-10 bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand"
                  >
                    <Plus aria-hidden className="size-4" />
                    Add Equipment
                  </Button>
                }
              />
            ) : (
              <EquipmentTable
                equipments={equipments}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>

      <EquipmentDetailsSheet
        equipment={viewing}
        open={viewing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setViewing(null)
          }
        }}
        onEdit={handleEdit}
      />

      {editing && (
        <EquipmentEditSheet
          key={editing._id}
          equipment={editing}
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditing(null)
            }
          }}
          onSave={handleSave}
        />
      )}

      <DeleteEquipmentDialog
        equipment={deleting}
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null)
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading equipment">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="hidden h-5 w-28 sm:block" />
          <Skeleton className="hidden h-5 w-20 sm:block" />
          <Skeleton className="hidden h-5 w-14 sm:block" />
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  )
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
    >
      <div className="flex items-start gap-2">
        <CircleX aria-hidden className="mt-0.5 size-4 shrink-0" />
        <p>{message}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        className="h-9 shrink-0 border-red-200 bg-white text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10"
      >
        <RefreshCw aria-hidden className="size-4" />
        Retry
      </Button>
    </div>
  )
}

type StatePanelProps = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

function StatePanel({ icon, title, description, action }: StatePanelProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-amber-soft text-brand-amber-deep dark:bg-brand-amber/10 dark:text-brand-amber">
        {icon}
      </span>

      <h2 className="mt-4 text-lg font-bold text-brand-navy dark:text-white">
        {title}
      </h2>

      <p className="mt-1 max-w-sm text-sm leading-relaxed text-brand-muted dark:text-white/50">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
