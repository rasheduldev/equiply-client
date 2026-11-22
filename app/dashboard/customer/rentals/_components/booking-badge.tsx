import { cn } from "@/lib/utils"

import type { BadgeConfig } from "../_lib/types"

type BookingBadgeProps = {
  badge: BadgeConfig
}

export function BookingBadge({ badge }: BookingBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        badge.className
      )}
    >
      {badge.label}
    </span>
  )
}
