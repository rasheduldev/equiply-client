
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  onClick?: () => void;
  /** "inverse" renders the treatment used on dark navy surfaces such as the footer. */
  variant?: "default" | "inverse";
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

export function BrandLogo({
  className,
  onClick,
  variant = "default",
}: BrandLogoProps) {
  const inverse = variant === "inverse";

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
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-md ring-1 transition-transform group-hover:-translate-y-0.5",
          inverse
            ? "bg-brand-amber ring-white/10"
            : "bg-brand-navy ring-black/5 dark:bg-brand-navy-soft"
        )}
      >
        <CubeMark
          className={cn(
            "size-6",
            inverse ? "text-brand-navy" : "text-brand-amber"
          )}
        />
      </span>

      <span className="flex flex-col gap-1">
        <span
          className={cn(
            "text-xl leading-none font-extrabold tracking-[0.14em] uppercase sm:text-2xl",
            inverse
              ? "text-white"
              : "text-brand-navy dark:text-white"
          )}
        >
          Equiply
        </span>

        <span className="text-[8px] leading-none font-bold tracking-[0.14em] text-brand-amber uppercase sm:text-[10px]">
          Rent smart. Work better.
        </span>
      </span>
    </Link>
  );
}
