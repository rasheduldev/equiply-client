"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Discover & Filter Verified Gear",
    description:
      "Filter equipment by category, rental period (daily, weekly, monthly), location, and real-time stock availability.",
  },
  {
    number: "02",
    title: "Book Dates & Pay via Stripe",
    description:
      "Select exact start and end dates, review transparent pricing with damage protection, and checkout securely via Stripe.",
  },
  {
    number: "03",
    title: "On-Site Delivery & Easy Return",
    description:
      "Track your booking status live from your dashboard and coordinate seamless site delivery and scheduled collection.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20 dark:bg-brand-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-3xl bg-[#0c1a2e] p-8 text-white shadow-2xl sm:p-12 lg:p-14"
        >
          {/* Header */}
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber-400 uppercase">
              STREAMLINED 3-STEP WORKFLOW
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              How Equiply Works
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/60">
              Built for project managers, production crews, and fleet operators
              who need reliable gear without paperwork bottlenecks.
            </p>
          </div>

          {/* 3 Steps Grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-sm font-bold text-amber-400">
                  {step.number}
                </div>

                <h3 className="mt-5 text-base font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/60">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
