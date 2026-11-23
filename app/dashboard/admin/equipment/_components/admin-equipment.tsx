"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Loader2,
  PackageOpen,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { deleteAdminEquipment, updateEquipmentStatus } from "@/lib/admin"

import { AdminDialog } from "../../_components/admin-dialog"
import { AdminEmptyState } from "../../_components/admin-states"
import { AdminPageShell } from "../../_components/admin-page-shell"
import { EquipmentStatusBadge } from "../../_components/badges"
import type { AdminEquipment, EquipmentEditValues } from "../../_lib/types"
import { formatRate } from "../../_lib/utils"
import { EquipmentEditDialog } from "./equipment-edit-dialog"

type StatusAction = {
  equipment: AdminEquipment
  status: "Approved" | "Rejected"
}

const headClass =
  "px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase dark:text-white/40"

export function AdminEquipment({
  initialEquipments,
}: {
  initialEquipments: AdminEquipment[]
}) {
  const router = useRouter()

  const [equipments, setEquipments] = useState(initialEquipments)
  const [editing, setEditing] = useState<AdminEquipment | null>(null)
  const [deleting, setDeleting] = useState<AdminEquipment | null>(null)
  const [statusAction, setStatusAction] = useState<StatusAction | null>(null)
  const [deleteSaving, setDeleteSaving] = useState(false)
  const [statusSaving, setStatusSaving] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)

  function handleSaved(values: EquipmentEditValues) {
    setEquipments((current) =>
      current.map((equipment) =>
        equipment.id === editing?.id ? { ...equipment, ...values } : equipment
      )
    )

    setEditing(null)
    router.refresh()
  }

  async function confirmDelete() {
    if (!deleting || deleteSaving) return

    setDeleteSaving(true)
    setDeleteError(null)

    try {
      await deleteAdminEquipment(deleting.id)

      setEquipments((current) =>
        current.filter((equipment) => equipment.id !== deleting.id)
      )

      toast.success("Equipment deleted", {
        description: `${deleting.name} was removed from the marketplace.`,
      })

      setDeleting(null)
      router.refresh()
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not delete this equipment. Please try again."

      setDeleteError(message)
      toast.error("Delete failed", { description: message })
    } finally {
      setDeleteSaving(false)
    }
  }

  async function confirmStatusChange() {
    if (!statusAction || statusSaving) return

    setStatusSaving(true)
    setStatusError(null)

    try {
      await updateEquipmentStatus(
        statusAction.equipment.id,
        statusAction.status
      )

      setEquipments((current) =>
        current.map((equipment) =>
          equipment.id === statusAction.equipment.id
            ? { ...equipment, status: statusAction.status }
            : equipment
        )
      )

      toast.success(
        statusAction.status === "Approved"
          ? "Equipment approved"
          : "Equipment rejected",
        {
          description: `${statusAction.equipment.name} is now ${statusAction.status.toLowerCase()}.`,
        }
      )

      setStatusAction(null)
      router.refresh()
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update the equipment status. Please try again."

      setStatusError(message)
      toast.error("Status update failed", { description: message })
    } finally {
      setStatusSaving(false)
    }
  }

  return (
    <AdminPageShell
      title="All Marketplace Equipment Moderation"
      count={equipments.length}
    >
      {equipments.length === 0 ? (
        <AdminEmptyState
          icon={<PackageOpen aria-hidden className="size-7" />}
          title="No equipment listed yet"
          description="Owner listings will appear here for approval, editing, and moderation."
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[1080px] border-collapse text-left">
              <caption className="sr-only">
                All marketplace equipment awaiting moderation
              </caption>

              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10">
                  <th className={`${headClass} pl-0`}>Equipment</th>
                  <th className={headClass}>Owner</th>
                  <th className={headClass}>Category</th>
                  <th className={headClass}>Rate</th>
                  <th className={headClass}>Status</th>
                  <th className={`${headClass} pr-0 text-right`}>
                    Moderation Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {equipments.map((equipment) => (
                  <tr
                    key={equipment.id}
                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                  >
                    <td className="max-w-[360px] py-5 pr-3 pl-0 align-middle">
                      <p className="text-sm leading-snug font-bold text-brand-navy dark:text-white">
                        {equipment.name}
                      </p>
                    </td>

                    <td className="max-w-[190px] px-3 py-5 align-middle">
                      <p className="text-sm text-slate-600 dark:text-white/65">
                        {equipment.ownerName}
                      </p>
                    </td>

                    <td className="max-w-[200px] px-3 py-5 align-middle">
                      <p className="text-sm text-slate-600 dark:text-white/65">
                        {equipment.category}
                      </p>
                    </td>

                    <td className="px-3 py-5 align-middle whitespace-nowrap">
                      <p className="text-sm font-bold text-brand-navy dark:text-white">
                        {formatRate(
                          equipment.rentalPrice,
                          equipment.rentalType
                        )}
                      </p>
                    </td>

                    <td className="px-3 py-5 align-middle">
                      <EquipmentStatusBadge status={equipment.status} />
                    </td>

                    <td className="py-5 pr-0 pl-3 align-middle">
                      <EquipmentActions
                        equipment={equipment}
                        onEdit={() => setEditing(equipment)}
                        onDelete={() => {
                          setDeleteError(null)
                          setDeleting(equipment)
                        }}
                        onApprove={() => {
                          setStatusError(null)
                          setStatusAction({
                            equipment,
                            status: "Approved",
                          })
                        }}
                        onReject={() => {
                          setStatusError(null)
                          setStatusAction({
                            equipment,
                            status: "Rejected",
                          })
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 xl:hidden dark:divide-white/5">
            {equipments.map((equipment) => (
              <article
                key={equipment.id}
                className="space-y-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-sm leading-snug font-bold text-brand-navy dark:text-white">
                      {equipment.name}
                    </h2>
                    <p className="mt-1 text-xs text-brand-muted dark:text-white/50">
                      {equipment.category}
                    </p>
                  </div>

                  <EquipmentStatusBadge status={equipment.status} />
                </div>

                <dl className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
                      Owner
                    </dt>
                    <dd className="mt-1 text-sm text-slate-600 dark:text-white/65">
                      {equipment.ownerName}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
                      Rate
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-brand-navy dark:text-white">
                      {formatRate(equipment.rentalPrice, equipment.rentalType)}
                    </dd>
                  </div>
                </dl>

                <EquipmentActions
                  equipment={equipment}
                  onEdit={() => setEditing(equipment)}
                  onDelete={() => {
                    setDeleteError(null)
                    setDeleting(equipment)
                  }}
                  onApprove={() => {
                    setStatusError(null)
                    setStatusAction({
                      equipment,
                      status: "Approved",
                    })
                  }}
                  onReject={() => {
                    setStatusError(null)
                    setStatusAction({
                      equipment,
                      status: "Rejected",
                    })
                  }}
                  align="start"
                />
              </article>
            ))}
          </div>
        </>
      )}

      {editing && (
        <EquipmentEditDialog
          key={editing.id}
          equipment={editing}
          open
          onOpenChange={(open) => {
            if (!open) setEditing(null)
          }}
          onSaved={handleSaved}
        />
      )}

      <AdminDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open && !deleteSaving) {
            setDeleting(null)
            setDeleteError(null)
          }
        }}
        title="Delete equipment?"
        description="This permanently removes the listing from the marketplace. This action cannot be undone."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!deleteSaving) {
                  setDeleting(null)
                  setDeleteError(null)
                }
              }}
              className="h-10 w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={confirmDelete}
              disabled={deleteSaving}
              className="h-10 w-full bg-red-600 font-bold text-white hover:bg-red-700 sm:w-auto dark:bg-red-500 dark:hover:bg-red-600"
            >
              {deleteSaving ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : (
                <Trash2 aria-hidden className="size-4" />
              )}
              {deleteSaving ? "Deleting..." : "Delete Equipment"}
            </Button>
          </>
        }
      >
        {deleting && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
              <p className="text-sm font-bold text-brand-navy dark:text-white">
                {deleting.name}
              </p>
              <p className="mt-0.5 text-xs text-brand-muted dark:text-white/50">
                Owned by {deleting.ownerName}
              </p>
            </div>

            {deleteError && <DialogError message={deleteError} />}
          </div>
        )}
      </AdminDialog>

      <AdminDialog
        open={statusAction !== null}
        onOpenChange={(open) => {
          if (!open && !statusSaving) {
            setStatusAction(null)
            setStatusError(null)
          }
        }}
        title={
          statusAction?.status === "Approved"
            ? "Approve equipment?"
            : "Reject equipment?"
        }
        description={
          statusAction?.status === "Approved"
            ? "Approved equipment becomes visible in the public marketplace."
            : "Rejected equipment is hidden from the public marketplace until it is approved."
        }
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!statusSaving) {
                  setStatusAction(null)
                  setStatusError(null)
                }
              }}
              className="h-10 w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={confirmStatusChange}
              disabled={statusSaving}
              className={
                statusAction?.status === "Approved"
                  ? "h-10 w-full bg-emerald-600 font-bold text-white hover:bg-emerald-700 sm:w-auto"
                  : "h-10 w-full bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand sm:w-auto"
              }
            >
              {statusSaving && (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              )}
              {statusSaving
                ? "Updating..."
                : statusAction?.status === "Approved"
                  ? "Confirm Approve"
                  : "Confirm Reject"}
            </Button>
          </>
        }
      >
        {statusAction && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-bold text-brand-navy dark:text-white">
                {statusAction.equipment.name}
              </p>
              <p className="mt-0.5 text-xs text-brand-muted dark:text-white/50">
                {statusAction.equipment.ownerName}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <EquipmentStatusBadge status={statusAction.equipment.status} />
                <ArrowRight
                  aria-hidden
                  className="size-4 text-brand-muted dark:text-white/40"
                />
                <EquipmentStatusBadge status={statusAction.status} />
              </div>
            </div>

            {statusError && <DialogError message={statusError} />}
          </div>
        )}
      </AdminDialog>
    </AdminPageShell>
  )
}

type EquipmentActionsProps = {
  equipment: AdminEquipment
  onEdit: () => void
  onDelete: () => void
  onApprove: () => void
  onReject: () => void
  align?: "start" | "end"
}

function EquipmentActions({
  equipment,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  align = "end",
}: EquipmentActionsProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${
        align === "end" ? "justify-end" : "justify-start"
      }`}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onApprove}
        className="h-8 rounded-md bg-emerald-100 px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
      >
        Approve
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onReject}
        className="h-8 rounded-md bg-amber-100 px-3 text-xs font-bold text-amber-700 hover:bg-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
      >
        Reject
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onEdit}
        aria-label={`Edit ${equipment.name}`}
        title="Edit equipment"
        className="size-9 shrink-0 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15"
      >
        <Pencil aria-hidden className="size-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDelete}
        aria-label={`Delete ${equipment.name}`}
        title="Delete equipment"
        className="size-9 shrink-0 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
      >
        <Trash2 aria-hidden className="size-4" />
      </Button>
    </div>
  )
}

function DialogError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
    >
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  )
}
