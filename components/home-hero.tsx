import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Search,
  ShieldCheck,
} from "lucide-react";

const categories = [
  "All Categories",
  "Excavators & Earthmoving",
  "Aerial Lifts & Scaffolding",
  "Cinema & Lighting",
  "Trucks & Transport",
  "Event & Staging",
  "Power & Compaction",
];

const assurances = [
  { icon: BadgeCheck, label: "Verified suppliers" },
  { icon: ShieldCheck, label: "Escrow protected" },
];

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-brand-navy"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_12%,rgba(245,166,35,0.16),transparent_55%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#08172a] to-transparent"
      />

      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy */}
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-amber/40 bg-white/5 px-4 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-brand-sand uppercase backdrop-blur-sm sm:text-[11px]">
              <span className="size-1.5 rounded-full bg-brand-amber" />
              Verified commercial rental marketplace
            </span>

            <h1
              id="hero-heading"
              className="mt-6 max-w-[22ch] text-balance text-3xl leading-[1.08] font-extrabold tracking-tight text-white uppercase sm:text-4xl lg:text-5xl xl:text-[3.4rem]"
            >
              Lease the right equipment for your job
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              From the first site question to the final collection, find a
              practical hire plan for the work ahead. Rent verified machinery,
              cinema rigs, vehicles, and event gear with Stripe-escrowed
              protection.
            </p>

            <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href="/equipment"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-brand-amber px-5 py-3.5 text-xs font-bold tracking-[0.12em] whitespace-nowrap text-brand-navy uppercase transition-colors hover:bg-brand-sand focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy focus-visible:outline-none"
              >
                Explore the equipment
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-3.5 text-xs font-bold tracking-[0.12em] whitespace-nowrap text-white uppercase transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy focus-visible:outline-none"
              >
                List your fleet
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-semibold tracking-[0.14em] text-white/55 uppercase sm:text-[11px]">
              {assurances.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon aria-hidden className="size-4 text-brand-amber" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Banner image */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-amber/10 blur-3xl"
            />
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/15">
              <Image
                src="/images/banner_image.jpeg"
                alt="Equiply rental fleet of compact construction and site equipment in the showroom"
                fill
                preload
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-navy/35 via-transparent to-transparent"
              />
            </div>
          </div>
        </div>

        {/* Category + search */}
        <form
          action="/equipment"
          className="mt-10 rounded-2xl bg-white p-2 shadow-2xl shadow-brand-navy/40 ring-1 ring-black/5 sm:mt-12"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1 rounded-lg focus-within:ring-2 focus-within:ring-brand-amber/50 md:ml-1">
              <label htmlFor="equipment-search" className="sr-only">
                Search equipment
              </label>
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted"
              />
              <input
                id="equipment-search"
                name="q"
                type="search"
                placeholder="Search excavators, cameras, trucks..."
                className="h-12 w-full rounded-lg bg-transparent pr-3 pl-10 text-sm text-brand-navy placeholder:text-brand-muted focus-visible:outline-none"
              />
            </div>

            <div className="relative rounded-lg focus-within:ring-2 focus-within:ring-brand-amber/50 md:w-60 md:border-l md:border-slate-200 md:pl-1">
              <label htmlFor="equipment-category" className="sr-only">
                Equipment category
              </label>
              <select
                id="equipment-category"
                name="category"
                defaultValue=""
                className="h-12 w-full appearance-none rounded-lg bg-transparent pr-9 pl-3 text-sm font-semibold text-brand-navy focus-visible:outline-none"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category === "All Categories" ? "" : category}
                  >
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-brand-navy"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-navy px-6 text-xs font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-navy-soft focus-visible:ring-2 focus-visible:ring-brand-amber focus-visible:ring-offset-2 focus-visible:outline-none md:w-auto"
            >
              <Search aria-hidden className="size-4 md:hidden" />
              Search fleet
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
