import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, PackageX } from "lucide-react"

import { getEquipmentById } from "@/lib/actions/equipments"

import { PaymentForm } from "./_components/payment-form"

export const metadata: Metadata = {
  title: "Complete Reservation & Payment | Equiply",
  description: "Review your equipment rental details and proceed to secure checkout.",
}

type PaymentPageProps = {
  searchParams: Promise<{ equipmentId?: string }>
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { equipmentId } = await searchParams

  const equipment = equipmentId ? await getEquipmentById(equipmentId) : null

  if (!equipment) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center justify-center px-4 py-16">
        <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-md dark:border-white/10 dark:bg-brand-navy-soft">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-amber/10 text-brand-amber-deep dark:text-brand-amber">
            <PackageX className="size-7" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-brand-navy dark:text-white">
            No Equipment Selected
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-white/60">
            Please choose an equipment listing from the marketplace to start your reservation.
          </p>

          <Link
            href="/all-equipment"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-amber px-6 text-xs font-bold tracking-[0.08em] text-brand-navy uppercase transition hover:bg-brand-sand"
          >
            <ArrowLeft className="size-4" />
            Browse All Equipment
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto mb-6 flex max-w-[620px] flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-white/50"
        >
          <Link
            href="/"
            className="transition-colors hover:text-brand-navy dark:hover:text-white"
          >
            Home
          </Link>
          <span className="text-slate-300 dark:text-white/20">/</span>
          <Link
            href="/all-equipment"
            className="transition-colors hover:text-brand-navy dark:hover:text-white"
          >
            All Equipment
          </Link>
          <span className="text-slate-300 dark:text-white/20">/</span>
          <Link
            href={`/all-equipment/${equipment._id}`}
            className="line-clamp-1 max-w-[180px] transition-colors hover:text-brand-navy sm:max-w-xs dark:hover:text-white"
          >
            {equipment.name}
          </Link>
          <span className="text-slate-300 dark:text-white/20">/</span>
          <span className="font-semibold text-brand-navy dark:text-white">
            Reservation &amp; Payment
          </span>
        </nav>

        {/* Dedicated Payment Form Card */}
        <PaymentForm equipment={equipment} />
      </div>
    </main>
  )
}
