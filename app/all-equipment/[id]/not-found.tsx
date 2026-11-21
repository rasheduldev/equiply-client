import Link from "next/link"
import { ArrowLeft, PackageX } from "lucide-react"

export default function EquipmentNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-md dark:border-white/10 dark:bg-brand-navy-soft">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-amber/10 text-brand-amber-deep dark:text-brand-amber">
          <PackageX className="size-7" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-brand-navy dark:text-white">
          Equipment Not Found
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-white/60">
          The equipment listing you are looking for does not exist or may have been removed.
        </p>

        <Link
          href="/all-equipment"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-amber px-5 text-xs font-bold tracking-[0.08em] text-brand-navy uppercase transition hover:bg-brand-sand"
        >
          <ArrowLeft className="size-4" />
          Browse All Equipment
        </Link>
      </div>
    </div>
  )
}
