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

function useInView(ref: React.RefObject<Element>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el); return () => obs.disconnect();
  }, [ref]);
  return v;
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
  { rarity: "common",    icon: "☕", title: "The Coffee",      spend: "Coffee run"         },
  { rarity: "uncommon",  icon: "🚗", title: "The Uber",        spend: "3 min Uber ride"    },
  { rarity: "rare",      icon: "🍜", title: "The Takeout",     spend: "Late night delivery"},
  { rarity: "epic",      icon: "📦", title: "The Impulse Buy", spend: "Online impulse"     },
  { rarity: "legendary", icon: "✨", title: "The Vibe",        spend: "Classified"         },
];

// ── CARD DETAIL CONTENT ───────────────────────────────────────────────────────

function PercentileDetail({ open }: { open: boolean }) {
  const bars = [8, 18, 29, 41, 53, 64, 74, 83, 91, 99];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <div style={{ fontSize: "clamp(52px, 7vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", color: C.black, lineHeight: 1 }}>
          99<span style={{ fontSize: "0.45em", color: C.green }}>th</span>
        </div>
        <div style={{ fontSize: "14px", color: C.muted, marginTop: "4px" }}>percentile of all visitors</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "56px" }}>
        {bars.map((h, i) => (
          <div key={i} style={{
            flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0",
            background: i === 9 ? C.green : "rgba(13,13,13,0.08)",
            transform: open ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "bottom",
            transition: `transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.04}s`,
          }} />
        ))}
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(13,13,13,0.04)", flex: 1 }}>
          <div style={{ fontSize: "20px", fontWeight: 900, color: "rgba(13,13,13,0.2)", letterSpacing: "-0.03em" }}>99%</div>
          <div style={{ fontSize: "12px", color: C.muted, marginTop: "2px" }}>
            don&apos;t donate
          </div>
        </div>
        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(0,168,98,0.07)", border: "1px solid rgba(0,168,98,0.15)", flex: 1 }}>
          <div style={{ fontSize: "20px", fontWeight: 900, color: C.green, letterSpacing: "-0.03em" }}>1%</div>
          <div style={{ fontSize: "12px", color: C.green, marginTop: "2px", opacity: 0.7 }}>do. be the 1%.</div>
        </div>
      </div>

      <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.65, borderTop: `1px solid ${C.border}`, paddingTop: "16px" }}>
        Of everyone who has visited this page, only 1% donate.{" "}
        <span style={{ color: C.black }}>
          You have the opportunity to be exceptional. Most people are not.
        </span>
      </p>
    </div>
  );
}

function CertificateDetail({ open }: { open: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

      {/* Mini trading cards row */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
        {TRADING_CARDS.map((card, i) => {
          const r = RARITIES.find(x => x.key === card.rarity)!;
          return (
            <div key={i} style={{
              flexShrink: 0, width: "96px",
              borderRadius: "10px", background: C.white,
              border: `1.5px solid ${r.color}25`,
              overflow: "hidden",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.4s ease ${0.1 + i * 0.07}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.07}s`,
            }}>
              <div style={{ height: "2px", background: r.color }} />
              <div style={{ padding: "8px 9px 7px" }}>
                <div style={{ fontSize: "7px", fontWeight: 700, color: r.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "5px" }}>{r.label}</div>
                <div style={{ fontSize: "20px", lineHeight: 1, marginBottom: "5px" }}>{card.icon}</div>
                <div style={{ fontSize: "10px", fontWeight: 800, color: C.black, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{card.title}</div>
                <div style={{ display: "flex", gap: "1px", marginTop: "5px" }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span key={si} style={{ fontSize: "6px", color: si < r.stars ? r.color : "rgba(13,13,13,0.1)" }}>★</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drop rates */}
      <div>
        <div style={{ fontSize: "10px", fontWeight: 600, color: C.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "10px" }}>Drop rates</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          {RARITIES.map((r, i) => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: r.color, flexShrink: 0 }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: C.black, width: "72px" }}>{r.label}</span>
              <div style={{ flex: 1, height: "3px", borderRadius: "100px", background: "rgba(13,13,13,0.07)" }}>
                <div style={{ height: "100%", background: r.color, width: open ? r.dropW : "0%", transition: `width 0.7s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.07}s`, borderRadius: "100px" }} />
              </div>
              <span style={{ fontSize: "11px", color: C.muted, width: "30px", textAlign: "right" }}>{r.drop}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.65, borderTop: `1px solid ${C.border}`, paddingTop: "16px" }}>
        Rarity is assigned randomly at donation.{" "}
        <span style={{ color: C.black }}>Getting legendary is unlikely. That is the point. You may get common. That is also fine.</span>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {names.map((name, i) => {
          const isYou = name === "You";
          return (
            <div key={name} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 14px", borderRadius: "10px",
              background: isYou ? "rgba(0,168,98,0.07)" : "rgba(13,13,13,0.03)",
              border: isYou ? "1px solid rgba(0,168,98,0.18)" : `1px solid ${C.border}`,
              transition: "background 0.5s ease, border 0.5s ease",
              opacity: open ? 1 : 0,
              transform: open ? "translateX(0)" : "translateX(-10px)",
              transitionDelay: `${i * 0.07}s`,
            }}>
              <span style={{ fontSize: "11px", fontWeight: 800, color: isYou ? C.green : C.muted, minWidth: "18px" }}>
                0{i + 1}
              </span>
              <span style={{ fontSize: "14px", fontWeight: isYou ? 700 : 400, color: isYou ? C.black : C.muted, flex: 1 }}>
                {name}
              </span>
              {isYou && youPos > 0 && (
                <span style={{ fontSize: "11px", fontWeight: 600, color: C.green }}>↑ climbing</span>
              )}
              {isYou && youPos === 0 && (
                <span style={{ fontSize: "11px", fontWeight: 600, color: C.green }}>✦ #1</span>
              )}
              <span style={{ fontSize: "12px", fontWeight: 700, color: isYou ? C.green : "rgba(13,13,13,0.15)" }}>
                $1
              </span>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.65, borderTop: `1px solid ${C.border}`, paddingTop: "16px" }}>
        Your name appears here after donating.{" "}
        <span style={{ color: C.black }}>Visible to everyone who visits. This is legacy. This costs one dollar.</span>
      </p>
    </div>
  );
}

// ── CARD WRAPPER ──────────────────────────────────────────────────────────────
function ReasonCard({
  num, title, sub, active, dimmed, inView, delay, onOpen, onClose, children,
}: {
  num: string; title: string; sub: string;
  active: boolean; dimmed: boolean; inView: boolean; delay: number;
  onOpen: () => void; onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      position: "relative",
      // Same size always (keeps the whole section one-screen).
      // Expanded content scrolls inside the card.
      height: "clamp(420px, 52vh, 560px)",
      gridColumn: active ? "1 / -1" : "auto",
      opacity: inView ? (dimmed ? 0.45 : 1) : 0,
      transform: inView
        ? active ? "translateY(-8px) scale(1.01)" : dimmed ? "scale(0.99)" : "translateY(0) scale(1)"
        : "translateY(24px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.5s cubic-bezier(0.32,0.72,0,1), box-shadow 0.3s ease, z-index 0s`,
      zIndex: active ? 10 : 1,
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
          display: "flex",
          flexDirection: "column",
          boxShadow: active
            ? "0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,168,98,0.1)"
            : "0 2px 8px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Green top line on active */}
        <div style={{
          height: "3px",
          background: C.green,
          width: active ? "100%" : "0%",
          transition: "width 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }} />

        <div style={{ padding: "32px 28px 28px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              {num}
            </div>
            {active && (
              <button
                onClick={e => { e.stopPropagation(); onClose(); }}
                style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(13,13,13,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: C.muted, flexShrink: 0 }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Title — always visible */}
          <h3 style={{
            fontSize: "clamp(20px, 2.4vw, 26px)", fontWeight: 900,
            letterSpacing: "-0.03em", lineHeight: 1.05,
            color: C.black, marginBottom: "10px",
            fontFamily: "Inter, sans-serif",
          }}>
            {title}
          </h3>
          <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.6, marginBottom: active ? "24px" : "28px" }}>
            {sub}
          </p>

          {/* Detail content — fades in */}
          <div style={{
            flex: 1,
            minHeight: 0,
            maxHeight: active ? "999px" : "0px",
            overflow: active ? "auto" : "hidden",
            paddingRight: active ? "8px" : 0,
            opacity: active ? 1 : 0,
            transition: "max-height 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
          }}>
            {children}
          </div>

          {/* See it arrow — only when collapsed */}
          {!active && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: dimmed ? 0 : 1, transition: "opacity 0.2s ease" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
                </svg>
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: C.black }}>See it</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function WhySection({ onDonateClick }: { onDonateClick?: () => void }) {
  const secRef = useRef<HTMLDivElement>(null!);
  const inView = useInView(secRef);
  const [active, setActive] = useState<number | null>(null);

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
      `}</style>

      <section id="why" ref={secRef} style={{ background: C.bg, padding: "120px 80px 100px", fontFamily: "Inter, sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "80px", right: "80px", height: "1px", background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />

        {/* Header */}
        <div style={{ maxWidth: "1100px", margin: "0 auto 72px", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: C.green, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "18px" }}>What you get</div>
          <h2 style={{ fontSize: "clamp(44px, 7vw, 80px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95, color: C.black }}>
            What you get<br />
            <span style={{ color: C.green }}>from donating.</span>
          </h2>
          <p style={{ fontSize: "16px", color: C.muted, maxWidth: "360px", lineHeight: 1.65, marginTop: "22px" }}>
            Three things. All real. Click each to see.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px",
            alignItems: "start",
          }}
        >
          {cards.map((c, i) => (
            <ReasonCard
              key={i} num={c.num} title={c.title} sub={c.sub}
              active={active === i}
              dimmed={active !== null && active !== i}
              inView={inView}
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

        {/* Bottom CTA */}
        <div style={{ maxWidth: "1100px", margin: "56px auto 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", opacity: inView ? 1 : 0, transition: "opacity 0.7s ease 0.55s" }}>
          <p style={{ fontSize: "15px", color: C.muted, lineHeight: 1.6, maxWidth: "360px" }}>
            These three things are real.{" "}
            <span style={{ color: C.black, fontWeight: 500 }}>They are yours for one dollar.</span>
          </p>
          <button onClick={onDonateClick}
            style={{ padding: "14px 36px", borderRadius: "100px", background: C.black, color: "#fff", border: "none", fontSize: "15px", fontWeight: 700, fontFamily: "Inter, sans-serif", cursor: "pointer", letterSpacing: "-0.01em", transition: "transform 0.2s ease" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
            Donate $1 Now
          </button>
        </div>
      </section>
    </>
  );
}
