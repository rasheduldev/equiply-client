"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ChevronDown,
  Loader2,
  TriangleAlert,
  UsersRound,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { updateUserRole } from "@/lib/admin"

import { AdminDialog } from "../../_components/admin-dialog"
import { AdminEmptyState } from "../../_components/admin-states"
import { AdminPageShell } from "../../_components/admin-page-shell"
import { RoleBadge } from "../../_components/badges"
import type { AdminRole, AdminUser } from "../../_lib/types"
import { formatDate, getInitials } from "../../_lib/utils"

const roleOptions: Array<{ value: AdminRole; label: string }> = [
  { value: "customer", label: "Customer" },
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
]

type PendingRole = {
  user: AdminUser
  role: AdminRole
}

const headClass =
  "px-3 py-4 text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase dark:text-white/40"

export function AdminUsers({ initialUsers }: { initialUsers: AdminUser[] }) {
  const router = useRouter()

  const [users, setUsers] = useState(initialUsers)
  const [pendingRole, setPendingRole] = useState<PendingRole | null>(null)
  const [saving, setSaving] = useState(false)
  const [roleError, setRoleError] = useState<string | null>(null)

  function requestRoleChange(user: AdminUser, role: AdminRole) {
    if (role === user.role) return

    setRoleError(null)
    setPendingRole({ user, role })
  }

  async function confirmRoleChange() {
    if (!pendingRole || saving) return

    setSaving(true)
    setRoleError(null)

    try {
      await updateUserRole(pendingRole.user.id, pendingRole.role)

      setUsers((current) =>
        current.map((user) =>
          user.id === pendingRole.user.id
            ? { ...user, role: pendingRole.role }
            : user
        )
      )

      toast.success("Role updated", {
        description: `${pendingRole.user.name} is now ${
          roleOptions.find((option) => option.value === pendingRole.role)
            ?.label ?? "a user"
        }.`,
      })

      setPendingRole(null)
      router.refresh()
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update this user's role. Please try again."

      setRoleError(message)
      toast.error("Role update failed", { description: message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminPageShell title="Registered Platform Users" count={users.length}>
      {users.length === 0 ? (
        <AdminEmptyState
          icon={<UsersRound aria-hidden className="size-7" />}
          title="No platform users yet"
          description="New customer, owner, and admin accounts will appear here as they register."
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <caption className="sr-only">
                All registered Equiply platform users
              </caption>

              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/10">
                  <th className={`${headClass} pl-0`}>User</th>
                  <th className={headClass}>Email</th>
                  <th className={headClass}>Registration Date</th>
                  <th className={headClass}>Current Role</th>
                  <th className={`${headClass} pr-0 text-right`}>
                    Change Role (RBAC)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                  >
                    <td className="max-w-[260px] py-5 pr-3 pl-0 align-middle">
                      <div className="flex min-w-0 items-center gap-3">
                        <UserAvatar user={user} />

                        <p className="truncate text-sm font-bold text-brand-navy dark:text-white">
                          {user.name}
                        </p>
                      </div>
                    </td>

                    <td className="max-w-[260px] px-3 py-5 align-middle">
                      <p className="truncate text-sm text-slate-600 dark:text-white/65">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-3 py-5 align-middle whitespace-nowrap">
                      <p className="text-sm text-slate-600 dark:text-white/65">
                        {formatDate(user.createdAt)}
                      </p>
                    </td>

                    <td className="px-3 py-5 align-middle">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="py-5 pr-0 pl-3 align-middle">
                      <RoleSelect
                        user={user}
                        disabled={saving && pendingRole?.user.id === user.id}
                        onChange={(role) => requestRoleChange(user, role)}
                        className="ml-auto"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 xl:hidden dark:divide-white/5">
            {users.map((user) => (
              <article
                key={user.id}
                className="space-y-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar user={user} />

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold text-brand-navy dark:text-white">
                        {user.name}
                      </h2>
                      <p className="mt-0.5 truncate text-xs text-brand-muted dark:text-white/50">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <RoleBadge role={user.role} />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
                      Registration Date
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-white/65">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>

                  <div className="sm:w-52">
                    <p className="mb-1.5 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase dark:text-white/40">
                      Change Role
                    </p>
                    <RoleSelect
                      user={user}
                      disabled={saving && pendingRole?.user.id === user.id}
                      onChange={(role) => requestRoleChange(user, role)}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <AdminDialog
        open={pendingRole !== null}
        onOpenChange={(open) => {
          if (!open && !saving) {
            setPendingRole(null)
            setRoleError(null)
          }
        }}
        title="Change user role?"
        description="This updates the account's access across the Equiply marketplace."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!saving) {
                  setPendingRole(null)
                  setRoleError(null)
                }
              }}
              className="h-10 w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={confirmRoleChange}
              disabled={saving}
              className="h-10 w-full bg-brand-amber font-bold text-brand-navy hover:bg-brand-sand sm:w-auto"
            >
              {saving && (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              )}
              {saving ? "Updating..." : "Confirm Change"}
            </Button>
          </>
        }
      >
        {pendingRole && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-bold text-brand-navy dark:text-white">
                {pendingRole.user.name}
              </p>
              <p className="mt-0.5 text-xs text-brand-muted dark:text-white/50">
                {pendingRole.user.email}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <RoleBadge role={pendingRole.user.role} />
                <ArrowRight
                  aria-hidden
                  className="size-4 text-brand-muted dark:text-white/40"
                />
                <RoleBadge role={pendingRole.role} />
              </div>
            </div>

            {roleError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
              >
                <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                <p>{roleError}</p>
              </div>
            )}
          </div>
        )}
      </AdminDialog>
    </AdminPageShell>
  )
}

function UserAvatar({ user }: { user: AdminUser }) {
  const [imageError, setImageError] = useState(false)
  const initials = getInitials(user.name)

  if (!user.image || imageError) {
    return (
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-amber-soft text-xs font-bold text-brand-amber-deep dark:bg-brand-amber/10 dark:text-brand-amber">
        {initials || <UsersRound aria-hidden className="size-4" />}
      </span>
    )
  }

  return (
    <Image
      src={user.image}
      alt={`${user.name} profile photo`}
      width={44}
      height={44}
      unoptimized
      referrerPolicy="no-referrer"
      className="size-11 shrink-0 rounded-full object-cover"
      onError={() => setImageError(true)}
    />
  )
}

type RoleSelectProps = {
  user: AdminUser
  disabled: boolean
  onChange: (role: AdminRole) => void
  className?: string
}

function RoleSelect({ user, disabled, onChange, className }: RoleSelectProps) {
  return (
    <div className={`relative w-full sm:w-[150px] ${className ?? ""}`}>
      <select
        value={user.role}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as AdminRole)}
        aria-label={`Change role for ${user.name}`}
        className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-semibold text-brand-navy shadow-sm transition outline-none focus-visible:border-brand-amber focus-visible:ring-3 focus-visible:ring-brand-amber/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-white/5 dark:text-white"
      >
        {roleOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-brand-navy"
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-brand-muted dark:text-white/50"
      />
    </div>
  )
}
