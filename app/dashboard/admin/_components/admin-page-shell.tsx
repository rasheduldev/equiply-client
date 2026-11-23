import type { ReactNode } from "react"

type AdminPageShellProps = {
  title: string
  count?: number
  description?: string
  children: ReactNode
}

export function AdminPageShell({
  title,
  count,
  description,
  children,
}: AdminPageShellProps) {
  return (
    <div className="-m-4 min-h-[calc(100vh-3.5rem)] bg-slate-50 p-4 md:-m-6 md:p-6 dark:bg-[#0a1729]">
      <div className="mx-auto w-full max-w-7xl">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-40px_rgba(13,32,55,0.45)] dark:border-white/10 dark:bg-brand-navy-soft">
          <header className="px-5 pt-6 pb-2 sm:px-7 sm:pt-7">
            <h1 className="text-xl font-bold tracking-tight text-brand-navy sm:text-2xl dark:text-white">
              {title}
              {count !== undefined ? ` (${count})` : ""}
            </h1>

            {description && (
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-brand-muted dark:text-white/50">
                {description}
              </p>
            )}
          </header>

          <div className="px-5 pb-6 sm:px-7">{children}</div>
        </section>
      </div>
    </div>
  )
}
