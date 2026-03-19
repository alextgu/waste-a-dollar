"use client";

import { AnimatePresence, motion, useInView, Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const GREEN = "#00A862";
const BLACK = "#0D0D0D";
const BG    = "#F0EDE8";
const COUNTER_START_MS = (() => {
  const raw = process.env.NEXT_PUBLIC_COUNTER_START_ISO;
  const ts = typeof raw === "string" ? Date.parse(raw) : NaN;
  // Fallback: Mar 18, 2026 UTC (keeps counter running even if unset)
  return Number.isFinite(ts) ? ts : Date.UTC(2026, 2, 18, 0, 0, 0);
})();

// ── SCOREBOARD FLIP ───────────────────────────────────────────────────────────
const flipVariants: Variants = {
  hidden: { rotateX: -90, opacity: 0, transformOrigin: "top center" },
  visible: (i: number) => ({
    rotateX: 0,
    opacity: 1,
    transformOrigin: "top center",
    transition: {
      rotateX: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.15 },
      opacity:  { duration: 0.01, delay: 0.25 + i * 0.15 },
    },
  }),
};

// ── DIAGONAL SKEW-IN ──────────────────────────────────────────────────────────
const diagonalVariants: Variants = {
  hidden: { skewX: 18, x: 40, opacity: 0, filter: "blur(6px)" },
  visible: {
    skewX: 0,
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
  },
};

const glitch1: Variants = {
  hidden: { top: "15%", opacity: 0 },
  visible: {
    top: ["15%", "55%", "55%"],
    opacity: [0.8, 0.3, 0],
    transition: { duration: 0.55, ease: "easeOut", delay: 0.35 },
  },
};

const glitch2: Variants = {
  hidden: { top: "72%", opacity: 0 },
  visible: {
    top: ["72%", "32%", "32%"],
    opacity: [0.6, 0.2, 0],
    transition: { duration: 0.55, ease: "easeOut", delay: 0.42 },
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
    <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)" }}>
      {tc}
    </span>
  );
}

// ── DIAGONAL VIDEO FRAME ──────────────────────────────────────────────────────
function DiagonalVideoFrame({ isInView }: { isInView: boolean }) {
  const clip = "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <motion.div
        variants={diagonalVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        {/* Green halo */}
        <div style={{
          position: "absolute", inset: "-3px",
          clipPath: clip,
          background: "rgba(0,168,98,0.1)",
          zIndex: 0,
        }} />

        {/* Frame */}
        <div style={{
          width: "100%", height: "100%",
          clipPath: clip,
          background: "#111",
          position: "relative",
          overflow: "hidden",
          zIndex: 1,
        }}>
          {/* Glitch lines */}
          <motion.div variants={glitch1} initial="hidden" animate={isInView ? "visible" : "hidden"}
            style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "rgba(0,168,98,0.65)", zIndex: 10, pointerEvents: "none" }} />
          <motion.div variants={glitch2} initial="hidden" animate={isInView ? "visible" : "hidden"}
            style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "rgba(0,168,98,0.4)", zIndex: 10, pointerEvents: "none" }} />

          {/* Scanline */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "1px",
            background: "rgba(0,168,98,0.18)",
            animation: "scanline 5s linear infinite",
            zIndex: 5, pointerEvents: "none",
          }} />

          {/* Vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.8) 100%)",
            zIndex: 4, pointerEvents: "none",
          }} />

          {/* Content */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "12px",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              border: "1.5px solid rgba(0,168,98,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "pulse 2.4s ease-in-out infinite",
            }}>
              <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: `16px solid ${GREEN}`, marginLeft: "3px" }} />
            </div>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: GREEN }}>
              Coming soon
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)", textAlign: "center", lineHeight: 1.6, padding: "0 32px" }}>
              Emotional cinematic of<br />Alex being sad
            </div>
          </div>

          {/* Timecode */}
          <div style={{ position: "absolute", bottom: "12px", left: "28px", zIndex: 6 }}>
            <Timecode />
          </div>

          {/* REC */}
          <div style={{ position: "absolute", top: "12px", right: "28px", display: "flex", alignItems: "center", gap: "5px", zIndex: 6 }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#ff3b30", animation: "blink 1.2s ease-in-out infinite" }} />
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)" }}>REC</span>
          </div>

          {/* Progress */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.06)", zIndex: 6 }}>
            <div style={{ height: "100%", background: GREEN, animation: "progress 10s linear infinite" }} />
          </div>
        </div>
      </motion.div>

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
        style={{ marginTop: "14px", paddingLeft: "20%", display: "flex", alignItems: "center", gap: "7px" }}
      >
        <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: GREEN, flexShrink: 0 }} />
        <span style={{ fontSize: "11px", color: "rgba(13,13,13,0.35)", fontWeight: 400 }}>
          Please please please please please please please
        </span>
      </motion.div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
interface GuiltSectionProps {
  onDonateClick: () => void;
}

export default function GuiltSection({ onDonateClick }: GuiltSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [latestDonationAt, setLatestDonationAt] = useState<number | null>(null);
  const [sinceMs, setSinceMs] = useState<number>(0);
  const [sinceLabel, setSinceLabel] = useState<"since-last" | "since-start">(
    "since-start"
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/api/donations/latest", { cache: "no-store" });
        const json = (await res.json()) as { created_at?: unknown };
        const ts =
          typeof json.created_at === "string"
            ? Date.parse(json.created_at)
            : NaN;
        if (!cancelled) {
          const next = Number.isFinite(ts) ? ts : null;
          setLatestDonationAt((prev) => (prev === next ? prev : next));
        }
      } catch (e) {
        console.error("Failed to fetch latest donation:", e);
        if (!cancelled) setLatestDonationAt(null);
      }
    };
    void run();
    // Poll for new donations so the counter resets without a refresh.
    const pollId = setInterval(() => void run(), 10_000);
    return () => {
      cancelled = true;
      clearInterval(pollId);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const base = latestDonationAt ?? COUNTER_START_MS;
      setSinceLabel(latestDonationAt == null ? "since-start" : "since-last");
      setSinceMs(Math.max(0, Date.now() - base));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [latestDonationAt]);

  const fmt = (() => {
    const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
    if (sinceMs >= YEAR_MS) return `${(sinceMs / YEAR_MS).toFixed(2)}y`;

    const totalSeconds = Math.floor(sinceMs / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    return days > 0 ? `${days}d ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
  })();

  const rotatingBadPurchases = [
    { value: "$4.50", label: "Expensive coffee that you could have made at home" },
    { value: "$14.99", label: "Streaming subscription you forgot existed" },
    { value: "$22.50", label: "Uber Eats delivery fees on a $12 meal" },
    { value: "$30.00", label: "Gym membership that you never use" },
    { value: "$65.00", label: "That Costco Membership" },
    { value: "$12.00", label: "Expired fruits in your fridge" },
    { value: "$45.00", label: "Fast fashion for that one holiday party"},
    { value: "$19.99", label: "Hardcover book that looks smart but remains unread" },
    { value: "$85.00", label: "Supplies for a craft hobby you abandoned on day two" },
    { value: "$3.00", label: "Plastic water bottles..."},
    { value: "$15.00", label: "Late fee for a bill you actually had the money to pay" },
    { value: "$60.00", label: "New video game you played for exactly 42 minutes" },
    { value: "$4.99", label: "In-app currency for a game you deleted a week later" },
    { value: "$Too much", label: "Rounds of drinks for people you don't even really like" },
    { value: "$18.00", label: "Airport sandwich that tasted like cardboard" }
  ] as const;

  const fixedDollar = {
    value: "$1.00",
    label: "What Alex is asking for",
    highlight: true as const,
  };

  const [rotA, setRotA] = useState(0);
  const [rotB, setRotB] = useState(1);
  const [rotTurn, setRotTurn] = useState<"a" | "b">("a");

  useEffect(() => {
    const id = setInterval(() => {
      if (rotTurn === "a") {
        setRotA((prev) => {
          const next = (prev + 1) % rotatingBadPurchases.length;
          return next === rotB ? (next + 1) % rotatingBadPurchases.length : next;
        });
        setRotTurn("b");
      } else {
        setRotB((prev) => {
          const next = (prev + 1) % rotatingBadPurchases.length;
          return next === rotA ? (next + 1) % rotatingBadPurchases.length : next;
        });
        setRotTurn("a");
      }
    }, 1300);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotA, rotB, rotTurn]);

  const rotItemA = rotatingBadPurchases[rotA] ?? rotatingBadPurchases[0];
  const rotItemB = rotatingBadPurchases[rotB] ?? rotatingBadPurchases[1] ?? rotatingBadPurchases[0];

  return (
    <section
      ref={ref}
      style={{
        background: BG,
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
      {/* Subtle top rule */}
      <div style={{ position: "absolute", top: 0, left: "clamp(24px,6vw,80px)", right: "clamp(24px,6vw,80px)", height: "1px", background: `linear-gradient(90deg, transparent, rgba(13,13,13,0.07), transparent)` }} />

      <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }}>

          {/* ── Left ── */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GREEN, marginBottom: "14px" }}
            >
              Alex is sad.
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
              style={{ fontSize: "clamp(22px, 3.5vw, 44px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, color: BLACK, marginBottom: "10px" }}
            >
              The last time Alex<br />received a donation:
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{ fontSize: "clamp(48px, 8vw, 88px)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1, color: GREEN, marginBottom: "clamp(20px, 3vh, 32px)" }}
            >
              {fmt}
            </motion.div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "clamp(18px, 2.5vh, 28px)",
              }}
            >
              {/* Rotating bad purchase A */}
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={rotItemA.label}
                  custom={0}
                  variants={flipVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  exit={{
                    opacity: 0,
                    rotateX: 40,
                    transition: { duration: 0.25, ease: "easeOut" },
                  }}
                  style={{
                    position: "relative",
                    perspective: "600px",
                    borderLeft: `2px solid rgba(13,13,13,0.1)`,
                    background: "transparent",
                    paddingLeft: "18px",
                    paddingTop: "11px",
                    paddingBottom: "11px",
                    paddingRight: "12px",
                    borderBottom: "1px solid rgba(13,13,13,0.06)",
                  }}
                >
                  {/* Strikethrough on exit only */}
                  <motion.div
                    style={{
                      position: "absolute",
                      left: "14px",
                      right: "12px",
                      top: "50%",
                      height: "2px",
                      background: "rgba(13,13,13,0.25)",
                      transformOrigin: "left center",
                      borderRadius: "999px",
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 0, opacity: 0 }}
                    exit={{
                      scaleX: 1,
                      opacity: 1,
                      transition: { duration: 0.28, ease: "easeOut" },
                    }}
                  />

                  <div
                    style={{
                      fontSize: "clamp(18px, 2.2vw, 26px)",
                      fontWeight: 900,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      marginBottom: "3px",
                      color: BLACK,
                    }}
                  >
                    {rotItemA.value}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(13,13,13,0.4)",
                      fontWeight: 400,
                      lineHeight: 1.4,
                    }}
                  >
                    {rotItemA.label}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Rotating bad purchase B */}
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={rotItemB.label}
                  custom={1}
                  variants={flipVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  exit={{
                    opacity: 0,
                    rotateX: 40,
                    transition: { duration: 0.25, ease: "easeOut" },
                  }}
                  style={{
                    position: "relative",
                    perspective: "600px",
                    borderLeft: `2px solid rgba(13,13,13,0.1)`,
                    background: "transparent",
                    paddingLeft: "18px",
                    paddingTop: "11px",
                    paddingBottom: "11px",
                    paddingRight: "12px",
                    borderBottom: "1px solid rgba(13,13,13,0.06)",
                  }}
                >
                  {/* Strikethrough on exit only */}
                  <motion.div
                    style={{
                      position: "absolute",
                      left: "14px",
                      right: "12px",
                      top: "50%",
                      height: "2px",
                      background: "rgba(13,13,13,0.25)",
                      transformOrigin: "left center",
                      borderRadius: "999px",
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 0, opacity: 0 }}
                    exit={{
                      scaleX: 1,
                      opacity: 1,
                      transition: { duration: 0.28, ease: "easeOut" },
                    }}
                  />

                  <div
                    style={{
                      fontSize: "clamp(18px, 2.2vw, 26px)",
                      fontWeight: 900,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      marginBottom: "3px",
                      color: BLACK,
                    }}
                  >
                    {rotItemB.value}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(13,13,13,0.4)",
                      fontWeight: 400,
                      lineHeight: 1.4,
                    }}
                  >
                    {rotItemB.label}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Fixed $1 card (always visible) */}
              <motion.div
                custom={2}
                variants={flipVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{
                  perspective: "600px",
                  borderLeft: `2px solid ${fixedDollar.highlight ? GREEN : "rgba(13,13,13,0.1)"}`,
                  background: fixedDollar.highlight
                    ? "rgba(0,168,98,0.05)"
                    : "transparent",
                  paddingLeft: "18px",
                  paddingTop: "11px",
                  paddingBottom: "11px",
                  paddingRight: "12px",
                  borderBottom: "none",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(18px, 2.2vw, 26px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: "3px",
                    color: fixedDollar.highlight ? GREEN : BLACK,
                  }}
                >
                  {fixedDollar.value}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(13,13,13,0.4)",
                    fontWeight: 400,
                    lineHeight: 1.4,
                  }}
                >
                  {fixedDollar.label}
                </div>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
            >
              <motion.button
                onClick={onDonateClick}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "15px 38px",
                  borderRadius: "100px",
                  background: BLACK,
                  color: GREEN,
                  border: "1px solid rgba(0,168,98,0.25)",
                  fontSize: "15px",
                  fontWeight: 800,
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  transition: "box-shadow 0.3s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 32px rgba(0,168,98,0.18)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                End this now. Donate $1.
              </motion.button>
            </motion.div>
          </div>

          {/* ── Right: diagonal video ── */}
          <div style={{ height: "clamp(300px, 52vh, 500px)" }}>
            <DiagonalVideoFrame isInView={isInView} />
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scanline { from { top: 0; } to { top: 100%; } }
        @keyframes pulse    { 0%,100% { border-color: rgba(0,168,98,0.3); } 50% { border-color: rgba(0,168,98,0.85); } }
        @keyframes blink    { 0%,100% { opacity: 1; } 50% { opacity: 0.1; } }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </section>
  );
}
