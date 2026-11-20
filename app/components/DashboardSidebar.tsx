import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
const menuItemsByRole = {
    customer:[

    ],
    owner:[

    ],
    admin:[

    ]
}

export function DashboardSidebar() {
    const {data:session} = authClient.useSession()
    const role = session?.user?.role || 'customer'
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {
            // menuItemsByRole[role].map((item) => (
            //   <SidebarMenuItem key={item._id}>
            //     <SidebarMenuButton render={<Link href={item.url} />}>
            //       <project.icon />
            //       <span>{item.name}</span>
            //     </SidebarMenuButton>
            //   </SidebarMenuItem>
            // ))
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
