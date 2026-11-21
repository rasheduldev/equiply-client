"use client"

import { useCallback, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { equipmentFilterKeys } from "../_lib/query"

type ParamUpdates = Record<string, string | undefined>

/**
 * Small helper around the URL so every control on the page updates the query
 * string the same way. Existing params are always preserved.
 */
export function useEquipmentParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const navigate = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString()

      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        })
      })
    },
    [pathname, router]
  )

  const update = useCallback(
    (updates: ParamUpdates) => {
      const next = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          next.set(key, value)
        } else {
          next.delete(key)
        }
      }

      navigate(next)
    },
    [navigate, searchParams]
  )

  const resetFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString())

    for (const key of equipmentFilterKeys) {
      next.delete(key)
    }

    navigate(next)
  }, [navigate, searchParams])

  return { searchParams, update, resetFilters, isPending }
}
