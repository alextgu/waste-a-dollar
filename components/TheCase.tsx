"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function TheCase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cards = [
    {
      title: "Be in the 99th percentile.",
      body: "Of everyone who has visited this page, only 1% donate. You have the opportunity to be exceptional. Most people are not.",
    },
    {
      title: "Receive an official certificate.",
      body: "Upon donation, you will receive a personalized certificate of contribution. It is real. You may print it. Frame it if you wish.",
    },
    {
      title: "The leaderboard.",
      body: "Your name will appear on a live leaderboard, visible to everyone who visits this page. This is legacy.",
    },
  ];

  return (
    <section id="the-case" className="bg-[#F0EDE8] py-32 text-[#0D0D0D]">
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
            THE ARGUMENT
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-bold tracking-tight md:text-6xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Three reasons this is correct.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="group border border-[rgba(255,214,0,0.15)] bg-[#F0EDE8] transition-all duration-300 hover:border-[#FFD600]"
              whileHover={{ y: -4 }}
            >
              <div className="h-1 bg-[#FFD600]" />
              <div className="p-8">
                <h3
                  className="mb-4 text-2xl font-bold tracking-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {card.title}
                </h3>
                <p className="font-light leading-relaxed text-gray-700">
                  {card.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

