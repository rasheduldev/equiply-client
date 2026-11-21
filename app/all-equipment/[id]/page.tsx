import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getEquipmentById } from "@/lib/actions/equipments"

import { EquipmentBookingSidebar } from "./_components/equipment-booking-sidebar"
import { EquipmentHeroImage } from "./_components/equipment-hero-image"
import { EquipmentOverview } from "./_components/equipment-overview"

type EquipmentDetailsPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: EquipmentDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const equipment = await getEquipmentById(id)

  if (!equipment) {
    return {
      title: "Equipment Not Found | Equiply",
      description: "The requested equipment listing could not be found.",
    }
  }

  return {
    title: `${equipment.name} | Equiply`,
    description: equipment.description || `Rent ${equipment.name} on Equiply.`,
  }
}

export default async function EquipmentDetailsPage({
  params,
}: EquipmentDetailsPageProps) {
  const { id } = await params
  const equipment = await getEquipmentById(id)

  if (!equipment) {
    notFound()
  }

  return (
    <div className="bg-slate-50/60 py-6 sm:py-8 lg:py-10 dark:bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-white/50"
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
          <span className="line-clamp-1 max-w-[280px] font-semibold text-brand-navy sm:max-w-md dark:text-white">
            {equipment.name}
          </span>
        </nav>

        {/* Main 2-Column Responsive Layout Matching Design */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Hero Image + Equipment Overview */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-7">
            <EquipmentHeroImage equipment={equipment} />
            <EquipmentOverview equipment={equipment} />
          </div>

          {/* Right Column: Sticky Booking & Fleet Owner Sidebar Card */}
          <div className="lg:col-span-5 xl:col-span-5">
            <EquipmentBookingSidebar equipment={equipment} />
          </div>
        </div>
      </div>
    </div>
  )
}
