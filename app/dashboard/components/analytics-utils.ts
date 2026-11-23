export type MonthlyBookingPoint = {
  key: string
  label: string
  value: number
}

export type MonthlyBookingEntry = {
  date?: string | null
  value?: number | string | null
}

export function formatAnalyticsCurrency(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0
  const hasCents = Math.abs(safeValue % 1) > 0.001

  return `$${safeValue.toLocaleString("en-US", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  })}`
}

export function buildMonthlyBookingSeries(
  entries: MonthlyBookingEntry[],
  now = new Date()
): MonthlyBookingPoint[] {
  const months: MonthlyBookingPoint[] = []

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)

    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleString("en-US", { month: "short" }),
      value: 0,
    })
  }

  const totals = new Map(months.map((month) => [month.key, 0]))

  for (const entry of entries) {
    const date = parseEntryDate(entry.date)

    if (!date) continue

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    if (!totals.has(key)) continue

    const value =
      typeof entry.value === "string"
        ? Number.parseFloat(entry.value)
        : entry.value

    if (typeof value !== "number" || !Number.isFinite(value)) continue

    totals.set(key, (totals.get(key) ?? 0) + value)
  }

  return months.map((month) => ({
    ...month,
    value: Math.round((totals.get(month.key) ?? 0) * 100) / 100,
  }))
}

function parseEntryDate(value?: string | null): Date | null {
  if (!value) return null

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}
