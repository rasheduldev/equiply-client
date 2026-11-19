import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

const marketplaceLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Equipment Categories", href: "/equipment#categories" },
];

const categoryLinks = [
  "Excavators & Earthmoving",
  "Cinema & Lighting",
  "Trucks & Transport",
  "Event & Staging",
].map((category) => ({
  label: category,
  href: `/equipment?category=${encodeURIComponent(category)}`,
}));

const platformLinks = [
  { label: "User & Fleet Dashboard", href: "/dashboard" },
  { label: "Partner Owner Portal", href: "/dashboard" },
  { label: "Test 404 / Error Page", href: "/test-404" },
];

const legalLinks = [
  { label: "Terms of Hire", href: "/terms" },
  { label: "Insurance Coverage", href: "/insurance" },
  { label: "Privacy Policy", href: "/privacy" },
];

const socialLinks = [
  { label: "Equiply on X", href: "https://x.com", icon: XIcon },
  { label: "Equiply on LinkedIn", href: "https://linkedin.com", icon: LinkedInIcon },
  { label: "Equiply on GitHub", href: "https://github.com", icon: GitHubIcon },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

type FooterColumnProps = {
  title: string;
  links: { label: string; href: string }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-xs font-bold tracking-[0.14em] text-white uppercase">
        {title}
      </h2>

      <ul className="mt-5 space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-brand-amber"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-12 pb-6 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Brand */}
          <div className="sm:col-span-3 lg:col-span-1">
            <BrandLogo variant="inverse" />

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              The transparent commercial equipment rental marketplace
              connecting verified fleet owners with contractors, creators, and
              businesses.
            </p>

            <ul className="mt-6 flex items-center gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white/75 ring-1 ring-white/10 transition-colors hover:bg-brand-amber hover:text-brand-navy hover:ring-brand-amber"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title="Marketplace" links={marketplaceLinks} />
          <FooterColumn title="Top Categories" links={categoryLinks} />

          {/* Platform & Trust */}
          <div>
            <h2 className="text-xs font-bold tracking-[0.14em] text-white uppercase">
              Platform &amp; Trust
            </h2>

            <ul className="mt-5 space-y-4">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-brand-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li className="flex items-start gap-2 text-sm font-medium text-emerald-400">
                <span
                  aria-hidden
                  className="mt-[7px] size-2 shrink-0 rounded-full bg-emerald-400"
                />
                Stripe PCI-DSS Escrowed Payments Active
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[13px] text-white/45">
            &copy; 2026 Equiply Equipment Rental Marketplace. All rights
            reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:justify-end">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[13px] text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
