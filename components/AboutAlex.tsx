"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function AboutAlex() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "$0", label: "Amount Alex has in donations right now" },
    { value: "$1", label: "Amount being requested" },
    { value: "100%", label: "Percentage of the dollar that goes to Alex" },
    { value: "0", label: "Hidden fees" },
  ];

  return (
    <section className="bg-[#0D0D0D] py-32 text-white">
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
            ABOUT THE RECIPIENT
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-bold tracking-tight md:text-6xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Alex is a person who needs a dollar.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid items-center gap-12 md:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="space-y-8">
            {stats.map((stat, index) => (
              <div key={index} className="border-l-2 border-[#FFD600] pl-6">
                <div className="mb-2 text-4xl font-bold text-[#FFD600]">
                  {stat.value}
                </div>
                <div className="font-light text-gray-400">{stat.label}</div>
              </div>
            ))}

            <div className="pt-8">
              <p className="text-lg font-light leading-relaxed text-gray-300">
                Alex has demonstrated a consistent pattern of spending money.
                This continues. Your dollar would become part of that pattern.
                This is the opportunity.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex aspect-video items-center justify-center border border-[rgba(255,214,0,0.15)] bg-[#0D0D0D]"
          >
            <div className="px-8 text-center">
              <div className="mb-2 text-sm font-medium text-[#FFD600]">
                COMING SOON
              </div>
              <div className="font-light text-gray-400">
                Cinematic replay of Alex spending money
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

