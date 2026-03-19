"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const GREEN = "#00A862";
const BLACK = "#0D0D0D";

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  rank: number;
  name: string;
  created_at: string;
  placeholder?: boolean;
}

// ── VARIANTS ──────────────────────────────────────────────────────────────────
const rowVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.07 },
  }),
};

// ── RANK BADGE ────────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  const base: React.CSSProperties = {
    width: "28px", height: "28px", borderRadius: "6px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: 900, flexShrink: 0,
  };

  if (rank === 1) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...base, background: GREEN, color: "#fff" }}>1</div>
    </div>
  );
  if (rank === 2) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...base, background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.4)", fontWeight: 700 }}>2</div>
    </div>
  );
  if (rank === 3) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...base, background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.2)", fontWeight: 600 }}>3</div>
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.18)", textAlign: "center", width: "28px" }}>{rank}</span>
    </div>
  );
}

// ── YOUR CARD ─────────────────────────────────────────────────────────────────
function YourCard({ rank, name, donated }: { rank: number | null; name: string | null; donated: boolean }) {
  return (
    <div style={{
      borderRadius: "16px",
      background: BLACK,
      border: "1px solid rgba(255,255,255,0.08)",
      padding: "22px",
      position: "relative",
      overflow: "hidden",
      aspectRatio: "1.586",
      flexShrink: 0,
    }}>
      {/* brushed texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(105deg,transparent,transparent 3px,rgba(255,255,255,0.015) 3px,rgba(255,255,255,0.015) 4px)",
        pointerEvents: "none",
      }} />
      {/* green top line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1.5px", background: GREEN }} />

      {/* chip */}
      <div style={{
        width: "28px", height: "20px", borderRadius: "4px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        marginBottom: "16px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.04) 0,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 4px)",
        }} />
      </div>

      {/* contactless */}
      <div style={{
        position: "absolute", top: "18px", right: "18px",
        width: "26px", height: "26px", borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "rgba(0,168,98,0.15)", border: "1px solid rgba(0,168,98,0.3)" }} />
      </div>

      {/* label + rank */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "8px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "5px" }}>
          Your position
        </div>
        <motion.div
          key={rank}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: "38px", fontWeight: 900, letterSpacing: "-0.05em", color: "#fff", lineHeight: 1 }}
        >
          {donated && rank ? (
            <><span style={{ fontSize: "16px", color: GREEN, verticalAlign: "top", marginTop: "7px", display: "inline-block" }}>#</span>{rank}</>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.12)" }}>—</span>
          )}
        </motion.div>
      </div>

      {/* name bottom-left */}
      <div style={{ position: "absolute", bottom: "20px", left: "22px", fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
        {donated && name ? name.toUpperCase() : "NOT DONATED"}
      </div>

      {/* amount bottom-right */}
      {donated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ position: "absolute", bottom: "20px", right: "22px", fontSize: "13px", fontWeight: 700, color: GREEN }}
        >
          $1.00
        </motion.div>
      )}
    </div>
  );
}

// ── STAT PILL ─────────────────────────────────────────────────────────────────
function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      borderRadius: "12px", padding: "14px 16px",
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}>
      <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.55)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "5px" }}>
        {label}
      </div>
      <div style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff" }}>
        {value}
      </div>
    </div>
  );
}

// ── BOARD ROW ─────────────────────────────────────────────────────────────────
function BoardRow({ entry, index, isInView, isNew }: {
  entry: LeaderboardEntry; index: number; isInView: boolean; isNew: boolean;
}) {
  const formatDate = (d: string) => {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "placeholder";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr 90px 72px",
        gap: "8px",
        alignItems: "center",
        padding: "0 20px",
        height: "48px",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        background: isNew
          ? undefined
          : entry.placeholder
            ? "rgba(0,0,0,0.015)"
            : entry.rank === 1
              ? "rgba(0,168,98,0.06)"
              : "#fff",
        animation: isNew ? "flashRow 1.4s ease forwards" : undefined,
      }}
    >
      <RankBadge rank={entry.rank} />

      {/* name + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
          background: entry.rank === 1 ? BLACK : "rgba(0,168,98,0.1)",
          border: entry.rank === 1 ? `1px solid ${BLACK}` : "1px solid rgba(0,168,98,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 700,
          color: entry.rank === 1 ? "#fff" : GREEN,
        }}>
          {entry.name[0]}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: BLACK, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {entry.name}
            </span>
            {entry.placeholder && (
              <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.06em", color: "rgba(0,0,0,0.45)", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "4px", padding: "1px 6px", flexShrink: 0 }}>
                PLACEHOLDER
              </span>
            )}
            {isNew && (
              <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.06em", color: GREEN, background: "rgba(0,168,98,0.1)", border: "1px solid rgba(0,168,98,0.25)", borderRadius: "4px", padding: "1px 6px", flexShrink: 0 }}>
                NEW
              </span>
            )}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.25)", fontWeight: 300, marginTop: "1px" }}>
            {isNew ? "just now" : formatDate(entry.created_at)}
          </div>
        </div>
      </div>

      {/* date */}
      <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.25)", fontWeight: 300 }}>
        {isNew ? "—" : formatDate(entry.created_at)}
      </div>

      {/* amount */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: GREEN }}>$1.00</div>
        <div style={{ fontSize: "9px", color: "rgba(0,168,98,0.45)", marginTop: "1px" }}>confirmed</div>
      </div>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function Leaderboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/donations/leaderboard");
      const json = (await res.json()) as { data?: LeaderboardEntry[] };
      const incoming = json.data ?? [];

      setData(prev => {
        const prevIds = new Set(prev.map(e => e.rank));
        const freshIds = new Set<number>();
        incoming.forEach(e => { if (!prevIds.has(e.rank)) freshIds.add(e.rank); });
        if (freshIds.size > 0) {
          setNewIds(freshIds);
          setTimeout(() => setNewIds(new Set()), 1500);
        }
        return incoming;
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = () => void fetchLeaderboard();
    const bootId = setTimeout(load, 0);
    const id = setInterval(load, 30000);
    return () => {
      clearTimeout(bootId);
      clearInterval(id);
    };
  }, []);

  const MAX_DISPLAY_ROWS = 20;
  const placeholderEntries: LeaderboardEntry[] = Array.from({ length: 8 }, (_, i) => ({
    rank: i + 1,
    name: `Example User ${i + 1}`,
    created_at: "",
    placeholder: true,
  }));
  const baseRows = data.length === 0 ? placeholderEntries : data;
  const visible = baseRows.slice(0, MAX_DISPLAY_ROWS);
  const isShowingPlaceholders = !loading && data.length === 0;

  return (
    <section
      ref={ref}
      style={{
        background: GREEN,
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
      {/* brushed texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(105deg,transparent,transparent 3px,rgba(255,255,255,0.03) 3px,rgba(255,255,255,0.03) 4px)",
      }} />

      <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(20px, 3vh, 32px)" }}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", marginBottom: "10px" }}
            >
              The Board
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#fff" }}
            >
              People who made{" "}
              <span style={{ color: BLACK }}>the correct decision.</span>
            </motion.h2>
          </div>

          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: "6px", paddingBottom: "4px" }}
          >
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff", animation: "blink 1.4s ease-in-out infinite" }} />
            <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>LIVE</span>
          </motion.div>
        </div>

        {/* ── Main grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 230px", gap: "14px", alignItems: "start" }}>

          {/* ── Board ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)", background: "#fff" }}
          >
            {/* header row */}
            <div style={{
              display: "grid", gridTemplateColumns: "48px 1fr 90px 72px", gap: "8px",
              padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)",
              background: BLACK,
            }}>
              {["Rank", "Donor", "Date", "Amount"].map((h, i) => (
                <span key={i} style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", textAlign: i === 3 ? "right" : "left" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* rows */}
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", fontSize: "13px", color: "rgba(0,0,0,0.35)", fontWeight: 300 }}>
                Loading the board...
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <div style={{ maxHeight: "480px", overflowY: "auto" }}>
                {visible.map((entry, i) => (
                  <BoardRow
                    key={`${entry.rank}-${entry.created_at}`}
                    entry={entry}
                    index={i}
                    isInView={isInView}
                    isNew={newIds.has(entry.rank)}
                  />
                ))}
                </div>
                {/* fade bottom */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "48px", background: "linear-gradient(transparent, rgba(255,255,255,0.95))", pointerEvents: "none", zIndex: 5 }} />
              </div>
            )}

            {/* footer */}
            <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(0,0,0,0.05)", background: "#fff" }}>
              <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.25)", fontWeight: 300 }}>
                {isShowingPlaceholders
                  ? "No real donations yet. Showing clearly labeled placeholder entries. #1 spot: this could be you."
                  : `Updates every 30 seconds${data.length > visible.length ? ` · Showing top ${visible.length}` : ""}`}
              </p>
            </div>
          </motion.div>

          {/* ── Right panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <YourCard rank={1} name={null} donated={false} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <StatPill label="Donors" value={String(data.length)} />
              <StatPill label="Raised" value={`$${data.length}`} />
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.15; } }
        @keyframes flashRow { 0% { background:rgba(0,168,98,0.15); } 100% { background:transparent; } }
      `}</style>
    </section>
  );
}
