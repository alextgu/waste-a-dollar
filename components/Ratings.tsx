"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

const GREEN = "#00A862";
const BLACK = "#0D0D0D";

// ── VARIANTS ──────────────────────────────────────────────────────────────────
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.1 + i * 0.11,
    },
  }),
};

const starVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 18,
      delay: i * 0.07,
    },
  }),
};

// ── STAR ──────────────────────────────────────────────────────────────────────
function Star({ delay, color = GREEN }: { delay: number; color?: string }) {
  return (
    <motion.svg
      custom={delay}
      variants={starVariants}
      width="16" height="16" viewBox="0 0 24 24"
      fill={color}
      style={{ display: "block", flexShrink: 0 }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </motion.svg>
  );
}

// ── RATING SUMMARY ────────────────────────────────────────────────────────────
function RatingSummary({ isInView }: { isInView: boolean }) {
  const bars = [
    { stars: 5, pct: 87 },
    { stars: 4, pct: 10 },
    { stars: 3, pct: 2  },
    { stars: 2, pct: 1  },
    { stars: 1, pct: 0  },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "28px 24px",
        display: "flex",
        gap: "24px",
        alignItems: "center",
        marginBottom: "clamp(24px, 3.5vh, 40px)",
      }}
    >
      {/* Big score */}
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontSize: "clamp(48px, 7vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#fff", lineHeight: 1 }}>
          5.0
        </div>
        <div style={{ display: "flex", gap: "3px", justifyContent: "center", margin: "6px 0 4px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} delay={i} color={GREEN} />
          ))}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>
          4 reviews
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", alignSelf: "stretch", background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />

      {/* Bar chart */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        {bars.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", width: "8px", textAlign: "right", flexShrink: 0 }}>{b.stars}</span>
            <div style={{ flex: 1, height: "4px", borderRadius: "100px", background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                initial={{ width: "0%" }}
                animate={isInView ? { width: `${b.pct}%` } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 + i * 0.06 }}
                style={{ height: "100%", borderRadius: "100px", background: b.pct > 10 ? GREEN : "rgba(255,255,255,0.2)" }}
              />
            </div>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", width: "24px", flexShrink: 0 }}>{b.pct}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── TESTIMONIAL CARD ──────────────────────────────────────────────────────────
function TestimonialCard({
  text, author, stars, isInView, index,
}: {
  text: string; author: string; stars: number; isInView: boolean; index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        cursor: "default",
        transition: "border-color 0.3s ease, background 0.3s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `rgba(0,168,98,0.3)`;
        (e.currentTarget as HTMLElement).style.background = "rgba(0,168,98,0.03)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
      }}
    >
      {/* Stars */}
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ display: "flex", gap: "3px" }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} delay={index * 0.1 + i * 0.07} color={i < stars ? GREEN : "rgba(255,255,255,0.1)"} />
        ))}
      </motion.div>

      {/* Quote */}
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontWeight: 300, flex: 1 }}>
        &ldquo;{text}&rdquo;
      </p>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: `rgba(0,168,98,0.12)`,
          border: `1px solid rgba(0,168,98,0.2)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 700, color: GREEN, flexShrink: 0,
        }}>
          {author[0]}
        </div>
        <span style={{ fontSize: "12px", fontWeight: 600, color: GREEN, letterSpacing: "0.01em" }}>
          {author}
        </span>
        <div style={{ marginLeft: "auto", fontSize: "10px", color: "rgba(255,255,255,0.15)", fontWeight: 400 }}>
          Verified donor
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function Ratings() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const testimonials = [
    { text: "I donated a dollar. I feel fine.",                                           author: "Jordan M.", stars: 5 },
    { text: "It was one dollar. I have more dollars.",                                    author: "Sam K.",    stars: 5 },
    { text: "The certificate arrived as a PDF. It looked official.",                      author: "Chris T.",  stars: 5 },
    { text: "I was going to buy a gumball. I donated instead. Both are gone now.",        author: "Riley P.",  stars: 5 },
  ];

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

        {/* ── Header ── */}
        <div style={{ marginBottom: "clamp(20px, 3vh, 36px)" }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GREEN, marginBottom: "12px" }}
          >
            Social proof
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            style={{ fontSize: "clamp(28px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}
          >
            People have{" "}
            <span style={{ color: GREEN }}>opinions.</span>
          </motion.h2>
        </div>

        {/* ── Rating summary bar ── */}
        <RatingSummary isInView={isInView} />

        {/* ── Testimonial grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              index={i}
              isInView={isInView}
              text={t.text}
              author={t.author}
              stars={t.stars}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
