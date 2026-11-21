"use client"

import { useEffect, useState } from "react"

import { useEquipmentParams } from "./use-equipment-params"

/**
 * Keeps an input responsive while debouncing the URL update. The value is
 * re-synced when the URL changes (for example after "Reset filters").
 */
export function useDebouncedParam(key: string, delay = 400) {
  const { searchParams, update } = useEquipmentParams()
  const paramValue = searchParams.get(key) ?? ""
  const [value, setValue] = useState(paramValue)
  const [syncedValue, setSyncedValue] = useState(paramValue)

  // Adjust the local draft when the URL changes (for example after reset)
  // without an extra effect round-trip.
  if (paramValue !== syncedValue) {
    setSyncedValue(paramValue)
    setValue(paramValue)
  }

  useEffect(() => {
    if (value === paramValue) {
      return
    }

    const timer = window.setTimeout(() => {
      update({ [key]: value })
    }, delay)

    return () => window.clearTimeout(timer)
  }, [delay, key, paramValue, update, value])

  return [value, setValue] as const
}
