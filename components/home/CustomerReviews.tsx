"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const reviews = [
  {
    quote:
      "“Delivered to our trenching site at 7:00 AM sharp with a full tank and spotless hydraulics. Equiply saved us two days of downtime.”",
    author: "Devon Brooks",
    role: "Site Superintendent, Brooks Civil",
    initials: "DB",
    avatarBg: "bg-amber-600",
  },
  {
    quote:
      "“Every battery was at 100% and sensor-checked prior to pickup. Transparent daily rates without hidden studio markups.”",
    author: "Sophia Alvarez",
    role: "Director of Photography",
    initials: "SA",
    avatarBg: "bg-rose-600",
  },
  {
    quote:
      "“Booking took under three minutes with instant Stripe confirmation. Having verified owner ratings makes all the difference.”",
    author: "Liam O'Connor",
    role: "Operations Lead, Heartland Agri",
    initials: "LO",
    avatarBg: "bg-slate-700",
  },
  {
    quote:
      "“Crystal-clear sound across our 3,000-person outdoor venue. The weekly rental pricing structure kept our production well under budget.”",
    author: "Hannah Lindqvist",
    role: "Executive Producer, NordFest",
    initials: "HL",
    avatarBg: "bg-emerald-700",
  },
]

export function CustomerReviews() {
  return (
    <section className="bg-white py-16 sm:py-20 dark:bg-brand-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Star Rating */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber-600 uppercase dark:text-brand-amber">
              VERIFIED RENTER FEEDBACK
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl dark:text-white">
              Trusted By Field Teams Everywhere
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-brand-navy dark:text-white">
              4.9 / 5 Average Rating
            </span>
          </div>
        </motion.div>

        {/* 4 Reviews Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              whileHover={{ y: -3 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-brand-navy-soft"
            >
              <div>
                {/* Top: 5 stars & Verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase dark:bg-emerald-500/10 dark:text-emerald-400">
                    VERIFIED HIRE
                  </span>
                </div>

                {/* Quote */}
                <p className="mt-5 text-xs leading-relaxed text-slate-600 dark:text-white/70">
                  {review.quote}
                </p>
              </div>

              {/* Author row */}
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-white/5">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${review.avatarBg}`}
                >
                  {review.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-bold text-brand-navy dark:text-white">
                    {review.author}
                  </h4>
                  <p className="truncate text-[11px] text-slate-400 dark:text-white/40">
                    {review.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
