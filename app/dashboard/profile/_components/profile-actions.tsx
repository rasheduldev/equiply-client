import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type ProfileActionsProps = {
  saving: boolean
}

export function ProfileActions({ saving }: ProfileActionsProps) {
  return (
    <div className="pt-2">
      <Button
        type="submit"
        disabled={saving}
        className="h-12 w-full rounded-lg bg-brand-amber px-8 text-sm font-bold tracking-[0.08em] text-brand-navy uppercase shadow-sm transition hover:bg-brand-sand disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {saving && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {saving ? "Saving..." : "Save Profile Changes"}
      </Button>
    </div>
  )
}
