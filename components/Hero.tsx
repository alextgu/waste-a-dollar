"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const C = {
  bg:         "#F0EDE8",
  green:      "#00A862",
  black:      "#0D0D0D",
  muted:      "rgba(13,13,13,0.4)",
  card:       "#0a0d0b",
  cardBorder: "rgba(255,255,255,0.07)",
};

// Phone screen colors stay dark
const PC = {
  green:  "#00C87A",
  white:  "#FFFFFF",
  muted:  "rgba(255,255,255,0.35)",
  border: "rgba(255,255,255,0.07)",
};

// ── WHY BUTTON ────────────────────────────────────────────────────────────────
function WhyButton({ onClick }: { onClick?: () => void }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={
        onClick ??
        (() => {
          document
            .getElementById("why")
            ?.scrollIntoView({ behavior: "smooth" });
        })
      }
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        background: "transparent",
        border: "none",
        padding: "0",
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: 500,
        color: hov ? C.black : C.muted,
        letterSpacing: "-0.01em",
        transition: "color 0.2s ease",
        marginTop: "4px",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: `1px solid ${hov ? C.black : "rgba(13,13,13,0.25)"}`,
          fontSize: "10px",
          fontWeight: 700,
          transition: "border-color 0.2s ease",
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        ?
      </span>
      Why would I do that
      <span
        style={{
          fontSize: "14px",
          opacity: hov ? 1 : 0.4,
          transform: hov ? "translateX(2px)" : "translateX(0)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        →
      </span>
    </button>
  );
}

// ── SCRAMBLE ──────────────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function useScramble(target: string, trigger: number) {
  const [out, setOut] = useState(target);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    const t0 = performance.now(), dur = 640;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const resolved = Math.floor(p * target.length);
      let s = "";
      for (let i = 0; i < target.length; i++) {
        if (target[i] === " " || target[i] === "\n") { s += target[i]; continue; }
        s += i < resolved ? target[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setOut(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current !== null) cancelAnimationFrame(raf.current); };
  }, [trigger, target]);
  return out;
}

// ── COUNT UP ──────────────────────────────────────────────────────────────────
function useCountUp(target: number, dur = 2000, go = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!go) return;
    let r: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setV(+(((1 - Math.pow(1 - p, 3)) * target)).toFixed(2));
      if (p < 1) r = requestAnimationFrame(tick);
    };
    r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [go, target, dur]);
  return v;
}

// ── PHONE SCREENS ─────────────────────────────────────────────────────────────
const SCREENS = [
  { type: "amount",  label: "Alex's balance"   },
  { type: "receipt", label: "Latest donation"  },
  { type: "board",   label: "Leaderboard"      },
  { type: "cert",    label: "Your certificate" },
];
const NAMES = ["YOU", "Sam K.", "Riley P.", "Chris T.", "Alex B.", "Dana W."];

function PhoneScreen({
  screen,
  visible,
  donationCount,
  donationTotal,
}: {
  screen: (typeof SCREENS)[number];
  visible: boolean;
  donationCount: number;
  donationTotal: number;
}) {
  const [go, setGo] = useState(false);
  const [names, setNames] = useState(NAMES.slice(0, 4));
  const amount = useCountUp(donationTotal, 2000, go);

  useEffect(() => {
    const t = setTimeout(() => setGo(visible), visible ? 400 : 0);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (screen.type !== "board" || !visible) return;
    const id = setInterval(() => {
      setNames(prev => {
        const next = [...prev];
        const i = Math.floor(Math.random() * 3) + 1;
        const j = Math.floor(Math.random() * 3) + 1;
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    }, 1600);
    return () => clearInterval(id);
  }, [screen.type, visible]);

  const wrap: React.CSSProperties = {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column", padding: "24px 22px",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.97)",
    transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
  };

  if (screen.type === "amount") return (
    <div style={wrap}>
      <span style={{ fontSize: "10px", fontWeight: 500, color: PC.muted, letterSpacing: "0.07em", textTransform: "uppercase" }}>Total donated to Alex</span>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-0.04em", color: PC.white, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          ${amount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span style={{ fontSize: "12px", color: PC.muted }}>and counting</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: PC.green, animation: "pulse 2.5s ease-in-out infinite", flexShrink: 0 }} />
        <span style={{ fontSize: "11px", color: PC.muted }}>
          <span style={{ color: PC.white, fontWeight: 600 }}>
            {donationCount.toLocaleString("en-US")}
          </span>{" "}
          total donor{donationCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );

  if (screen.type === "receipt") return (
    <div style={wrap}>
      <span style={{ fontSize: "10px", fontWeight: 500, color: PC.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "16px" }}>Latest donation</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1 }}>
        <div style={{ background: "rgba(0,200,122,0.08)", borderRadius: "12px", border: "1px solid rgba(0,200,122,0.15)", padding: "14px", display: "flex", flexDirection: "column", gap: "3px", transform: go ? "translateY(0)" : "translateY(-10px)", opacity: go ? 1 : 0, transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.5s ease 0.1s" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: PC.green }}>$1.00 received</span>
          <span style={{ fontSize: "10px", color: PC.muted }}>from YOU. · just now</span>
        </div>
        {[{ label: "Amount", value: "$1.00", accent: true }, { label: "To", value: "Alex", accent: false }, { label: "Fees", value: "$0.00", accent: false }, { label: "Net", value: "$1.00", accent: true }].map(({ label, value, accent }, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < 3 ? `1px solid ${PC.border}` : "none", paddingBottom: i < 3 ? "13px" : "0", transform: go ? "translateY(0)" : "translateY(10px)", opacity: go ? 1 : 0, transition: `transform 0.5s ease ${0.2 + i * 0.09}s, opacity 0.5s ease ${0.2 + i * 0.09}s` }}>
            <span style={{ fontSize: "11px", color: PC.muted }}>{label}</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: accent ? PC.green : PC.white }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (screen.type === "board") return (
    <div style={wrap}>
      <span style={{ fontSize: "10px", fontWeight: 500, color: PC.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "16px" }}>Leaderboard</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        {names.map((name, i) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "10px", background: i === 0 ? "rgba(0,200,122,0.08)" : "transparent", border: i === 0 ? "1px solid rgba(0,200,122,0.15)" : "1px solid transparent", transition: "background 0.7s ease, border 0.7s ease" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: i === 0 ? PC.green : PC.muted, minWidth: "14px" }}>{i + 1}</span>
            <span style={{ fontSize: "12px", fontWeight: i === 0 ? 600 : 400, color: i === 0 ? PC.white : PC.muted, flex: 1 }}>{name}</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: i === 0 ? PC.green : "rgba(255,255,255,0.2)" }}>$1</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ ...wrap, alignItems: "center", justifyContent: "center", gap: "14px" }}>
      <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(0,200,122,0.1)", border: "1px solid rgba(0,200,122,0.2)", display: "flex", alignItems: "center", justifyContent: "center", transform: go ? "scale(1)" : "scale(0.6)", opacity: go ? 1 : 0, transition: "transform 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s, opacity 0.4s ease 0.1s" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={PC.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
      </div>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "5px" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: PC.white, letterSpacing: "-0.02em", display: "block", transform: go ? "translateY(0)" : "translateY(8px)", opacity: go ? 1 : 0, transition: "transform 0.5s ease 0.2s, opacity 0.5s ease 0.2s" }}>Certificate Issued</span>
        <span style={{ fontSize: "11px", color: PC.muted, display: "block", transform: go ? "translateY(0)" : "translateY(8px)", opacity: go ? 1 : 0, transition: "transform 0.5s ease 0.3s, opacity 0.5s ease 0.3s" }}>Awarded to YOU<br />for donating $1 to Alex</span>
      </div>
      <div style={{ padding: "7px 14px", borderRadius: "100px", background: "rgba(0,200,122,0.1)", border: "1px solid rgba(0,200,122,0.2)", fontSize: "10px", fontWeight: 600, color: PC.green, letterSpacing: "0.05em", transform: go ? "translateY(0)" : "translateY(8px)", opacity: go ? 1 : 0, transition: "transform 0.5s ease 0.4s, opacity 0.5s ease 0.4s" }}>OFFICIAL · 2026</div>
    </div>
  );
}

// ── PHONE ─────────────────────────────────────────────────────────────────────
function Phone({
  donationCount,
  donationTotal,
}: {
  donationCount: number;
  donationTotal: number;
}) {
  const [screen, setScreen] = useState(0);
  const [glareX, setGlareX] = useState(30);
  const [glareY, setGlareY] = useState(20);

  useEffect(() => {
    const id = setInterval(() => setScreen(s => (s + 1) % SCREENS.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 0.015;
      setGlareX(28 + Math.sin(t * 0.7) * 8);
      setGlareY(16 + Math.cos(t * 0.5) * 6);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const RADIUS = 46, BEZEL = 10, SCREEN_R = 36;

  return (
    <div style={{ position: "relative", width: "260px", height: "530px", flexShrink: 0 }}>
      {[{ side: "left", top: "78px", h: "22px" }, { side: "left", top: "110px", h: "32px" }, { side: "left", top: "154px", h: "32px" }, { side: "right", top: "130px", h: "52px" }].map(({ side, top, h }, i) => (
        <div key={i} style={{ position: "absolute", [side]: "-3px", top, height: h, width: "3px", borderRadius: side === "left" ? "3px 0 0 3px" : "0 3px 3px 0", background: "linear-gradient(180deg,#222 0%,#2e2e2e 40%,#222 100%)", boxShadow: side === "left" ? "-1px 0 3px rgba(0,0,0,0.3)" : "1px 0 3px rgba(0,0,0,0.3)" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, borderRadius: `${RADIUS}px`, background: "linear-gradient(145deg,#2a2a2a 0%,#181818 35%,#111 60%,#1e1e1e 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(255,255,255,0.04) inset, 0 -1px 2px rgba(0,0,0,0.9) inset, 0 40px 80px rgba(0,0,0,0.25), 0 20px 40px rgba(0,0,0,0.15)" }} />
      <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)", borderRadius: "100px" }} />
      <div style={{ position: "absolute", inset: `${BEZEL}px`, borderRadius: `${SCREEN_R}px`, background: "#000", overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#060d09 0%,#030806 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, padding: "14px 24px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${PC.border}` }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>9:41</span>
          <div style={{ width: "88px", height: "26px", borderRadius: "100px", background: "#000", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1a1a1a" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#111" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ display: "flex", gap: "2px", alignItems: "flex-end" }}>
              {[3, 5, 7, 9].map((h, i) => <div key={i} style={{ width: "3px", height: `${h}px`, borderRadius: "1px", background: i < 3 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)" }} />)}
            </div>
            <div style={{ width: "18px", height: "10px", borderRadius: "2px", border: "1px solid rgba(255,255,255,0.3)", position: "relative", marginLeft: "2px" }}>
              <div style={{ position: "absolute", inset: "1px", right: "3px", background: PC.green, borderRadius: "1px" }} />
              <div style={{ position: "absolute", right: "-3px", top: "50%", transform: "translateY(-50%)", width: "2px", height: "5px", borderRadius: "0 1px 1px 0", background: "rgba(255,255,255,0.2)" }} />
            </div>
          </div>
        </div>
        <div style={{ padding: "10px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
          <span style={{ fontSize: "10px", fontWeight: 500, color: "rgba(0,200,122,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{SCREENS[screen].label}</span>
          <div style={{ display: "flex", gap: "3px" }}>
            {SCREENS.map((_, i) => <div key={i} style={{ width: i === screen ? "14px" : "4px", height: "3px", borderRadius: "100px", background: i === screen ? PC.green : "rgba(255,255,255,0.1)", transition: "width 0.4s ease, background 0.4s ease" }} />)}
          </div>
        </div>
        <div style={{ position: "relative", height: "calc(100% - 88px)", zIndex: 10 }}>
          {SCREENS.map((s, i) => (
            <PhoneScreen
              key={s.type}
              screen={s}
              visible={i === screen}
              donationCount={donationCount}
              donationTotal={donationTotal}
            />
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none", background: `radial-gradient(ellipse 55% 40% at ${glareX}% ${glareY}%, rgba(255,255,255,0.04) 0%, transparent 70%)`, transition: "background 0.8s ease", borderRadius: `${SCREEN_R}px` }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 19, pointerEvents: "none", boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)", borderRadius: `${SCREEN_R}px` }} />
        <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", width: "100px", height: "4px", borderRadius: "100px", background: "rgba(255,255,255,0.2)", zIndex: 20 }} />
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: `${RADIUS}px`, background: "linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 40%)", pointerEvents: "none" }} />
    </div>
  );
}

// ── WARM BACKGROUND ───────────────────────────────────────────────────────────
function WarmBackground() {
  return (
    <>
      {/* Base warm gradient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(135deg, #EDE8E1 0%, #F4F0EB 40%, #EAE5DE 70%, #F0EDE8 100%)",
      }} />

      {/* Orb 1 — large green top-right, very faint */}
      <div style={{
        position: "absolute", top: "-15%", right: "-10%",
        width: "700px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,168,98,0.07) 0%, transparent 65%)",
        pointerEvents: "none",
        animation: "orbDrift1 18s ease-in-out infinite",
      }} />

      {/* Orb 2 — warm cream bottom-left */}
      <div style={{
        position: "absolute", bottom: "-10%", left: "-5%",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,160,130,0.12) 0%, transparent 65%)",
        pointerEvents: "none",
        animation: "orbDrift2 14s ease-in-out infinite",
      }} />

      {/* Orb 3 — mid green center-right (behind phone) */}
      <div style={{
        position: "absolute", top: "30%", right: "15%",
        width: "400px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,168,98,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        animation: "orbDrift3 20s ease-in-out infinite",
        filter: "blur(8px)",
      }} />

      {/* Very subtle vignette edges */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(200,190,178,0.25) 100%)",
      }} />
    </>
  );
}

// ── HEADLINES ─────────────────────────────────────────────────────────────────
const LINES = [
  "Waste a dollar.\nFor Alex.",
  "You were going\nto waste it\nanyway.",
  "One dollar.\nThat's it.",
  "The financially\nresponsible\nchoice.",
];

// ── HERO ──────────────────────────────────────────────────────────────────────
interface HeroProps {
  onDonateClick?: () => void;
  videoSrc?: string;   // same video passed to LoadingScreen for seamless handoff
  donationCount?: number;
  donationTotal?: number;
}

export default function Hero({
  onDonateClick,
  videoSrc,
  donationCount = 0,
  donationTotal = 0,
}: HeroProps) {
  const [mounted, setMounted]       = useState(false);
  const [lineIdx, setLineIdx]       = useState(0);
  const [trigger, setTrigger]       = useState(0);
  const [txtVisible, setTxtVisible] = useState(true);
  const [meme67RunId, setMeme67RunId] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const next = useCallback(() => {
    setTxtVisible(false);
    setTimeout(() => {
      setLineIdx(i => (i + 1) % LINES.length);
      setTrigger(t => t + 1);
      setTxtVisible(true);
    }, 200);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const scrambled = useScramble(LINES[lineIdx], trigger);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { background:${C.bg}; }
        @keyframes pulse    { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
        @keyframes fadeIn   { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:none;} }
        @keyframes navIn    { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:none;} }
        @keyframes phoneFloat {
          0%,100% { transform:translateY(0px) rotate(-1.5deg); }
          50%     { transform:translateY(-7px) rotate(-1.5deg); }
        }
        @keyframes orbDrift1 {
          0%,100% { transform:translate(0,0) scale(1); }
          33%     { transform:translate(-3%,4%) scale(1.04); }
          66%     { transform:translate(2%,-3%) scale(0.97); }
        }
        @keyframes orbDrift2 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%     { transform:translate(3%,-4%) scale(1.06); }
        }
        @keyframes orbDrift3 {
          0%,100% { transform:translate(0,0) scale(1); }
          40%     { transform:translate(-2%,5%) scale(1.08); }
          80%     { transform:translate(3%,-2%) scale(0.95); }
        }

        /* 67 meme: 6 goes up while 7 goes down, repeat 6 times. */
        @keyframes memeSix {
          0%   { transform: translateY(0); }
          25%  { transform: translateY(-10px); }
          50%  { transform: translateY(0); }
          75%  { transform: translateY(10px); }
          100% { transform: translateY(0); }
        }
        @keyframes memeSeven {
          0%   { transform: translateY(0); }
          25%  { transform: translateY(10px); }
          50%  { transform: translateY(0); }
          75%  { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 56px", height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "transparent",
        borderBottom: "none",
        animation: "navIn 0.6s ease 0.1s both",
        fontFamily: "Inter, sans-serif",
      }}>
        <span style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.04em", color: C.green }}>
          waste a dollar.
        </span>
        <button onClick={onDonateClick} style={{
          padding: "10px 24px", borderRadius: "100px",
          background: "rgba(13,13,13,0.92)",
          color: C.green,
          border: "1px solid rgba(0,168,98,0.28)",
          boxShadow: "0 10px 26px rgba(0,0,0,0.16)",
          fontSize: "13px", fontWeight: 800,
          fontFamily: "Inter, sans-serif", cursor: "pointer",
          letterSpacing: "-0.01em",
          transition: "opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        }}>
          Donate $1
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px 80px 80px",
        position: "relative", overflow: "hidden",
        fontFamily: "Inter, sans-serif",
        gap: "80px",
      }}>

        <WarmBackground />

        {/* LEFT */}
        <div style={{ flex: 1, maxWidth: "480px", display: "flex", flexDirection: "column", gap: "36px", position: "relative", zIndex: 2 }}>

          <h1 style={{
            fontSize: "clamp(50px, 5.5vw, 78px)",
            fontWeight: 900, lineHeight: 0.94, letterSpacing: "-0.04em",
            minHeight: "clamp(110px, 15vw, 160px)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            opacity: txtVisible ? 1 : 0,
            transform: txtVisible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}>
            {scrambled.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block", color: i === 1 ? C.green : C.black }}>{line}</span>
            ))}
          </h1>

          <p style={{
            fontSize: "17px", fontWeight: 400, color: C.muted, lineHeight: 1.7,
            letterSpacing: "-0.01em", maxWidth: "360px",
            animation: mounted ? "fadeIn 0.8s ease 1s both" : "none",
            opacity: mounted ? undefined : 0,
          }}>
            You will spend a dollar today on something meaningless.{" "}
            <span style={{ color: C.black }}>It could go to Alex instead.</span>
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px", animation: mounted ? "fadeIn 0.8s ease 1.2s both" : "none", opacity: mounted ? undefined : 0 }}>
            <button onClick={onDonateClick} style={{
              padding: "16px 40px", borderRadius: "100px",
              background: "rgba(13,13,13,0.92)",
              color: C.green,
              border: "1px solid rgba(0,168,98,0.28)",
              boxShadow: "0 18px 44px rgba(0,0,0,0.18)",
              fontSize: "16px", fontWeight: 800,
              fontFamily: "Inter, sans-serif", cursor: "pointer",
              letterSpacing: "-0.01em",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}>
              Donate $1 Now
            </button>
            <WhyButton />
            <button
              type="button"
              onClick={() => setMeme67RunId((v) => v + 1)}
              style={{
                fontSize: "12px",
                color: C.muted,
                paddingLeft: "4px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
              aria-label="Animate 6 and 7"
            >
              Takes{" "}
              <span
                key={`six-${meme67RunId}`}
                style={{
                  display: "inline-block",
                  animation: "memeSix 0.38s linear 0s 6",
                }}
              >
                6
              </span>
              -
              <span
                key={`seven-${meme67RunId}`}
                style={{
                  display: "inline-block",
                  animation: "memeSeven 0.38s linear 0s 6",
                }}
              >
                7
              </span>{" "}
              seconds. No account needed.
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "9px", animation: mounted ? "fadeIn 0.8s ease 1.4s both" : "none", opacity: mounted ? undefined : 0 }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green, flexShrink: 0, animation: "pulse 2.8s ease-in-out infinite" }} />
            <span style={{ fontSize: "13px", color: C.muted }}>
              {donationCount === 0 ? (
                <span style={{ color: C.black, fontWeight: 600 }}>
                  Be the first!
                </span>
              ) : (
                <>
                  <span style={{ color: C.black, fontWeight: 600 }}>
                    {donationCount.toLocaleString("en-US")}
                  </span>{" "}
                  {donationCount === 1 ? "person" : "people"} already donated
                </>
              )}
            </span>
          </div>
        </div>

        {/* RIGHT — video hand OR phone mockup */}
        <div style={{
          position: "relative", zIndex: 2, flexShrink: 0,
          animation: mounted ? "fadeIn 1s ease 0.5s both" : "none",
          opacity: mounted ? undefined : 0,
        }}>
          {videoSrc ? (
            // ── REAL HAND VIDEO ──
            <div style={{
              width: "320px", height: "540px",
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.18), 0 16px 32px rgba(0,0,0,0.1)",
              animation: "phoneFloat 8s ease-in-out infinite",
            }}>
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
          ) : (
            // ── CSS MOCKUP (fallback until video is ready) ──
            <>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "340px", height: "460px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,168,98,0.09) 0%, transparent 70%)", transform: "translate(-50%, -50%)", filter: "blur(32px)", pointerEvents: "none" }} />
              <div style={{ animation: "phoneFloat 8s ease-in-out infinite" }}>
                <Phone donationCount={donationCount} donationTotal={donationTotal} />
              </div>
              <div style={{ position: "absolute", bottom: "-24px", left: "50%", transform: "translateX(-50%)", width: "180px", height: "30px", background: "radial-gradient(ellipse, rgba(0,0,0,0.1) 0%, transparent 70%)", filter: "blur(12px)" }} />
            </>
          )}
        </div>

      </section>
    </>
  );
}
