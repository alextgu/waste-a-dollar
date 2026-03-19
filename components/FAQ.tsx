"use client";

import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import { useRef, useState } from "react";

const GREEN = "#00A862";
const BLACK = "#0D0D0D";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.08 },
  }),
};

const faqs = [
  {
    q: "Is this a legitimate website?",
    a: "Yes. It is a website. It exists on the internet. You are on it right now.",
  },
  {
    q: "Where does the money go?",
    a: "To Alex. Currently there is no processing fee (first 1000 dollars are free for stripe).",
  },
  {
    q: "What do I get in return?",
    a: "Its a donation, but due to Alex's generosity, he will provide you a certificate of where your dollar went in the form of a trading card (emailed directly to you).",
  },
  {
    q: "Is the trading card a real physical card?",
    a: "No. It is a digital certificate, but Alex put a lot of work into it.",
  },
  {
    q: "What if I don't donate?",
    a: "Nothing happens.",
  },
  {
    q: "Why should I trust Alex?",
    a: "IDK, ask him yourself.",
  },
  {
    q: "Can I donate more than $1?",
    a: "Finally a good question. Yes, just customize the amount on stripe.",
  },
  {
    q: "Is there a refund policy?",
    a: "No.",
  },
];

// ── FAQ ITEM ──────────────────────────────────────────────────────────────────
function FAQItem({
  q,
  a,
  index,
  isInView,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  index: number;
  isInView: boolean;
  isOpen: boolean;
  onToggle: (index: number) => void;
}) {

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <button
        onClick={() => onToggle(index)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{
          fontSize: "clamp(14px, 1.6vw, 16px)",
          fontWeight: 600,
          color: isOpen ? "#fff" : "rgba(255,255,255,0.75)",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          fontFamily: "Inter, sans-serif",
          transition: "color 0.25s ease",
        }}>
          {q}
        </span>

        {/* Plus / minus icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "28px", height: "28px", flexShrink: 0,
            borderRadius: "50%",
            border: `1px solid ${isOpen ? GREEN : "rgba(255,255,255,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "border-color 0.25s ease",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="5" y1="0" x2="5" y2="10" stroke={isOpen ? GREEN : "rgba(255,255,255,0.5)"} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.25s ease" }} />
            <line x1="0" y1="5" x2="10" y2="5" stroke={isOpen ? GREEN : "rgba(255,255,255,0.5)"} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.25s ease" }} />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.75,
              fontWeight: 300,
              paddingBottom: "20px",
              fontFamily: "Inter, sans-serif",
              maxWidth: "680px",
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={ref}
      style={{
        background: BLACK,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        padding: "0 clamp(24px, 6vw, 80px)",
      }}
    >
      <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "clamp(40px, 6vw, 96px)", alignItems: "start" }}>

          {/* ── Left: sticky header ── */}
          <div style={{ position: "sticky", top: 0 }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GREEN, marginBottom: "14px" }}
            >
              FAQ
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff", marginBottom: "20px" }}
            >
              Questions<br />
              <span style={{ color: GREEN }}>answered.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: 1.7, fontWeight: 300 }}
            >
              Not sure why you&apos;re here, its just a dollar, but here are some answers.
            </motion.p>
          </div>

          {/* ── Right: accordion ── */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                q={faq.q}
                a={faq.a}
                index={i}
                isInView={isInView}
                isOpen={openIndex === i}
                onToggle={toggle}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
