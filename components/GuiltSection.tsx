"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface GuiltSectionProps {
  onDonateClick: () => void;
}

export default function GuiltSection({ onDonateClick }: GuiltSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "$4.50", label: "Average cost of a coffee you didn't need" },
    { value: "$14.99", label: "Your unused streaming subscription" },
    { value: "$1.00", label: "What Alex is asking for", highlight: true },
  ];

  return (
    <section className="flex h-full items-center bg-[#F0EDE8] py-12 text-[#0D0D0D] md:py-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mb-6 text-center md:mb-10"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-sm font-medium tracking-wide text-[#FFD600]"
          >
            CONSIDER THIS
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-3 text-3xl font-bold tracking-tight md:mb-5 md:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            The last time Alex received a donation:
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="text-[clamp(3.25rem,10vw,6rem)] font-bold leading-none text-[#FFD600]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Never.
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mb-6 grid items-center gap-5 md:mb-8 md:grid-cols-2 md:gap-8"
        >
          <motion.div variants={fadeUp} className="space-y-4 md:space-y-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`border p-5 md:p-6 ${
                  stat.highlight
                    ? "border-[#FFD600] bg-[#FFD600] bg-opacity-5"
                    : "border-[rgba(255,214,0,0.15)]"
                }`}
              >
                <div
                  className={`mb-2 text-3xl font-bold md:text-4xl ${
                    stat.highlight ? "text-[#FFD600]" : ""
                  }`}
                >
                  {stat.value}
                </div>
                <div className="font-light text-gray-700">{stat.label}</div>
              </div>
            ))}

            <div className="pt-0">
              <p className="text-base font-light text-gray-800 md:text-xl">
                The math is not complicated.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="hidden aspect-video items-center justify-center border border-[rgba(255,214,0,0.15)] bg-[#F0EDE8] md:flex"
          >
            <div className="px-8 text-center">
              <div className="mb-2 text-sm font-medium text-[#FFD600]">
                COMING SOON
              </div>
              <div className="font-light text-gray-600">
                Emotional cinematic of Alex being sad
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={onDonateClick}
            className="w-full bg-[#FFD600] px-10 py-4 text-lg font-medium text-[#0D0D0D] transition-shadow duration-200 hover:shadow-[0_0_30px_rgba(255,214,0,0.5)] md:w-auto md:px-12 md:py-5 md:text-xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            End This Now. Donate $1.
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

