"use client";

import { motion, useInView, useAnimation, Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const GREEN = "#00A862";

// ── SCOREBOARD FLIP ───────────────────────────────────────────────────────────
const flipVariants: Variants = {
  hidden: {
    rotateX: -90,
    opacity: 0,
    transformOrigin: "top center",
  },
  visible: (i: number) => ({
    rotateX: 0,
    opacity: 1,
    transformOrigin: "top center",
    transition: {
      rotateX: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.15 },
      opacity:  { duration: 0.01, delay: 0.2 + i * 0.15 },
    },
  }),
};

// ── VHS SNAP ──────────────────────────────────────────────────────────────────
const vhsVariants: Variants = {
  hidden: {
    scaleY: 0.04,
    scaleX: 1.1,
    filter: "blur(6px)",
    opacity: 0.5,
  },
  visible: {
    scaleY: 1,
    scaleX: 1,
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const glitch1Variants: Variants = {
  hidden: { top: "15%", opacity: 0 },
  visible: {
    top: ["15%", "55%", "55%"],
    opacity: [0.9, 0.3, 0],
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const glitch2Variants: Variants = {
  hidden: { top: "75%", opacity: 0 },
  visible: {
    top: ["75%", "35%", "35%"],
    opacity: [0.7, 0.2, 0],
    transition: { duration: 0.6, ease: "easeOut", delay: 0.05 },
  },
};

// ── TIMECODE ──────────────────────────────────────────────────────────────────
function Timecode() {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    let f = 0;
    const id = setInterval(() => {
      f++;
      const fr = f % 30;
      const s  = Math.floor(f / 30) % 60;
      const m  = Math.floor(f / 1800) % 60;
      setTc(`00:0${m}:${String(s).padStart(2, "0")}:${String(fr).padStart(2, "0")}`);
    }, 33);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.06em", color: "rgba(0,168,98,0.55)" }}>
      {tc}
    </span>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function AboutAlex() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const stats = [
    { value: "$0",    label: "Amount Alex has in donations right now" },
    { value: "$1",    label: "Amount being requested"                 },
    { value: "100%",  label: "Percentage of the dollar that goes to Alex" },
    { value: "0",     label: "Hidden fees"                            },
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0D0D0D",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "clamp(16px, 2.5vh, 28px)" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GREEN, marginBottom: "12px" }}
          >
            About the recipient
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            style={{ fontSize: "clamp(28px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}
          >
            Alex is a person who{" "}
            <span style={{ color: GREEN }}>needs a dollar.</span>
          </motion.h2>
        </motion.div>

        {/* ── Video — full width hero ── */}
        <div style={{ perspective: "800px", marginBottom: "clamp(16px, 2.5vh, 28px)" }}>
          <motion.div
            variants={vhsVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{
              border: "1px solid rgba(0,168,98,0.2)",
              borderRadius: "12px",
              overflow: "hidden",
              aspectRatio: "16/7",
              background: "#0a0a0a",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Glitch lines */}
            <motion.div variants={glitch1Variants} initial="hidden" animate={isInView ? "visible" : "hidden"}
              style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "rgba(0,168,98,0.7)", pointerEvents: "none", zIndex: 10 }} />
            <motion.div variants={glitch2Variants} initial="hidden" animate={isInView ? "visible" : "hidden"}
              style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "rgba(0,168,98,0.5)", pointerEvents: "none", zIndex: 10 }} />

            {/* Scanline */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "rgba(0,168,98,0.35)", animation: "scanline 4s linear infinite", pointerEvents: "none", zIndex: 5 }} />

            {/* Vignette */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none", zIndex: 4 }} />

            {/* Content */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", zIndex: 3 }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "1.5px solid rgba(0,168,98,0.5)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 2.4s ease-in-out infinite" }}>
                <div style={{ width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: `18px solid ${GREEN}`, marginLeft: "4px" }} />
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GREEN }}>Coming soon</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.6 }}>
                Cinematic replay of Alex spending money
              </div>
            </div>

            {/* Timecode */}
            <div style={{ position: "absolute", bottom: "12px", left: "16px", zIndex: 6 }}><Timecode /></div>

            {/* REC badge */}
            <div style={{ position: "absolute", top: "12px", right: "16px", display: "flex", alignItems: "center", gap: "5px", zIndex: 6 }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff3b30", animation: "blink 1.2s ease-in-out infinite" }} />
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)" }}>REC</span>
            </div>

            {/* Progress bar */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.06)", zIndex: 6 }}>
              <div style={{ height: "100%", background: GREEN, animation: "progress 10s linear infinite" }} />
            </div>
          </motion.div>

          {/* Caption */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: GREEN, flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: 400, letterSpacing: "0.01em" }}>
              Where your money is going towards
            </span>
          </motion.div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0" }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={flipVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              style={{
                borderLeft: `2px solid ${i === 0 ? GREEN : "rgba(0,168,98,0.2)"}`,
                paddingLeft: "20px",
                paddingTop: "12px",
                paddingBottom: "12px",
                paddingRight: "16px",
                perspective: "600px",
              }}
            >
              <div style={{ fontSize: "clamp(20px, 2.5vw, 30px)", fontWeight: 900, color: GREEN, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "4px" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 400, lineHeight: 1.4 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scanline { from { top: 0; } to { top: 100%; } }
        @keyframes pulse    { 0%,100% { border-color: rgba(0,168,98,0.3); } 50% { border-color: rgba(0,168,98,0.9); } }
        @keyframes blink    { 0%,100% { opacity: 1; } 50% { opacity: 0.1; } }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </section>
  );
}
