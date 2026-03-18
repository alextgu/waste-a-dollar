"use client";

import { useEffect, useRef, useState } from "react";

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
  const hasEntered = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          hasEntered.current = true;
          setState("visible");
        } else if (hasEntered.current) {
          setState("exited");
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el); return () => obs.disconnect();
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
  { rarity: "common",    icon: "☕", title: "The Coffee"      },
  { rarity: "uncommon",  icon: "🚗", title: "The Uber"        },
  { rarity: "rare",      icon: "🍜", title: "The Takeout"     },
  { rarity: "epic",      icon: "📦", title: "The Impulse Buy" },
  { rarity: "legendary", icon: "✨", title: "The Vibe"        },
];

// ── CARD DETAIL CONTENT ───────────────────────────────────────────────────────

function PercentileDetail({ open }: { open: boolean }) {
  const bars = [8, 18, 29, 41, 53, 64, 74, 83, 91, 99];
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

      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(13,13,13,0.04)", flex: 1 }}>
          <div style={{ fontSize: "15px", fontWeight: 900, color: "rgba(13,13,13,0.2)", letterSpacing: "-0.03em" }}>99%</div>
          <div style={{ fontSize: "11px", color: C.muted, marginTop: "1px" }}>don&apos;t donate</div>
        </div>
        <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(0,168,98,0.07)", border: "1px solid rgba(0,168,98,0.15)", flex: 1 }}>
          <div style={{ fontSize: "15px", fontWeight: 900, color: C.green, letterSpacing: "-0.03em" }}>1%</div>
          <div style={{ fontSize: "11px", color: C.green, marginTop: "1px", opacity: 0.7 }}>do donate. the elite 1% where you belong.</div>
        </div>
      </div>

      <p style={{ fontSize: "12px", color: C.muted, lineHeight: 1.5, borderTop: `1px solid ${C.border}`, paddingTop: "10px", margin: 0 }}>
        Immediately become top in the world.{" "}
        <span style={{ color: C.black }}>You have the easy opportunity to be exceptional.</span>
      </p>
    </div>
  );
}

function CertificateDetail({ open }: { open: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Mini trading cards row — flex so they stretch to fill width */}
      <div style={{ display: "flex", gap: "5px" }}>
        {TRADING_CARDS.map((card, i) => {
          const r = RARITIES.find(x => x.key === card.rarity)!;
          return (
            <div key={i} style={{
              flex: 1,
              borderRadius: "8px", background: C.white,
              border: `1.5px solid ${r.color}25`,
              overflow: "hidden",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(8px)",
              transition: `opacity 0.4s ease ${0.1 + i * 0.07}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.07}s`,
            }}>
              <div style={{ height: "2px", background: r.color }} />
              <div style={{ padding: "5px 6px" }}>
                <div style={{ fontSize: "6px", fontWeight: 700, color: r.color, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "3px" }}>{r.label}</div>
                <div style={{ fontSize: "15px", lineHeight: 1, marginBottom: "3px" }}>{card.icon}</div>
                <div style={{ fontSize: "8px", fontWeight: 800, color: C.black, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{card.title}</div>
                <div style={{ display: "flex", gap: "1px", marginTop: "3px" }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span key={si} style={{ fontSize: "5px", color: si < r.stars ? r.color : "rgba(13,13,13,0.1)" }}>★</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drop rates */}
      <div>
        <div style={{ fontSize: "9px", fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "6px" }}>Drop rates</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {RARITIES.map((r, i) => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: r.color, flexShrink: 0 }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: C.black, width: "60px" }}>{r.label}</span>
              <div style={{ flex: 1, height: "2px", borderRadius: "100px", background: "rgba(13,13,13,0.07)" }}>
                <div style={{ height: "100%", background: r.color, width: open ? r.dropW : "0%", transition: `width 0.7s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.07}s`, borderRadius: "100px" }} />
              </div>
              <span style={{ fontSize: "10px", color: C.muted, width: "28px", textAlign: "right" }}>{r.drop}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: "12px", color: C.muted, lineHeight: 1.5, borderTop: `1px solid ${C.border}`, paddingTop: "10px", margin: 0 }}>
      Gain your very own Alex Purchase trading card.{" "}
        <span style={{ color: C.black }}> Collect them all for the ultimate prize.</span>
      </p>
    </div>
  );
}

function LeaderboardDetail({ open }: { open: boolean }) {
  const [names, setNames] = useState(["Jordan M.", "Sam K.", "You", "Riley P."]);
  const [youPos, setYouPos] = useState(2);

  useEffect(() => {
    if (!open) { setNames(["Jordan M.", "Sam K.", "You", "Riley P."]); setYouPos(2); return; }
    let pos = 2;
    const id = setInterval(() => {
      if (pos <= 0) { clearInterval(id); return; }
      pos--;
      setNames(p => { const n = [...p]; [n[pos], n[pos + 1]] = [n[pos + 1], n[pos]]; return n; });
      setYouPos(pos);
    }, 1400);
    return () => clearInterval(id);
  }, [open]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {names.map((name, i) => {
          const isYou = name === "You";
          return (
            <div key={name} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "8px",
              background: isYou ? "rgba(0,168,98,0.07)" : "rgba(13,13,13,0.03)",
              border: isYou ? "1px solid rgba(0,168,98,0.18)" : `1px solid ${C.border}`,
              transition: "background 0.5s ease, border 0.5s ease",
              opacity: open ? 1 : 0,
              transform: open ? "translateX(0)" : "translateX(-10px)",
              transitionDelay: `${i * 0.07}s`,
            }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: isYou ? C.green : C.muted, minWidth: "16px" }}>
                0{i + 1}
              </span>
              <span style={{ fontSize: "13px", fontWeight: isYou ? 700 : 400, color: isYou ? C.black : C.muted, flex: 1 }}>
                {name}
              </span>
              {isYou && youPos > 0 && <span style={{ fontSize: "10px", fontWeight: 600, color: C.green }}>↑ climbing</span>}
              {isYou && youPos === 0 && <span style={{ fontSize: "10px", fontWeight: 600, color: C.green }}>✦ #1</span>}
              <span style={{ fontSize: "11px", fontWeight: 700, color: isYou ? C.green : "rgba(13,13,13,0.15)" }}>$1</span>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: "12px", color: C.muted, lineHeight: 1.5, borderTop: `1px solid ${C.border}`, paddingTop: "10px", margin: 0 }}>
        Your name appears here after donating.{" "}
        <span style={{ color: C.black }}>Visible to everyone. Forever. One dollar.</span>
      </p>
    </div>
  );
}

// ── CARD WRAPPER ──────────────────────────────────────────────────────────────
function ReasonCard({
  num, title, sub, active, dimmed, viewState, delay, onOpen, onClose, children, index, exitDir,
}: {
  num: string; title: string; sub: string;
  active: boolean; dimmed: boolean; viewState: ViewState; delay: number; index: number;
  exitDir: 1 | -1;
  onOpen: () => void; onClose: () => void;
  children: React.ReactNode;
}) {
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
    <div style={{
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
          border: `1px solid ${active ? "rgba(0,168,98,0.25)" : C.border}`,
          overflow: "hidden",
          height: "100%",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          boxShadow: active
            ? "0 20px 48px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,168,98,0.12)"
            : "0 2px 8px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.5s cubic-bezier(0.16,1,0.3,1)",
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

        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", flexShrink: 0 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              {num}
            </div>
            {active && (
              <button
                onClick={e => { e.stopPropagation(); onClose(); }}
                style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(13,13,13,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: C.muted, flexShrink: 0 }}
              >
                ✕
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
          <p style={{ fontSize: "13px", color: C.muted, lineHeight: 1.5, marginBottom: active ? "14px" : "20px", flexShrink: 0 }}>
            {sub}
          </p>

          {/* Detail content */}
          <div style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0px)" : "translateY(10px)",
            transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1) 0.08s, transform 0.45s cubic-bezier(0.16,1,0.3,1) 0.08s",
            pointerEvents: active ? "auto" : "none",
          }}>
            {children}
          </div>

          {/* See it arrow — only when collapsed */}
          {!active && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: dimmed ? 0 : 1, transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1)", flexShrink: 0, marginTop: "auto" }}>
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
export default function WhySection({ onDonateClick }: { onDonateClick?: () => void }) {
  const secRef = useRef<HTMLDivElement>(null!);
  const viewState = useViewState(secRef);
  const inView = viewState === "visible";
  const [active, setActive] = useState<number | null>(null);
  // Randomise exit direction once per mount — 50/50 left or right per card
  const exitDirs = useRef<(1 | -1)[]>(
    [0, 1, 2].map(() => (Math.random() < 0.5 ? 1 : -1)) as (1 | -1)[]
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const cards = [
    { num: "01", title: "Be in the 99th percentile.", sub: "Only 1% of visitors ever donate." },
    { num: "02", title: "Collect a trading card.",    sub: "5 rarities. Assigned at random."  },
    { num: "03", title: "Your name on the board.",   sub: "Visible to everyone. Forever."    },
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

        {/* ── Header ── */}
        <div style={{
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
          paddingTop: "clamp(40px, 7vh, 80px)",
          paddingBottom: "clamp(14px, 2.5vh, 36px)",
          flexShrink: 0,
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
            // Reserve space so the fixed bottom CTA never gets covered by cards.
            paddingBottom: "clamp(72px, 8.5vh, 120px)",
            // Keep cards container consistent height so the section stays one-screen.
            height: "clamp(280px, 44vh, 420px)",
            flexShrink: 0,
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
              transition: "grid-template-columns 0.55s cubic-bezier(0.34,1.1,0.64,1)",
            }}
          >
            {cards.map((c, i) => (
              <ReasonCard
                key={i} num={c.num} title={c.title} sub={c.sub} index={i}
                active={active === i}
                dimmed={active !== null && active !== i}
                viewState={viewState}
                exitDir={exitDirs.current[i]}
                delay={0.1 + i * 0.12}
                onOpen={() => setActive(i)}
                onClose={() => setActive(null)}
              >
                {i === 0 && <PercentileDetail open={active === 0} />}
                {i === 1 && <CertificateDetail open={active === 1} />}
                {i === 2 && <LeaderboardDetail open={active === 2} />}
              </ReasonCard>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div
          style={{
            position: "absolute",
            left: "clamp(24px, 6vw, 80px)",
            right: "clamp(24px, 6vw, 80px)",
            bottom: "clamp(20px, 3.5vh, 44px)",
            zIndex: 25,
            pointerEvents: "auto",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.7s ease 0.55s",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              width: "100%",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <button
              onClick={onDonateClick}
              style={{
                padding: "12px 28px",
                borderRadius: "100px",
                background: "rgba(13,13,13,0.92)",
                color: C.green,
                border: "1px solid rgba(0,168,98,0.28)",
                boxShadow: "0 18px 44px rgba(0,0,0,0.18)",
                fontSize: "14px",
                fontWeight: 800,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                transition: "transform 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "none")
              }
            >
              Donate $1
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
