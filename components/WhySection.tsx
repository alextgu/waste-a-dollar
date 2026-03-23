"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";

const C = {
  bg:     "#F0EDE8",
  white:  "#FFFFFF",
  black:  "#0D0D0D",
  green:  "#00A862",
  muted:  "rgba(13,13,13,0.38)",
  border: "rgba(13,13,13,0.07)",
};

type ViewState = "before" | "visible" | "exited";

function useViewState(ref: React.RefObject<Element>): ViewState {
  const [state, setState] = useState<ViewState>("before");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use the snap-scroll container if present (more reliable than DOM walking).
    const getScrollParent = (): Element => {
      return document.getElementById("snap-container") ?? document.documentElement;
    };

    const check = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centre = rect.top + rect.height / 2;
      if (centre >= 0 && centre <= vh) {
        setState("visible");
      } else if (rect.bottom < 0) {
        setState("exited");
      } else {
        setState("before");
      }
    };

    const scrollEl = getScrollParent();
    check();
    scrollEl.addEventListener("scroll", check, { passive: true });
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      scrollEl.removeEventListener("scroll", check);
      window.removeEventListener("scroll", check);
    };
  }, [ref]);

  return state;
}

// ── RARITY CONFIG ─────────────────────────────────────────────────────────────
const RARITIES = [
  { key: "common",    label: "Common",    color: "#9CA3AF", stars: 1, drop: "70%",  dropW: "70%" },
  { key: "uncommon",  label: "Uncommon",  color: "#22C55E", stars: 2, drop: "20%",  dropW: "20%" },
  { key: "rare",      label: "Rare",      color: "#3B82F6", stars: 3, drop: "7%",   dropW: "7%"  },
  { key: "epic",      label: "Epic",      color: "#A855F7", stars: 4, drop: "2.5%", dropW: "2.5%"},
  { key: "legendary", label: "Legendary", color: "#F59E0B", stars: 5, drop: "0.5%", dropW: "0.5%"},
];

const TRADING_CARDS = [
  { rarity: "common",    icon: "☕", title: "Bubble Tea"      },
  { rarity: "uncommon",  icon: "🚗", title: "The Uber"        },
  { rarity: "rare",      icon: "🍜", title: "The Takeout"     },
  { rarity: "epic",      icon: "📦", title: "The Impulse Buy" },
  { rarity: "legendary", icon: "✨", title: "The Vibe"        },
];

// ── CARD DETAIL CONTENT ───────────────────────────────────────────────────────

function PercentileDetail({ open }: { open: boolean }) {
  const bars = [8, 18, 29, 41, 53, 64, 74, 83, 91, 99];

  const feats = [
    { label: "Sub-10s 100m", effort: "Years of training", hard: true },
    { label: "Pass the MCAT", effort: "Months of studying", hard: true },
    { label: "Donate $1 here", effort: "6–7 seconds", hard: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
        <div style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.05em", color: C.black, lineHeight: 1 }}>
          99<span style={{ fontSize: "0.45em", color: C.green }}>th</span>
        </div>
        <div style={{ fontSize: "12px", color: C.muted }}>percentile of all visitors</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "32px" }}>
        {bars.map((h, i) => (
          <div key={i} style={{
            flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0",
            background: i === 9 ? C.green : "rgba(13,13,13,0.08)",
            transform: open ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "bottom",
            transition: `transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.04}s`,
          }} />
        ))}
      </div>

      {/* Feat comparison */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <div style={{ fontSize: "9px", fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase" as const, marginBottom: "2px" }}>Other ways to reach the 99th percentile</div>
        {feats.map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "8px 11px", borderRadius: "8px",
            background: f.hard ? "rgba(13,13,13,0.03)" : "rgba(0,168,98,0.07)",
            border: `1px solid ${f.hard ? C.border : "rgba(0,168,98,0.18)"}`,
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(6px)",
            transition: `opacity 0.45s ease ${0.1 + i * 0.08}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s`,
          }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: C.black, flex: 1, letterSpacing: "-0.01em" }}>{f.label}</span>
            <span style={{
              display: "flex", alignItems: "center", gap: "3px",
              fontSize: "10px", fontWeight: 600,
              color: f.hard ? C.muted : C.green,
              background: f.hard ? "transparent" : "rgba(0,168,98,0.08)",
              padding: f.hard ? "0" : "2px 7px",
              borderRadius: "100px",
            }}>
              {!f.hard && (
                <svg width="7" height="7" viewBox="0 0 7 7" fill={C.green}>
                  <path d="M3.5 0 L4 2.5 L7 3.5 L4 4.5 L3.5 7 L3 4.5 L0 3.5 L3 2.5 Z"/>
                </svg>
              )}
              {f.effort}
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "12px", color: C.muted, lineHeight: 1.5, borderTop: `1px solid ${C.border}`, paddingTop: "10px", margin: 0 }}>
        Immediately become top in the world.{" "}
        <span style={{ color: C.black }}>You have the easy opportunity to be exceptional.</span>
      </p>
    </div>
  );
}

function CertificateDetail({ open }: { open: boolean }) {
  const rarityLabels = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  // Grayscale steps for rarity dots & bars — darkest = rarest
  const rarityGreys = [
    "rgba(13,13,13,0.18)",
    "rgba(13,13,13,0.28)",
    "rgba(13,13,13,0.42)",
    "rgba(13,13,13,0.6)",
    C.green,
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* Card + drop rates side by side */}
      <div style={{
        display: "flex", gap: "8px", alignItems: "stretch",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s",
      }}>

        {/* Credit card */}
        <div style={{
          width: "52%", flexShrink: 0,
          aspectRatio: "85.6 / 53.98",
          borderRadius: "10px", overflow: "hidden",
          position: "relative",
          background: "#0a0d0b",
          border: "1px solid rgba(0,168,98,0.25)",
        }}>
          {/* Bubble tea — card art (subtle over black #0a0d0b) */}
          <img
            src="/bubble_tea.jpg"
            alt=""
            aria-hidden
            style={{
              position: "absolute", inset: 0, zIndex: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center center",
              filter: "grayscale(100%) brightness(0.65) contrast(1.02)",
              opacity: 0.32,
            }}
          />
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, background: "linear-gradient(160deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.65) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, background: "repeating-linear-gradient(-42deg,transparent,transparent 12px,rgba(0,168,98,0.03) 12px,rgba(0,168,98,0.03) 13px)" }} />
          <div style={{ position: "absolute", inset: 0, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 3 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" as const, fontFamily: "Inter, sans-serif", color: "rgba(0,168,98,0.7)" }}>Waste a Dollar</div>
              <div style={{ padding: "2px 6px", borderRadius: "100px", fontSize: "6px", fontWeight: 800, letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", background: "rgba(0,168,98,0.15)", border: "1px solid rgba(0,168,98,0.35)", color: C.green }}>COMMON</div>
            </div>
            <div style={{ width: "22px", height: "17px", borderRadius: "3px", background: "linear-gradient(135deg, rgba(0,168,98,0.25) 0%, rgba(0,168,98,0.1) 100%)", border: "1px solid rgba(0,168,98,0.3)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(0,168,98,0.2)", transform: "translateY(-50%)" }} />
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(0,168,98,0.2)", transform: "translateX(-50%)" }} />
            </div>
            <div style={{ fontSize: "8px", fontWeight: 600, letterSpacing: "0.2em", fontFamily: "Inter, sans-serif", fontVariantNumeric: "tabular-nums" as const, color: "rgba(255,255,255,0.5)" }}>•••• •••• •••• 0001</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: "6px", letterSpacing: "0.1em", textTransform: "uppercase" as const, fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.25)", marginBottom: "2px" }}>Card holder</div>
                <div style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" as const, fontFamily: "Inter, sans-serif", color: "#fff" }}>Alex</div>
                <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                  {[true, false, false, false, false].map((on, i) => (
                    <div key={i} style={{ width: "6px", height: "6px", borderRadius: "1px", background: on ? C.green : "rgba(255,255,255,0.06)" }} />
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right" as const }}>
                <div style={{ fontSize: "6px", letterSpacing: "0.08em", textTransform: "uppercase" as const, fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.22)", marginBottom: "2px" }}>Donated for</div>
                <div style={{ fontSize: "8px", fontWeight: 700, fontFamily: "Inter, sans-serif", color: "rgba(0,168,98,0.85)" }}>Bubble Tea</div>
              </div>
            </div>
          </div>
        </div>

        {/* Drop rates — dark panel, premium feel */}
        <div style={{
          flex: 1,
          borderRadius: "10px",
          background: "#0a0d0b",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 11px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div style={{ fontSize: "6px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>Drop rates</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0px", flex: 1, justifyContent: "space-between" }}>
            {RARITIES.map((r, i) => (
              <div key={r.key} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "7px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: rarityGreys[i] }}>{r.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "-0.03em", color: i === 4 ? C.green : "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" as const }}>{r.drop}</span>
                </div>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, height: "100%", background: i === 4 ? C.green : rarityGreys[i], width: open ? r.dropW : "0%", transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.08}s`, borderRadius: "100px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p style={{ fontSize: "12px", color: C.muted, lineHeight: 1.5, borderTop: `1px solid ${C.border}`, paddingTop: "10px", margin: 0 }}>
        Gain your very own Alex trading card upon donating.{" "}
        <span style={{ color: C.black }}>Worth your dollar in Alex's opinion.</span>
      </p>
    </div>
  );
}

function LeaderboardDetail({ open }: { open: boolean }) {
  const initialRows = [
    { name: "Jordan M.", amount: 4 },
    { name: "Sam K.",    amount: 2 },
    { name: "You",       amount: 1 },
    { name: "Riley P.",  amount: 1 },
  ];
  const [rows, setRows] = useState(initialRows);
  const [youPos, setYouPos] = useState(2);

  useEffect(() => {
    if (!open) { setRows(initialRows); setYouPos(2); return; }
    let pos = 2;
    const id = setInterval(() => {
      if (pos <= 0) { clearInterval(id); return; }
      pos--;
      setRows(prev => {
        const next = prev.map(r => ({ ...r }));
        // You overtakes the person above — steal their dollar lead
        const youIdx = next.findIndex(r => r.name === "You");
        const above = youIdx - 1;
        if (above < 0) return next;
        next[youIdx].amount = next[above].amount + 1;
        // swap positions
        [next[above], next[youIdx]] = [next[youIdx], next[above]];
        return next;
      });
      setYouPos(pos);
    }, 1400);
    return () => clearInterval(id);
  }, [open]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* #1 prize banner */}
      <div style={{
        padding: "10px 14px", borderRadius: "10px",
        background: "rgba(0,168,98,0.07)",
        border: "1px solid rgba(0,168,98,0.2)",
        display: "flex", alignItems: "center", gap: "10px",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.45s ease 0.05s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 5h12v4a6 6 0 0 1-12 0V5z"/>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, color: C.black, letterSpacing: "-0.01em" }}>Top donator wins a personal shoutout</div>
            <svg width="7" height="7" viewBox="0 0 7 7" fill={C.green} style={{ flexShrink: 0, opacity: 0.7 }}>
              <path d="M3.5 0 L4 2.5 L7 3.5 L4 4.5 L3.5 7 L3 4.5 L0 3.5 L3 2.5 Z"/>
            </svg>
          </div>
          <div style={{ fontSize: "10px", color: C.muted, marginTop: "2px" }}>Alex will personally call out the #1 donor by name.</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {rows.map((row, i) => {
          const isYou = row.name === "You";
          return (
            <div key={row.name} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "8px",
              background: isYou ? "rgba(0,168,98,0.07)" : "rgba(13,13,13,0.03)",
              border: isYou ? "1px solid rgba(0,168,98,0.18)" : `1px solid ${C.border}`,
              transition: "background 0.5s ease, border 0.5s ease",
              opacity: open ? 1 : 0,
              transform: open ? "translateX(0)" : "translateX(-10px)",
              transitionDelay: `${0.1 + i * 0.07}s`,
            }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: isYou ? C.green : C.muted, minWidth: "16px" }}>
                0{i + 1}
              </span>
              <span style={{ fontSize: "13px", fontWeight: isYou ? 700 : 400, color: isYou ? C.black : C.muted, flex: 1 }}>
                {row.name}
              </span>
              {isYou && youPos > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px", fontWeight: 600, color: C.green }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4.5" y1="8" x2="4.5" y2="1"/><polyline points="1.5,4 4.5,1 7.5,4"/>
                  </svg>
                  climbing
                </span>
              )}
              {isYou && youPos === 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700, color: C.green }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill={C.green}>
                    <path d="M4 0 L4.6 2.8 L7.5 2.8 L5.2 4.5 L6 7.5 L4 5.8 L2 7.5 L2.8 4.5 L0.5 2.8 L3.4 2.8 Z"/>
                  </svg>
                  #1
                </span>
              )}
              <span style={{ fontSize: "11px", fontWeight: 700, color: isYou ? C.green : "rgba(13,13,13,0.15)", transition: "color 0.4s ease" }}>${row.amount}</span>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: "12px", color: C.muted, lineHeight: 1.5, borderTop: `1px solid ${C.border}`, paddingTop: "10px", margin: 0 }}>
        Your name appears here after donating.{" "}
        <span style={{ color: C.black }}>Join the Prestigious Leaderboard. One dollar.</span>
      </p>
    </div>
  );
}

// ── CARD ILLUSTRATIONS ────────────────────────────────────────────────────────
// Grayscale by default. Colour appears on hover (via `hovered` prop).

function IllustrationPercentile({ hovered }: { hovered: boolean }) {
  const heights = [17, 26, 36, 46, 55, 64, 73, 81, 89, 100];
  const T = "transition: fill 0.45s ease, stroke 0.45s ease";
  return (
    <div style={{ paddingTop: "18px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "76px" }}>
        {heights.map((h, i) => {
          const isYou = i === 9;
          return (
            <div key={i} style={{
              flex: 1,
              height: `${h}%`,
              borderRadius: "3px 3px 0 0",
              position: "relative",
              background: isYou
                ? (hovered ? "#00A862" : "rgba(13,13,13,0.18)")
                : "rgba(13,13,13,0.09)",
              transition: "background 0.45s ease",
            }}>
              {isYou && (
                <span style={{
                  position: "absolute", top: "-17px", left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "7px", fontWeight: 800, letterSpacing: "0.06em",
                  whiteSpace: "nowrap", fontFamily: "Inter, sans-serif",
                  color: hovered ? "#00A862" : "rgba(13,13,13,0.25)",
                  transition: "color 0.45s ease",
                }}>YOU</span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ height: "1px", background: "rgba(13,13,13,0.08)" }} />
      <div style={{
        fontSize: "9px", fontWeight: 700, letterSpacing: "0.04em",
        fontFamily: "Inter, sans-serif", textAlign: "right", marginTop: "5px",
        color: hovered ? "rgba(0,168,98,0.65)" : "rgba(13,13,13,0.18)",
        transition: "color 0.45s ease",
      }}>99th percentile</div>
    </div>
  );
}

function IllustrationCertificate({ hovered }: { hovered: boolean }) {
  const rarityLabels = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Credit-card proportions: 85.6 × 53.98mm → aspect ratio ~1.586 */}
      <div style={{
        width: "100%", aspectRatio: "85.6 / 53.98",
        borderRadius: "12px", overflow: "hidden",
        position: "relative",
        background: "#0a0d0b",
        border: `1px solid ${hovered ? "rgba(0,168,98,0.3)" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.45s ease",
      }}>
        {/* Bubble tea — card art; hover adds a hint of color */}
        <img
          src="/bubble_tea.jpg"
          alt=""
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center center",
            filter: hovered
              ? "grayscale(0%) brightness(0.72) contrast(1.04)"
              : "grayscale(100%) brightness(0.65) contrast(1.02)",
            opacity: hovered ? 0.34 : 0.3,
            transition: "opacity 0.55s ease, filter 0.55s ease",
          }}
        />

        {/* Dark gradient overlay — keeps text legible over any photo */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          background: "linear-gradient(160deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.65) 100%)",
        }} />

        {/* Diagonal line texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          background: hovered
            ? "repeating-linear-gradient(-42deg,transparent,transparent 12px,rgba(0,168,98,0.03) 12px,rgba(0,168,98,0.03) 13px)"
            : "repeating-linear-gradient(-42deg,transparent,transparent 12px,rgba(255,255,255,0.015) 12px,rgba(255,255,255,0.015) 13px)",
          transition: "background 0.45s ease",
        }} />

        {/* Card content */}
        <div style={{
          position: "absolute", inset: 0,
          padding: "10px 12px",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 2,
        }}>
          {/* Top row — brand + rarity badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{
              fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em",
              textTransform: "uppercase" as const, fontFamily: "Inter, sans-serif",
              color: hovered ? "rgba(0,168,98,0.7)" : "rgba(255,255,255,0.35)",
              transition: "color 0.45s ease",
            }}>Waste a Dollar</div>
            <div style={{
              padding: "2px 6px", borderRadius: "100px",
              fontSize: "6px", fontWeight: 800, letterSpacing: "0.1em",
              fontFamily: "Inter, sans-serif",
              background: hovered ? "rgba(0,168,98,0.15)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${hovered ? "rgba(0,168,98,0.4)" : "rgba(255,255,255,0.12)"}`,
              color: hovered ? "#00A862" : "rgba(255,255,255,0.35)",
              transition: "all 0.45s ease",
            }}>COMMON</div>
          </div>

          {/* Chip */}
          <div style={{
            width: "22px", height: "17px", borderRadius: "3px",
            background: hovered
              ? "linear-gradient(135deg, rgba(0,168,98,0.25) 0%, rgba(0,168,98,0.1) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
            border: `1px solid ${hovered ? "rgba(0,168,98,0.35)" : "rgba(255,255,255,0.12)"}`,
            position: "relative", overflow: "hidden",
            transition: "all 0.45s ease",
          }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: hovered ? "rgba(0,168,98,0.25)" : "rgba(255,255,255,0.1)", transform: "translateY(-50%)" }} />
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: hovered ? "rgba(0,168,98,0.25)" : "rgba(255,255,255,0.1)", transform: "translateX(-50%)" }} />
          </div>

          {/* Card number */}
          <div style={{
            fontSize: "8px", fontWeight: 600, letterSpacing: "0.2em",
            fontFamily: "Inter, sans-serif", fontVariantNumeric: "tabular-nums" as const,
            color: hovered ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.35)",
            transition: "color 0.45s ease",
          }}>•••• •••• •••• 0001</div>

          {/* Bottom row — holder + item */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{
                fontSize: "6px", letterSpacing: "0.1em", textTransform: "uppercase" as const,
                fontFamily: "Inter, sans-serif",
                color: "rgba(255,255,255,0.25)", marginBottom: "2px",
              }}>Card holder</div>
              <div style={{
                fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em",
                textTransform: "uppercase" as const, fontFamily: "Inter, sans-serif",
                color: hovered ? "#fff" : "rgba(255,255,255,0.7)",
                transition: "color 0.45s ease",
              }}>Alex</div>
              {/* Stars */}
              <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                {[true, false, false, false, false].map((on, i) => (
                  <div key={i} style={{
                    width: "6px", height: "6px", borderRadius: "1px",
                    background: on
                      ? (hovered ? "#00A862" : "rgba(255,255,255,0.25)")
                      : "rgba(255,255,255,0.06)",
                    transition: "background 0.45s ease",
                  }} />
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right" as const }}>
              <div style={{
                fontSize: "6px", letterSpacing: "0.08em", textTransform: "uppercase" as const,
                fontFamily: "Inter, sans-serif",
                color: "rgba(255,255,255,0.22)", marginBottom: "2px",
              }}>Donated for</div>
              <div style={{
                fontSize: "8px", fontWeight: 700, fontFamily: "Inter, sans-serif",
                color: hovered ? "rgba(0,168,98,0.85)" : "rgba(255,255,255,0.45)",
                transition: "color 0.45s ease",
              }}>Bubble Tea</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rarity bar */}
      <div>
        <div style={{ display: "flex", gap: "4px", height: "5px" }}>
          {rarityLabels.map((_, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: "3px",
              background: i === 0
                ? (hovered ? "#00A862" : "rgba(13,13,13,0.2)")
                : "rgba(13,13,13,0.09)",
              transition: "background 0.45s ease",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", marginTop: "6px" }}>
          {rarityLabels.map((label, i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center" as const,
              fontSize: "7.5px", fontWeight: 700, letterSpacing: "0.02em",
              fontFamily: "Inter, sans-serif",
              color: i === 0
                ? (hovered ? "#00A862" : "rgba(13,13,13,0.22)")
                : "rgba(13,13,13,0.15)",
              transition: "color 0.45s ease",
            }}>{label}</div>
          ))}
        </div>
      </div>

    </div>
  );
}

function IllustrationLeaderboard({ hovered }: { hovered: boolean }) {
  const rows = [
    { name: "Jordan M.", amount: "$4", isYou: false },
    { name: "Sam K.",    amount: "$2", isYou: false },
    { name: "You",       amount: "$1", isYou: true  },
  ];
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "9px",
            padding: "8px 10px", borderRadius: "8px",
            background: row.isYou
              ? (hovered ? "rgba(0,168,98,0.07)" : "rgba(13,13,13,0.03)")
              : "rgba(13,13,13,0.03)",
            border: `1px solid ${row.isYou
              ? (hovered ? "rgba(0,168,98,0.18)" : "rgba(13,13,13,0.05)")
              : "rgba(13,13,13,0.05)"}`,
            transition: "background 0.45s ease, border-color 0.45s ease",
          }}>
            <span style={{
              fontSize: "9px", fontWeight: 800, width: "14px", flexShrink: 0,
              fontFamily: "Inter, sans-serif",
              color: row.isYou
                ? (hovered ? "#00A862" : "rgba(13,13,13,0.2)")
                : "rgba(13,13,13,0.2)",
              transition: "color 0.45s ease",
            }}>0{i + 1}</span>
            {/* Avatar */}
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: row.isYou && hovered ? "rgba(0,168,98,0.12)" : "rgba(13,13,13,0.06)",
              border: `1px solid ${row.isYou && hovered ? "rgba(0,168,98,0.2)" : "transparent"}`,
              transition: "background 0.45s ease, border-color 0.45s ease",
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="3.5" r="1.8"
                  stroke={row.isYou && hovered ? "#00A862" : "rgba(13,13,13,0.25)"}
                  strokeWidth="1.1" style={{ transition: "stroke 0.45s ease" }} />
                <path d="M1.5 9c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5"
                  stroke={row.isYou && hovered ? "#00A862" : "rgba(13,13,13,0.25)"}
                  strokeWidth="1.1" fill="none" style={{ transition: "stroke 0.45s ease" }} />
              </svg>
            </div>
            <span style={{
              flex: 1, fontSize: "11px", fontFamily: "Inter, sans-serif",
              fontWeight: row.isYou && hovered ? 700 : 400,
              color: row.isYou && hovered ? "#0D0D0D" : "rgba(13,13,13,0.35)",
              transition: "color 0.45s ease",
            }}>{row.name}</span>
            {row.isYou && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke={hovered ? "#00A862" : "transparent"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "2px", transition: "stroke 0.45s ease", flexShrink: 0 }}>
                <line x1="4" y1="7" x2="4" y2="1"/><polyline points="1.5,3.5 4,1 6.5,3.5"/>
              </svg>
            )}
            <span style={{
              fontSize: "11px", fontWeight: 700, fontFamily: "Inter, sans-serif",
              color: row.isYou
                ? (hovered ? "#00A862" : "rgba(13,13,13,0.15)")
                : "rgba(13,13,13,0.15)",
              transition: "color 0.45s ease",
            }}>{row.amount}</span>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: "8px", paddingTop: "8px",
        borderTop: "1px solid rgba(13,13,13,0.06)",
        fontSize: "9.5px", fontFamily: "Inter, sans-serif",
        letterSpacing: "0.02em",
        color: hovered ? "rgba(0,168,98,0.55)" : "rgba(13,13,13,0.18)",
        transition: "color 0.45s ease",
      }}>visible to everyone · forever</div>
    </div>
  );
}

// ── CARD WRAPPER ──────────────────────────────────────────────────────────────
function ReasonCard({
  num, title, sub, active, dimmed, viewState, delay, onOpen, onClose, children, index, exitDir, illustration,
}: {
  num: string; title: string; sub: string;
  active: boolean; dimmed: boolean; viewState: ViewState; delay: number; index: number;
  exitDir: 1 | -1;
  onOpen: () => void; onClose: () => void;
  children: React.ReactNode;
  illustration?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  // ── Layer 1: entrance / exit (never changes while visible, so transition never interrupts)
  const dealX = [160, 200, 240];
  const dealY = [-40, -20,  10];
  const dealR = [ -6,   1,   5];
  const exitX = exitDir * (280 + index * 50);
  const exitR = exitDir * (28  + index * 10);

  const l1Transform =
    viewState === "before"  ? `translateX(${dealX[index]}px) translateY(${dealY[index]}px) rotate(${dealR[index]}deg) scale(0.92)` :
    viewState === "exited"  ? `translateX(${exitX}px) translateY(380px) rotate(${exitR}deg) scale(0.85)` :
                              "translateX(0px) translateY(0px) rotate(0deg) scale(1)";

  const exitDelay = index * 0.07;
  const l1Transition =
    viewState === "exited"
      ? `opacity 0.4s ease ${exitDelay}s, transform 0.65s cubic-bezier(0.55,0,1,1) ${exitDelay}s`
      : `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`;

  const l1Opacity = viewState === "visible" ? 1 : 0;

  // ── Layer 2: interaction (active lift / dimmed shrink) — separate div so it never
  //    interrupts the entrance/exit transition above.
  const l2Transform = active ? "translateY(-6px) scale(1.015)" : dimmed ? "scale(0.97)" : "translateY(0px) scale(1)";

  return (
    <div style={{
      position: "relative",
      height: "100%",
      minWidth: 0,
      opacity: l1Opacity,
      transform: l1Transform,
      transition: l1Transition,
      zIndex: active ? 10 : 1,
    }}>
    {/* Interaction layer — spring bounce, separate from entrance so they never conflict */}
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
      height: "100%",
      transform: l2Transform,
      opacity: dimmed ? 0.45 : 1,
      transition: "transform 0.5s cubic-bezier(0.34,1.4,0.64,1), opacity 0.4s ease",
      cursor: active ? "default" : "pointer",
    }}>
      <div
        onClick={() => !active && onOpen()}
        style={{
          borderRadius: "20px",
          background: C.white,
          border: `1px solid ${active ? "rgba(0,168,98,0.25)" : hovered ? "rgba(0,168,98,0.18)" : C.border}`,
          overflow: "hidden",
          height: "100%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          boxShadow: active
            ? "0 20px 48px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,168,98,0.12)"
            : hovered
            ? "0 8px 24px rgba(0,0,0,0.08)"
            : "0 2px 8px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Green top line on active */}
        <div style={{
          height: "3px",
          background: C.green,
          width: active ? "100%" : "0%",
          transition: "width 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
          flexShrink: 0,
        }} />

        {/* Card background texture — dot grid, matches WarmBackground feel */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "20px", pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(circle, rgba(13,13,13,0.055) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)",
          opacity: active ? 0 : 1,
          transition: "opacity 0.4s ease",
        }} />

        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", flexShrink: 0 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              {num}
            </div>
            {active && (
              <button
                onClick={e => { e.stopPropagation(); onClose(); }}
                style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(13,13,13,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="8" y2="8"/><line x1="8" y1="1" x2="1" y2="8"/>
                </svg>
              </button>
            )}
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 900,
            letterSpacing: "-0.03em", lineHeight: 1.05,
            color: C.black, marginBottom: "6px",
            fontFamily: "Inter, sans-serif",
            flexShrink: 0,
          }}>
            {title}
          </h3>
          <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.5, marginBottom: "4px", flexShrink: 0 }}>
            {sub}
          </p>

          {/* Illustration — shown when collapsed, fades out on expand */}
          {illustration && (
            <div style={{
              overflow: "hidden",
              maxHeight: active ? "0px" : "240px",
              opacity: active ? 0 : 1,
              transform: active ? "translateY(8px) scale(0.96)" : "translateY(0px) scale(1)",
              transition: "opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1), max-height 0.55s cubic-bezier(0.16,1,0.3,1)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              minHeight: 0,
            }}>
              <div style={{ width: "100%", maxHeight: "200px", overflow: "hidden" }}>
                {illustration && React.isValidElement(illustration)
                  ? React.cloneElement(illustration as React.ReactElement<{ hovered: boolean }>, { hovered })
                  : illustration}
              </div>
            </div>
          )}

          {/* Detail content */}
          <div style={{
            overflow: "hidden",
            maxHeight: active ? "600px" : "0px",
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0px)" : "translateY(12px)",
            transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.15s, max-height 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s",
            pointerEvents: active ? "auto" : "none",
          }}>
            {children}
          </div>

          {/* See it arrow — only when collapsed */}
          {!active && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: dimmed ? 0 : 1, transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1)", flexShrink: 0, marginTop: "auto", paddingTop: "10px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
                </svg>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.black }}>See it</span>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function WhySection() {
  const secRef = useRef<HTMLDivElement>(null!);
  const viewState = useViewState(secRef);
  const inView = viewState === "visible";
  const [active, setActive] = useState<number | null>(null);
  // Exit directions (deterministic; avoid Math.random during render)
  const exitDirs: (1 | -1)[] = [1, -1, 1];

  // Close any open card when scrolling away
  useEffect(() => {
    if (viewState === "visible") return;
    const id = setTimeout(() => setActive(null), 0);
    return () => clearTimeout(id);
  }, [viewState]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const cards = [
    { num: "01", title: "Be in the 99th percentile.", sub: "Less than 1% of visitors donate." },
    { num: "02", title: "Receive a certificate.",    sub: "In the form of a trading card of 5 rarities."  },
    { num: "03", title: "Dollar leaderboard.",   sub: "Top donator will get a personal shoutout from Alex."},
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');
        ::-webkit-scrollbar { display: none; }
        #why { scrollbar-width: none; }
      `}</style>

      <section
        id="why"
        ref={secRef}
        style={{
          background: C.bg,
          fontFamily: "Inter, sans-serif",
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxSizing: "border-box",
          padding: "0 clamp(24px, 6vw, 80px)",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: "clamp(24px,6vw,80px)", right: "clamp(24px,6vw,80px)", height: "1px", background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />

        {/* Grain texture — matches Hero WarmBackground */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          opacity: 0.032, mixBlendMode: "multiply" as const,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "220px 220px",
        }} />

        {/* Subtle radial vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 55%, rgba(13,13,13,0.04) 100%)",
        }} />

        {/* Large decorative "$1" watermark — bottom right */}
        <div style={{
          position: "absolute", right: "clamp(24px,5vw,60px)", bottom: "60px",
          fontSize: "clamp(80px, 14vw, 180px)", fontWeight: 900,
          letterSpacing: "-0.05em", lineHeight: 1,
          color: "rgba(13,13,13,0.04)", pointerEvents: "none", zIndex: 0,
          fontFamily: "Inter, sans-serif", userSelect: "none",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1s ease 0.3s, transform 1s ease 0.3s",
        }}>$1</div>

        {/* Green orb — top left, echoes Hero */}
        <div style={{
          position: "absolute", top: "-80px", left: "-60px", width: "360px", height: "360px",
          borderRadius: "50%", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(circle, rgba(0,168,98,0.06) 0%, transparent 65%)",
        }} />

        {/* ── Header ── */}
        <div style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
          paddingTop: "clamp(36px, 6vh, 72px)",
          paddingBottom: "clamp(10px, 1.8vh, 28px)",
          flexShrink: 0,
          position: "relative", zIndex: 1,
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: C.green, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>What you get</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95, color: C.black, margin: 0 }}>
              What you get{" "}
              <span style={{ color: C.green }}>from donating.</span>
            </h2>
          </div>
        </div>

        {/* ── Cards ── */}
        <div
          style={{
            maxWidth: "1100px",
            width: "100%",
            margin: "0 auto",
            minHeight: 0,
            paddingBottom: "clamp(48px, 6vh, 88px)",
            /* Taller cards so illustration/title + “See it” aren’t cramped */
            height: "clamp(360px, 54vh, 520px)",
            flexShrink: 0,
            position: "relative", zIndex: 1,
          }}
        >
          <div
            style={{
              height: "100%",
              display: "grid",
              gridTemplateColumns: active !== null
                // Active card is wider; inactive cards are narrower but still visible.
                ? cards.map((_, i) => (i === active ? "1.7fr" : "0.8fr")).join(" ")
                : "repeat(3, 1fr)",
              gap: "12px",
              transition: "grid-template-columns 0.75s cubic-bezier(0.25,1,0.35,1)",
            }}
          >
            {cards.map((c, i) => (
              <ReasonCard
                key={i} num={c.num} title={c.title} sub={c.sub} index={i}
                active={active === i}
                dimmed={active !== null && active !== i}
                viewState={viewState}
                exitDir={exitDirs[i]}
                delay={0.1 + i * 0.12}
                onOpen={() => setActive(i)}
                onClose={() => setActive(null)}
                illustration={
                  i === 0 ? <IllustrationPercentile hovered={false} /> :
                  i === 1 ? <IllustrationCertificate hovered={false} /> :
                            <IllustrationLeaderboard hovered={false} />
                }
              >
                {i === 0 && <PercentileDetail open={active === 0} />}
                {i === 1 && <CertificateDetail open={active === 1} />}
                {i === 2 && <LeaderboardDetail open={active === 2} />}
              </ReasonCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
