import type { Equipment } from "./types"

const STORAGE_KEY = "equiply:my-equipment-overrides"

type EquipmentOverrides = {
  updated: Record<string, Partial<Equipment>>
  deleted: string[]
}

const emptyOverrides: EquipmentOverrides = {
  updated: {},
  deleted: [],
}

function readOverrides(): EquipmentOverrides {
  if (typeof window === "undefined") {
    return emptyOverrides
  }

  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "{}"
    )

    if (typeof parsed !== "object" || parsed === null) {
      return emptyOverrides
    }

    const value = parsed as Partial<EquipmentOverrides>

    return {
      updated:
        value.updated && typeof value.updated === "object" ? value.updated : {},
      deleted: Array.isArray(value.deleted)
        ? value.deleted.filter((id): id is string => typeof id === "string")
        : [],
    }
  } catch {
    return emptyOverrides
  }
}

function writeOverrides(overrides: EquipmentOverrides) {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Storage can be unavailable in private browsing; the in-memory state
    // still keeps the page usable for the current session.
  }
}

export function applyOverrides(equipments: Equipment[]) {
  const { updated, deleted } = readOverrides()

  return equipments
    .filter((equipment) => !deleted.includes(equipment._id))
    .map((equipment) => ({
      ...equipment,
      ...updated[equipment._id],
    }))
}

export function persistUpdate(id: string, changes: Partial<Equipment>) {
  const overrides = readOverrides()

  overrides.updated[id] = {
    ...overrides.updated[id],
    ...changes,
  }
  writeOverrides(overrides)
}

export function persistDelete(id: string) {
  const overrides = readOverrides()

  overrides.deleted = Array.from(new Set([...overrides.deleted, id]))
  delete overrides.updated[id]
  writeOverrides(overrides)
}
