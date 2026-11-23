import Link from "next/link"
import { ArrowRight, ChartNoAxesColumn } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  formatAnalyticsCurrency,
  type MonthlyBookingPoint,
} from "./analytics-utils"

export type AnalyticsTone = "default" | "amber" | "green"

export type AnalyticsStat = {
  label: string
  value: string
  tone?: AnalyticsTone
}

type AnalyticsDashboardProps = {
  title: string
  heading?: string
  stats: AnalyticsStat[]
  chartTitle: string
  chartDescription: string
  monthlyBookings: MonthlyBookingPoint[]
  pendingCount?: number
  pendingHref?: string
}

const toneClasses: Record<AnalyticsTone, string> = {
  default: "text-brand-navy dark:text-white",
  amber: "text-brand-amber-deep dark:text-brand-amber",
  green: "text-emerald-600 dark:text-emerald-400",
}

export function AnalyticsDashboard({
  title,
  heading,
  stats,
  chartTitle,
  chartDescription,
  monthlyBookings,
  pendingCount,
  pendingHref,
}: AnalyticsDashboardProps) {
  const maxValue = Math.max(
    ...monthlyBookings.map((month) => month.value),
    0
  )
  const hasChartData = monthlyBookings.some((month) => month.value > 0)

  return (
    <div className="-m-4 min-h-[calc(100vh-3.5rem)] bg-slate-50 p-4 md:-m-6 md:p-6 dark:bg-[#0a1729]">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <h1 className={heading ? "text-2xl font-bold tracking-tight text-brand-navy dark:text-white" : "sr-only"}>
          {heading ?? title}
        </h1>

        <section
          aria-label={title}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(13,32,55,0.45)] sm:p-7 dark:border-white/10 dark:bg-brand-navy-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight text-brand-navy sm:text-2xl dark:text-white">
                {chartTitle}
              </h2>

              <p className="mt-1.5 text-sm leading-relaxed text-brand-muted dark:text-white/50">
                {chartDescription}
              </p>
            </div>

            {pendingCount !== undefined && pendingHref && pendingCount > 0 && (
              <Link
                href={pendingHref}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-amber-soft px-4 text-xs font-bold text-brand-amber-deep ring-1 ring-brand-amber/20 transition-colors hover:bg-brand-sand/60 focus-visible:ring-3 focus-visible:ring-brand-amber/30 focus-visible:outline-none dark:bg-brand-amber/10 dark:text-brand-amber dark:ring-brand-amber/20 dark:hover:bg-brand-amber/20"
              >
                Review {pendingCount} Pending Listing(s)
                <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            )}
          </div>

          {hasChartData ? (
            <div className="mt-7 overflow-x-auto pb-1">
              <div
                role="img"
                aria-label={`${chartTitle} for the last six months`}
                className="flex min-w-[560px] items-end gap-3 sm:gap-6"
              >
                {monthlyBookings.map((month) => {
                  const height =
                    month.value > 0
                      ? Math.max((month.value / Math.max(maxValue, 1)) * 80, 10)
                      : 2

                  return (
                    <div
                      key={month.key}
                      className="flex flex-1 flex-col items-center"
                    >
                      <div className="flex h-56 w-full items-end justify-center sm:h-64">
                        <div
                          className="relative w-12 rounded-t-2xl bg-brand-navy sm:w-16 dark:bg-brand-amber"
                          style={{ height: `${height}%` }}
                        >
                          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 text-[11px] font-bold whitespace-nowrap text-brand-navy dark:text-white">
                            {formatAnalyticsCurrency(month.value)}
                          </span>
                        </div>
                      </div>

                      <span className="mt-3 text-xs font-medium text-slate-500 dark:text-white/50">
                        {month.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mt-7 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 py-14 text-center dark:border-white/10">
              <span className="flex size-12 items-center justify-center rounded-full bg-brand-amber-soft text-brand-amber-deep dark:bg-brand-amber/10 dark:text-brand-amber">
                <ChartNoAxesColumn aria-hidden className="size-5" />
              </span>
              <p className="mt-3 text-sm font-bold text-brand-navy dark:text-white">
                No booking activity yet
              </p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-brand-muted dark:text-white/50">
                Monthly booking values will appear here once rentals are
                recorded.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({ stat }: { stat: AnalyticsStat }) {
  return (
    <div className="flex min-h-[110px] flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_18px_45px_-38px_rgba(13,32,55,0.45)] sm:p-5 dark:border-white/10 dark:bg-brand-navy-soft">
      <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase sm:text-[11px] dark:text-white/40">
        {stat.label}
      </p>

      <p
        className={cn(
          "mt-3 text-2xl font-bold tracking-tight sm:text-3xl",
          toneClasses[stat.tone ?? "default"]
        )}
      >
        {stat.value}
      </p>
    </div>
  )
}
