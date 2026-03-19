"use client";

import { AnimatePresence, motion, useInView, Variants } from "framer-motion";
import { useRef, useState } from "react";
import CoinGame from "./CoinGame";

const GREEN = "#00A862";
const BLACK = "#0D0D0D";
const BG    = "#F0EDE8";

interface StillNotConvincedProps {
  onDonateClick: () => void;
}

// ── VARIANTS ──────────────────────────────────────────────────────────────────
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.12 },
  }),
};

// ── GAME ICON ─────────────────────────────────────────────────────────────────
function GameIcon({ type }: { type: "story" | "coin" | "claw" }) {
  return (
    <div style={{
      width: "36px", height: "36px", borderRadius: "9px",
      background: "rgba(0,168,98,0.08)", border: "1px solid rgba(0,168,98,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {type === "story" && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke={GREEN} strokeWidth="1.5"/>
          <line x1="5" y1="6" x2="11" y2="6" stroke={GREEN} strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="5" y1="8.5" x2="9" y2="8.5" stroke={GREEN} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )}
      {type === "coin" && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke={GREEN} strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="2.5" stroke={GREEN} strokeWidth="1"/>
        </svg>
      )}
      {type === "claw" && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="8" y1="1" x2="8" y2="5" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 5 Q3 9 5.5 11" stroke={GREEN} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          <path d="M8 5 Q8 10 8 12" stroke={GREEN} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          <path d="M13 5 Q13 9 10.5 11" stroke={GREEN} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          <line x1="3" y1="5" x2="13" y2="5" stroke={GREEN} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
}

// ── GAME CARD ─────────────────────────────────────────────────────────────────
function GameCard({
  title, description, status, available, icon, index, isInView, onClick,
}: {
  title: string; description: string; status: string;
  available: boolean; icon: "story" | "coin" | "claw";
  index: number; isInView: boolean; onClick: () => void;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={available ? { y: -5, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } } : {}}
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid rgba(13,13,13,0.07)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: available ? "pointer" : "default",
        opacity: available ? 1 : 0.6,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={e => {
        if (!available) return;
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,168,98,0.3)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.07)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(13,13,13,0.07)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <GameIcon type={icon} />

      <div>
        <h3 style={{ fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 900, letterSpacing: "-0.03em", color: BLACK, marginBottom: "6px" }}>
          {title}
        </h3>
        <p style={{ fontSize: "13px", color: "rgba(13,13,13,0.45)", lineHeight: 1.65, fontWeight: 300 }}>
          {description}
        </p>
      </div>

      <div style={{ marginTop: "auto" }}>
        <motion.button
          whileHover={available ? { scale: 1.02 } : {}}
          whileTap={available ? { scale: 0.97 } : {}}
          disabled={!available}
          style={{
            width: "100%",
            padding: "11px 0",
            borderRadius: "100px",
            border: "none",
            fontSize: "13px",
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            cursor: available ? "pointer" : "not-allowed",
            background: available ? BLACK : "rgba(13,13,13,0.05)",
            color: available ? GREEN : "rgba(13,13,13,0.22)",
            letterSpacing: "-0.01em",
          }}
        >
          {status}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function StillNotConvinced({ onDonateClick }: StillNotConvincedProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [showCoinGame, setShowCoinGame] = useState(false);

  const games: {
    title: string; description: string; status: string;
    available: boolean; icon: "story" | "coin" | "claw";
  }[] = [
    {
      title: "Story Mode",
      description: "A short narrative about Alex and the dollar. It is brief. It is dramatic. It may change you.",
      status: "Coming Soon",
      available: false,
      icon: "story",
    },
    {
      title: "Roll the Coin",
      description: "Watch your dollar roll into a donation collector, like at McDonald's. Satisfying. Inevitable.",
      status: "Coming Soon",
      available: false,
      icon: "coin",
    },
    {
      title: "Claw Machine",
      description: "Attempt to win Alex's approval via claw machine. Success not guaranteed. Dollar is still requested.",
      status: "Coming Soon",
      available: false,
      icon: "claw",
    },
  ];

  return (
    <>
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
        {/* top rule */}
        <div style={{ position: "absolute", top: 0, left: "clamp(24px,6vw,80px)", right: "clamp(24px,6vw,80px)", height: "1px", background: "linear-gradient(90deg, transparent, rgba(13,13,13,0.07), transparent)" }} />

        <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto" }}>

          {/* ── Header — two col: title left, blurb right ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "end", marginBottom: "clamp(28px, 4vh, 48px)" }}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GREEN, marginBottom: "12px" }}
              >
                A last resort
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
                style={{ fontSize: "clamp(28px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95, color: BLACK }}
              >
                Fine.{" "}
                <span style={{ color: GREEN }}>Play a game.</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
              style={{ fontSize: "14px", color: "rgba(13,13,13,0.45)", lineHeight: 1.75, fontWeight: 300 }}
            >
              You have read the arguments. You have seen the leaderboard. You have reviewed the evidence.{" "}
              <span style={{ color: BLACK, fontWeight: 500 }}>Still nothing.</span>{" "}
              Fine. We built you three ways to interact with the concept of donating a dollar before you actually do it. Take your time. The dollar will be here.
            </motion.p>
          </div>

          {/* ── Game cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {games.map((game, i) => (
              <GameCard
                key={i}
                index={i}
                isInView={isInView}
                title={game.title}
                description={game.description}
                status={game.status}
                available={game.available}
                icon={game.icon}
                onClick={() => { if (game.available) setShowCoinGame(true); }}
              />
            ))}
          </div>

        </div>
      </section>

      <AnimatePresence>
        {showCoinGame && (
          <CoinGame
            onClose={() => setShowCoinGame(false)}
            onDonateClick={() => { setShowCoinGame(false); onDonateClick(); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
