"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Why should I give you a dollar?",
      answer: "Because you have one. Alex does not. This is the entire situation.",
    },
    {
      question: "What do I get?",
      answer: "A certificate. Leaderboard placement. The knowledge that you did something today.",
    },
    {
      question: "Is this legitimate?",
      answer: "Yes. It is one dollar. There is nothing to illegitimate.",
    },
    { question: "What if I want my dollar back?", answer: "You don't." },
    {
      question: "What is Alex going to do with the dollar?",
      answer: "Spend it. Probably immediately.",
    },
    {
      question: "Is there a minimum donation?",
      answer: "Yes. One dollar. There is also a maximum. It is one dollar.",
    },
  ];

  return (
    <section className="bg-[#0D0D0D] py-32 text-white">
      <div className="mx-auto max-w-4xl px-6">
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
            FREQUENTLY ASKED QUESTIONS
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-bold tracking-tight md:text-6xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            You have questions. They are reasonable.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="overflow-hidden border border-[rgba(255,214,0,0.15)]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-[rgba(255,214,0,0.05)]"
              >
                <span className="pr-4 text-lg font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-[#FFD600]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#FFD600]" />
                  )}
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[rgba(255,214,0,0.15)] px-6 pb-5 text-gray-400">
                      <div className="pt-5 font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

