"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function Ratings() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    { text: "I donated a dollar. I feel fine.", author: "Jordan M." },
    { text: "It was one dollar. I have more dollars.", author: "Sam K." },
    {
      text: "The certificate arrived as a PDF. It looked official.",
      author: "Chris T.",
    },
    {
      text: "I was going to buy a gumball. I donated instead. Both are gone now.",
      author: "Riley P.",
    },
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
            SOCIAL PROOF
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-bold tracking-tight md:text-6xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            People have opinions.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2"
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="group border border-[rgba(255,214,0,0.15)] bg-[#0D0D0D] p-8 transition-all duration-300 hover:border-[#FFD600]"
              whileHover={{ y: -4 }}
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-[#FFD600] text-[#FFD600]"
                  />
                ))}
              </div>
              <p className="mb-4 text-lg font-light leading-relaxed text-gray-300">
                &quot;{t.text}&quot;
              </p>
              <p className="text-sm font-medium text-[#FFD600]">— {t.author}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

