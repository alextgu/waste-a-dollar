"use client";

import { motion } from "framer-motion";
import { clipReveal } from "@/lib/animations";

interface HeroProps {
  onDonateClick: () => void;
  totalDonations: number;
}

export default function Hero({ onDonateClick, totalDonations }: HeroProps) {
  const headline = ["You", "were", "going", "to", "waste", "it", "anyway."];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0D0D0D] pb-20 pt-32 text-white">
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-[#FFD600] blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 inline-block border border-[#FFD600] px-4 py-2 text-sm font-medium tracking-wide text-[#FFD600]"
        >
          THE FINANCIALLY RESPONSIBLE CHOICE
        </motion.div>

        <h1
          className="mb-8 text-7xl font-bold leading-none tracking-tight md:text-8xl lg:text-9xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          {headline.map((word, i) => (
            <motion.span
              key={word + i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={clipReveal}
              className="mr-4 inline-block md:mr-6"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: headline.length * 0.1 + 0.3, duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-xl font-light text-gray-300 md:text-2xl"
        >
          One dollar. Donated to Alex. Immediately. This is not a joke.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: headline.length * 0.1 + 0.6,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          className="mb-16 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <motion.button
            onClick={onDonateClick}
            className="bg-[#FFD600] px-8 py-4 text-lg font-medium text-[#0D0D0D] transition-shadow duration-200 hover:shadow-[0_0_30px_rgba(255,214,0,0.5)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Donate $1 Now
          </motion.button>

          <motion.button
            onClick={() =>
              document
                .getElementById("the-case")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-white px-8 py-4 text-lg font-medium text-white transition-colors duration-200 hover:bg-white hover:text-[#0D0D0D]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Learn Why
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: headline.length * 0.1 + 0.9, duration: 0.6 }}
          className="flex flex-col justify-center gap-6 text-sm text-gray-400 sm:flex-row"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFD600]" />
            <span>{totalDonations.toLocaleString()} people have donated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFD600]" />
            <span>You are 1 decision away</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFD600]" />
            <span>Takes 11 seconds</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

