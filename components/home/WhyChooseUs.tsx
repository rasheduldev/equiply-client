"use client"

import { motion } from "framer-motion"
import { Calendar, CreditCard, ShieldCheck, Zap } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Fleet Owners",
    description:
      "Every equipment owner and listing undergoes strict admin verification and maintenance log checks before going live.",
  },
  {
    icon: Calendar,
    title: "Flexible Hire Periods",
    description:
      "Scale your project effortlessly with transparent Daily, Weekly, and Monthly rental rates tailored to your schedule.",
  },
  {
    icon: CreditCard,
    title: "Stripe Escrowed Security",
    description:
      "Instant PCI-compliant payments with full digital receipts, automated damage protection, and zero surprise surcharges.",
  },
  {
    icon: Zap,
    title: "Rapid Site Dispatch",
    description:
      "Direct delivery coordination to construction sites, film sets, farms, and event venues across major metro hubs.",
  },
]

const stats = [
  { value: "1,450+", label: "VERIFIED FLEET UNITS" },
  { value: "99.2%", label: "ON-TIME SITE DELIVERY" },
  { value: "480+", label: "CERTIFIED FLEET PARTNERS" },
  { value: "$2.0M", label: "ACTIVE RENTAL COVERAGE" },
]

export function WhyChooseUs() {
  return (
    <section className="bg-slate-50/70 py-16 sm:py-20 dark:bg-[#071322]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-xs font-bold tracking-[0.14em] text-amber-600 uppercase dark:text-brand-amber">
            THE EQUIPLY STANDARD
          </p>
          <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl dark:text-white">
            Why Contractors & Creators Choose Equiply
          </h2>
        </motion.div>

        {/* 4 Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={{ y: -3 }}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-brand-navy-soft"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-5 text-base font-bold text-brand-navy dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-white/60">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* 4-Column Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-brand-navy-soft"
        >
          <div className="grid grid-cols-2 gap-6 divide-y divide-slate-100 sm:divide-y-0 sm:divide-x sm:divide-slate-100 lg:grid-cols-4 dark:divide-white/5">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center text-center ${
                  idx > 1 ? "pt-6 sm:pt-0" : ""
                }`}
              >
                <span className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl dark:text-white">
                  {stat.value}
                </span>
                <span className="mt-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-white/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
