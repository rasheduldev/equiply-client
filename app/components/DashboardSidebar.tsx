
"use client"

import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import {
  Boxes,
  ClipboardList,
  Heart,
  LayoutDashboard,
  PackagePlus,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { BrandLogo } from "@/components/brand-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export type MenuItem = {
  _id: string
  name: string
  url: string
  icon: LucideIcon
}

type Role = "customer" | "owner" | "admin"

const menuItemsByRole: Record<Role, MenuItem[]> = {
  customer: [
    {
      _id: "customer-rentals",
      name: "My Rentals",
      url: "/dashboard/customer/rentals",
      icon: ClipboardList,
    },
    {
      _id: "customer-favorites",
      name: "Favorites",
      url: "/dashboard/customer/favorites",
      icon: Heart,
    },
    {
      _id: "customer-profile",
      name: "Profile",
      url: "/dashboard/customer/profile",
      icon: UserRound,
    },
  ],
  owner: [
    {
      _id: "owner-analytics",
      name: "Business Analytics",
      url: "/dashboard/owner",
      icon: LayoutDashboard,
    },
    {
      _id: "owner-add-equipment",
      name: "Add Equipment",
      url: "/dashboard/owner/add-equipment",
      icon: PackagePlus,
    },
    {
      _id: "owner-equipment",
      name: "My Equipment",
      url: "/dashboard/owner/my-equipment",
      icon: Boxes,
    },
    {
      _id: "owner-rentals",
      name: "My Equipment Rentals",
      url: "/dashboard/owner/rentals",
      icon: ClipboardList,
    },
    {
      _id: "owner-profile",
      name: "My Profile",
      url: "/dashboard/owner/profile",
      icon: UserRound,
    },
  ],
  admin: [
    {
      _id: "admin-analytics",
      name: "Platform Analytics",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      _id: "admin-users",
      name: "All Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      _id: "admin-equipment",
      name: "All Equipment",
      url: "/dashboard/admin/equipment",
      icon: Boxes,
    },
    {
      _id: "admin-rentals",
      name: "All Rentals",
      url: "/dashboard/admin/rentals",
      icon: ClipboardList,
    },
    {
      _id: "admin-profile",
      name: "My Profile",
      url: "/dashboard/admin/profile",
      icon: ShieldCheck,
    },
  ],
}

const roleLabels: Record<Role, string> = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
}

function isRole(value: unknown): value is Role {
  return value === "customer" || value === "owner" || value === "admin"
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const { data: session } = authClient.useSession()

  const role: Role = isRole(session?.user?.role) ? session.user.role : "customer"

  const displayName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "Equiply member"

  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  const profileUrl = `/dashboard/${role}/${role === "customer" ? "profile" : "profile"}`

  const isActive = (url: string) => {
    const cleanPath = pathname?.replace(/\/$/, "") || ""
    const cleanUrl = url.replace(/\/$/, "")

    if (
      cleanUrl === "/dashboard/admin" ||
      cleanUrl === "/dashboard/owner" ||
      cleanUrl === "/dashboard/customer"
    ) {
      return cleanPath === cleanUrl
    }

    return cleanPath === cleanUrl || cleanPath.startsWith(`${cleanUrl}/`)
  }

  return (
    <Sidebar collapsible="icon" className="border-white/10">
      <div className="flex h-full w-full flex-col bg-brand-navy text-white [--sidebar:var(--color-brand-navy)] [--sidebar-accent:var(--color-brand-amber)] [--sidebar-accent-foreground:var(--color-brand-navy)] [--sidebar-border:rgb(255_255_255_/_0.12)] [--sidebar-foreground:white] [--sidebar-ring:var(--color-brand-amber)]">

        <SidebarHeader className="border-b border-white/10 p-3 group-data-[collapsible=icon]:p-1.5">
          <BrandLogo
            variant="inverse"
            className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>span:first-child]:size-9 group-data-[collapsible=icon]:[&>span:last-child]:hidden"
          />

          <Link
            href={profileUrl}
            onClick={() => {
              if (isMobile) setOpenMobile(false)
            }}
            className="mt-3 flex items-center gap-3 rounded-xl bg-white/5 p-2.5 ring-1 ring-white/10 transition-colors hover:bg-white/10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1.5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-navy-soft text-xs font-bold text-white ring-2 ring-brand-amber group-data-[collapsible=icon]:size-8">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={displayName}
                  width={36}
                  height={36}
                  unoptimized
                  referrerPolicy="no-referrer"
                  className="size-full object-cover"
                />
              ) : (
                initials || "E"
              )}
            </span>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-white">
                {displayName}
              </p>
              <p className="truncate text-[10px] font-bold tracking-[0.14em] text-brand-amber uppercase">
                {roleLabels[role]}
              </p>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="pt-3">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase">
              {roleLabels[role]} menu
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {menuItemsByRole[role].map((item) => {
                  const active = isActive(item.url)

                  return (
                    <SidebarMenuItem key={item._id}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.name}
                        render={
                          <Link
                            href={item.url}
                            aria-current={active ? "page" : undefined}
                            onClick={() => {
                              if (isMobile) setOpenMobile(false)
                            }}
                          />
                        }
                        className={cn(
                          "h-10 gap-3 rounded-lg px-3 text-sm font-semibold text-white/70",
                          !active && "hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <item.icon strokeWidth={1.9} />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 p-3 group-data-[collapsible=icon]:p-2">
        </SidebarFooter>
      </div>

      <SidebarRail />
    </Sidebar>
  )
}
