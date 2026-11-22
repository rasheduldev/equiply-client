import Link from "next/link"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FavoritesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400">
        <Heart className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-bold text-brand-navy dark:text-white">
        No favorite equipment yet
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-white/60">
        Save equipment you like from the marketplace and it will show up here
        for quick access.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/all-equipment" />}
        className="mt-6 rounded-lg bg-brand-amber font-semibold text-brand-navy hover:bg-brand-amber/90"
      >
        <Heart className="mr-2 h-4 w-4" />
        Browse Equipment
      </Button>
    </div>
  )
}
