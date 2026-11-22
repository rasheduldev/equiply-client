import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function PaymentLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <div className="flex-1 bg-slate-50/60 dark:bg-background">{children}</div>

      <SiteFooter />
    </div>
  )
}
