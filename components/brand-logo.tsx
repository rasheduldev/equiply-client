
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  onClick?: () => void;
};

function CubeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M16 4.5 26.1 10.3v11.4L16 27.5 5.9 21.7V10.3L16 4.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="m5.9 10.3 10.1 5.8 10.1-5.8M16 16.1v11.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandLogo({ className, onClick }: BrandLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Equiply home"
      className={cn(
        "group flex shrink-0 items-center gap-2.5",
        className
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy shadow-md ring-1 ring-black/5 transition-transform group-hover:-translate-y-0.5 dark:bg-brand-navy-soft">
        <CubeMark className="size-6 text-brand-amber" />
      </span>

      <span className="flex flex-col gap-1">
        <span className="text-xl leading-none font-extrabold tracking-[0.14em] text-brand-navy uppercase dark:text-white sm:text-2xl">
          Equiply
        </span>

        <span className="text-[8px] leading-none font-bold tracking-[0.14em] text-brand-amber uppercase sm:text-[10px]">
          Rent smart. Work better.
        </span>
      </span>
    </Link>
  );
}
