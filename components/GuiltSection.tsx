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
    <section className="bg-[#F0EDE8] py-32 text-[#0D0D0D]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-sm font-medium tracking-wide text-[#FFD600]"
          >
            CONSIDER THIS
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-8 text-5xl font-bold tracking-tight md:text-6xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            The last time Alex received a donation:
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mb-16 text-8xl font-bold text-[#FFD600] md:text-9xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Never.
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mb-16 grid items-center gap-12 md:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="space-y-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`border p-6 ${
                  stat.highlight
                    ? "border-[#FFD600] bg-[#FFD600] bg-opacity-5"
                    : "border-[rgba(255,214,0,0.15)]"
                }`}
              >
                <div
                  className={`mb-2 text-4xl font-bold ${
                    stat.highlight ? "text-[#FFD600]" : ""
                  }`}
                >
                  {stat.value}
                </div>
                <div className="font-light text-gray-700">{stat.label}</div>
              </div>
            ))}

            <div className="pt-4">
              <p className="text-xl font-light text-gray-800">
                The math is not complicated.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex aspect-video items-center justify-center border border-[rgba(255,214,0,0.15)] bg-[#F0EDE8]"
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
            className="w-full bg-[#FFD600] px-12 py-5 text-xl font-medium text-[#0D0D0D] transition-shadow duration-200 hover:shadow-[0_0_30px_rgba(255,214,0,0.5)] md:w-auto"
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

