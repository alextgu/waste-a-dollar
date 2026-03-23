"use client";

import { useEffect, useRef, useState, useCallback, useMemo, useId, useLayoutEffect } from "react";

const C = {
  bg:         "#F0EDE8",
  green:      "#00A862",
  black:      "#0D0D0D",
  muted:      "rgba(13,13,13,0.4)",
  card:       "#0a0d0b",
  cardBorder: "rgba(255,255,255,0.07)",
};

const PC = {
  green:  "#00C87A",
  white:  "#FFFFFF",
  muted:  "rgba(255,255,255,0.35)",
  border: "rgba(255,255,255,0.07)",
};

// ── MOUSE POSITION HOOK ───────────────────────────────────────────────────────
function useMousePos() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

// ── FLOATING DOLLAR PARTICLES ─────────────────────────────────────────────────
function FloatingDollars() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; label: string }>>([]);
  const idRef = useRef(0);
  useEffect(() => {
    const LABELS = ["$1", "$1", "$1", "$1.00", "$1"];
    const spawn = () => {
      setParticles(prev => [
        ...prev.slice(-5),
        { id: idRef.current++, x: 4 + Math.random() * 88, label: LABELS[Math.floor(Math.random() * LABELS.length)] },
      ]);
    };
    const id = setInterval(spawn, 2700);
    spawn();
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 1 }}>
      {particles.map(p => (
        <span key={p.id} style={{
          position: "absolute", left: `${p.x}%`, bottom: "-30px",
          fontSize: "10px", fontWeight: 800, fontFamily: "Inter, sans-serif",
          color: C.green, opacity: 0, letterSpacing: "-0.03em",
          animation: "floatUp 5.5s ease-in forwards", userSelect: "none",
        }}>{p.label}</span>
      ))}
    </div>
  );
}

// ── TICKER TAPE ───────────────────────────────────────────────────────────────
// Deadpan brand marquee pinned to the bottom of the hero.
// Duplicated (k=0,1) so the loop is perfectly seamless.
const TICKER_ITEMS = [
  { text: "$1",             accent: true  },
  { text: "WASTE A DOLLAR", accent: false },
  { text: "FOR ALEX",       accent: false },
  { text: "$1",             accent: true  },
  { text: "JUST A DOLLAR",  accent: false },
  { text: "$1",             accent: true  },
  { text: "WASTE A DOLLAR", accent: false },
  { text: "FOR ALEX",       accent: false },
  { text: "$1",             accent: true  },
  { text: "ONE DOLLAR",     accent: false },
  { text: "FOR ALEX",       accent: false },
  { text: "$1",             accent: true  },
  { text: "WASTE A DOLLAR", accent: false },
];

function TickerTape() {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: "34px",
      overflow: "hidden", pointerEvents: "none", zIndex: 3,
      borderTop: "1px solid rgba(13,13,13,0.06)",
      display: "flex", alignItems: "center",
      background: "linear-gradient(to top, rgba(220,215,205,0.5) 0%, transparent 100%)",
    }}>
      <div style={{
        display: "flex", whiteSpace: "nowrap",
        animation: "tickerScroll 28s linear infinite",
        fontSize: "9px", fontWeight: 700, fontFamily: "Inter, sans-serif",
        letterSpacing: "0.09em", textTransform: "uppercase",
      }}>
        {[0, 1].map(k => (
          <span key={k} style={{ display: "inline-flex", alignItems: "center" }}>
            {TICKER_ITEMS.map(({ text, accent }, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                <span style={{ color: accent ? C.green : "rgba(13,13,13,0.22)", opacity: accent ? 0.85 : 1 }}>
                  {text}
                </span>
                <span style={{ color: "rgba(13,13,13,0.15)", padding: "0 16px" }}>·</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── WHY BUTTON ────────────────────────────────────────────────────────────────
function WhyButton({ onClick }: { onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick ?? (() => { document.getElementById("why")?.scrollIntoView({ behavior: "smooth" }); })}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "7px",
        background: "transparent", border: "none", padding: "0", cursor: "pointer",
        fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500,
        color: hov ? C.black : C.muted, letterSpacing: "-0.01em",
        transition: "color 0.2s ease", marginTop: "4px",
      }}
    >
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: "18px", height: "18px", borderRadius: "50%",
        border: `1px solid ${hov ? C.black : "rgba(13,13,13,0.25)"}`,
        fontSize: "10px", fontWeight: 700, transition: "border-color 0.2s ease", flexShrink: 0, lineHeight: 1,
      }}>?</span>
      Why would I do that
      <span style={{ fontSize: "14px", opacity: hov ? 1 : 0.4, transform: hov ? "translateX(2px)" : "translateX(0)", transition: "opacity 0.2s ease, transform 0.2s ease" }}>→</span>
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

// ── SCREEN CONFIG ─────────────────────────────────────────────────────────────
const SCREENS = [
  { type: "amount",    label: "Alex's balance" },
  { type: "txfeed",   label: "Activity"        },
  { type: "analytics",label: "Donations"       },
  { type: "card",     label: "Member card"     },
  { type: "cert",     label: "Purchase"          },
];

// ── AMOUNT SCREEN ─────────────────────────────────────────────────────────────
function AmountScreen({ visible, donationCount, donationTotal }: {
  visible: boolean; donationCount: number; donationTotal: number;
}) {
  const [go, setGo] = useState(false);
  const amount = useCountUp(donationTotal, 2000, go);
  useEffect(() => {
    const t = setTimeout(() => setGo(visible), visible ? 400 : 0);
    return () => clearTimeout(t);
  }, [visible]);

  const wrap: React.CSSProperties = {
    position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "24px 22px",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.97)",
    transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
  };
  return (
    <div style={wrap}>
      <span style={{ fontSize: "10px", fontWeight: 500, color: PC.muted, letterSpacing: "0.07em", textTransform: "uppercase" }}>
        Total donated to Alex
      </span>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-0.04em", color: PC.white, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          ${amount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span style={{ fontSize: "12px", color: PC.muted }}>and counting</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: PC.green, animation: "pulse 2.5s ease-in-out infinite", flexShrink: 0 }} />
        <span style={{ fontSize: "11px", color: PC.muted }}>
          <span style={{ color: PC.white, fontWeight: 600 }}>{donationCount.toLocaleString("en-US")}</span>{" "}
          total donor{donationCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

// ── TX FEED SCREEN ────────────────────────────────────────────────────────────
// Revolut-style bank statement. Merchant: ALEX (PERSONAL). Deadpan notes.
const TX_ROWS = [
  { note: "no reason.",     time: "just now",   fresh: true  },
  { note: "felt like it.",  time: "2 days ago", fresh: false },
  { note: "peer pressure.", time: "last week",  fresh: false },
];

function TxFeedScreen({ visible }: { visible: boolean }) {
  const wrap: React.CSSProperties = {
    position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "20px",
    opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
  };
  return (
    <div style={wrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, color: PC.muted, letterSpacing: "0.07em", textTransform: "uppercase" }}>Recent activity</span>
        <span style={{ fontSize: "9px", color: "rgba(0,200,122,0.5)", fontWeight: 600, letterSpacing: "0.04em" }}>ALL · $1</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
        {TX_ROWS.map(({ note, time, fresh }, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 10px", borderRadius: "10px",
            background: fresh ? "rgba(0,200,122,0.06)" : "transparent",
            border: `1px solid ${fresh ? "rgba(0,200,122,0.12)" : "transparent"}`,
            transform: visible ? "translateX(0)" : "translateX(-8px)",
            opacity: visible ? 1 : 0,
            transition: `transform 0.45s ease ${0.1 + i * 0.09}s, opacity 0.45s ease ${0.1 + i * 0.09}s`,
          }}>
            {/* Avatar */}
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, rgba(0,200,122,0.22) 0%, rgba(0,80,45,0.35) 100%)",
              border: "1px solid rgba(0,200,122,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 900, color: PC.green,
            }}>A</div>
            {/* Name + note */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: PC.white, letterSpacing: "-0.01em" }}>Alex</span>
                <span style={{ fontSize: "8px", color: PC.muted, letterSpacing: "0.04em", textTransform: "uppercase" }}>PERSONAL</span>
              </div>
              <div style={{ fontSize: "9px", color: PC.muted, marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {note} · {time}
              </div>
            </div>
            {/* Amount */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: fresh ? PC.green : "rgba(255,255,255,0.4)" }}>−$1.00</div>
              <div style={{ fontSize: "8px", color: PC.muted, marginTop: "1px" }}>USD</div>
            </div>
          </div>
        ))}
      </div>
      {/* Summary footer */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "9px", marginTop: "4px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        transform: visible ? "translateY(0)" : "translateY(6px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s ease 0.38s, opacity 0.4s ease 0.38s",
      }}>
        <div>
          <div style={{ fontSize: "8px", color: PC.muted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1px" }}>Total to Alex</div>
          <div style={{ fontSize: "11px", fontWeight: 800, color: PC.green, letterSpacing: "-0.02em" }}>$3.00</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "8px", color: PC.muted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1px" }}>Category</div>
          <div style={{ fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.02em" }}>Misc. generosity</div>
        </div>
      </div>
    </div>
  );
}

// ── ANALYTICS SCREEN ──────────────────────────────────────────────────────────
// Donation totals only — chart from $0, step-up by donor count; live API stats.
const CHART_VB = { w: 200, h: 60, yTop: 10, yBot: 52 };

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function buildPortfolioPaths(total: number, count: number) {
  const { w: W, h: H, yTop, yBot } = CHART_VB;
  const maxV = Math.max(total, 1);
  const yAt = (v: number) => {
    const t = Math.min(Math.max(v / maxV, 0), 1);
    return yBot - t * (yBot - yTop);
  };

  // $0 baseline when empty; flat line across
  if (count <= 0 && total <= 0) {
    const y = yAt(0);
    const line = `M 0 ${y} L ${W} ${y}`;
    const fill = `${line} L ${W} ${H} L 0 ${H} Z`;
    return {
      line,
      fill,
      dot: null as { cx: number; cy: number } | null,
      maxV: 1,
      yLabels: { hi: formatUsd(1), mid: formatUsd(0.5), lo: formatUsd(0) },
    };
  }

  // Donations recorded but count mismatch — single rise toward the end
  if (count <= 0 && total > 0) {
    const y0 = yAt(0);
    const y1 = yAt(total);
    const xBreak = W * 0.72;
    const line = `M 0 ${y0} L ${xBreak} ${y0} L ${xBreak} ${y1} L ${W} ${y1}`;
    const fill = `${line} L ${W} ${H} L 0 ${H} Z`;
    return {
      line,
      fill,
      dot: { cx: W - 6, cy: y1 },
      maxV,
      yLabels: {
        hi: formatUsd(maxV),
        mid: formatUsd(maxV / 2),
        lo: formatUsd(0),
      },
    };
  }

  let d = "";
  let yPrev = yAt(0);
  d += `M 0 ${yPrev}`;
  for (let i = 1; i <= count; i++) {
    const x = (i / count) * W;
    const cum = (i / count) * total;
    const yi = yAt(cum);
    d += ` L ${x} ${yPrev}`;
    d += ` L ${x} ${yi}`;
    yPrev = yi;
  }
  d += ` L ${W} ${yPrev}`;
  const fill = `${d} L ${W} ${H} L 0 ${H} Z`;
  return {
    line: d,
    fill,
    dot: { cx: W - 4, cy: yPrev },
    maxV,
    yLabels: {
      hi: formatUsd(maxV),
      mid: formatUsd(maxV / 2),
      lo: formatUsd(0),
    },
  };
}

function AnalyticsScreen({
  visible,
  donationCount,
  donationTotal,
}: {
  visible: boolean;
  donationCount: number;
  donationTotal: number;
}) {
  const [go, setGo] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(400);
  const chartGradId = useId().replace(/:/g, "");

  const chart = useMemo(
    () => buildPortfolioPaths(donationTotal, donationCount),
    [donationTotal, donationCount]
  );

  useEffect(() => {
    const t = setTimeout(() => setGo(visible), visible ? 280 : 0);
    return () => clearTimeout(t);
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible || !pathRef.current) return;
    const L = pathRef.current.getTotalLength();
    if (L > 0) setPathLen(L);
  }, [chart.line, visible, go]);

  const wrap: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    padding: "14px 16px 12px",
    minHeight: 0,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
  };

  const headline = formatUsd(donationTotal);
  const showDot = chart.dot != null && donationTotal > 0;
  const tipText =
    donationCount <= 0 ? "" : donationCount === 1 ? `+${formatUsd(donationTotal)}` : `${donationCount}× · ${formatUsd(donationTotal)}`;

  return (
    <div style={wrap}>
      <div style={{ marginBottom: "10px", flexShrink: 0 }}>
        <div style={{ fontSize: "9px", color: PC.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>Donations</div>
        <div style={{
          fontSize: "clamp(26px, 7.5vw, 30px)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: PC.white,
          lineHeight: 1.05,
          fontVariantNumeric: "tabular-nums",
          transform: go ? "translateY(0)" : "translateY(6px)",
          opacity: go ? 1 : 0,
          transition: "transform 0.5s ease 0.1s, opacity 0.5s ease 0.1s",
        }}>{headline}</div>
        <div style={{
          marginTop: "4px",
          fontSize: "10px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.38)",
          letterSpacing: "-0.01em",
          transform: go ? "translateY(0)" : "translateY(4px)",
          opacity: go ? 1 : 0,
          transition: "transform 0.5s ease 0.2s, opacity 0.5s ease 0.2s",
        }}>
          {donationCount === 0
            ? "No donations yet"
            : `${donationCount.toLocaleString("en-US")} donor${donationCount === 1 ? "" : "s"}`}
        </div>
      </div>

      <div style={{
        flex: 1,
        position: "relative",
        margin: "4px 0 0",
        minHeight: "96px",
        transform: go ? "translateY(0)" : "translateY(8px)",
        opacity: go ? 1 : 0,
        transition: "transform 0.7s ease 0.3s, opacity 0.7s ease 0.3s",
      }}>
        <svg
          viewBox={`0 0 ${CHART_VB.w} ${CHART_VB.h}`}
          style={{ width: "100%", height: "100%", maxHeight: "112px", display: "block" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {[CHART_VB.yTop, (CHART_VB.yTop + CHART_VB.yBot) / 2, CHART_VB.yBot].map(y => (
            <line key={y} x1="0" y1={y} x2={CHART_VB.w} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          ))}
          <defs>
            <linearGradient id={chartGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,200,122,0.2)" />
              <stop offset="100%" stopColor="rgba(0,200,122,0)" />
            </linearGradient>
          </defs>
          <path d={chart.fill} fill={`url(#${chartGradId})`} />
          <path
            ref={pathRef}
            d={chart.line}
            fill="none"
            stroke={PC.green}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0 0 3px rgba(0,200,122,0.45))",
              strokeDasharray: pathLen,
              strokeDashoffset: go ? 0 : pathLen,
              transition: go ? "stroke-dashoffset 1.15s cubic-bezier(0.16,1,0.3,1) 0.35s" : "none",
            }}
          />
          {showDot && chart.dot && (
            <>
              <circle
                cx={chart.dot.cx}
                cy={chart.dot.cy}
                r={go ? 3.2 : 0}
                fill={PC.green}
                style={{
                  filter: "drop-shadow(0 0 4px rgba(0,200,122,0.75))",
                  transition: go ? "r 0.35s ease 1.25s" : "none",
                }}
              />
              {go && tipText && chart.dot && (
                <g style={{ opacity: go ? 1 : 0, transition: "opacity 0.35s ease 1.35s" }}>
                  {(() => {
                    const tw = Math.min(72, 8 + tipText.length * 3.1);
                    const tx = Math.max(2, Math.min(chart.dot.cx - tw / 2, CHART_VB.w - tw - 2));
                    return (
                      <>
                        <rect
                          x={tx}
                          y="4"
                          width={tw}
                          height="13"
                          rx="3"
                          fill="rgba(0,200,122,0.14)"
                          stroke="rgba(0,200,122,0.28)"
                          strokeWidth="0.5"
                        />
                        <text
                          x={tx + tw / 2}
                          y="13"
                          textAnchor="middle"
                          fill={PC.green}
                          fontSize="5.25"
                          fontWeight="700"
                          fontFamily="Inter,sans-serif"
                        >
                          {tipText}
                        </text>
                      </>
                    );
                  })()}
                </g>
              )}
            </>
          )}
          <text x="2" y="16" fill="rgba(255,255,255,0.22)" fontSize="6" fontFamily="Inter,sans-serif">{chart.yLabels.hi}</text>
          <text x="2" y={(CHART_VB.yTop + CHART_VB.yBot) / 2 + 3} fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="Inter,sans-serif">{chart.yLabels.mid}</text>
          <text x="2" y="51" fill="rgba(255,255,255,0.22)" fontSize="6" fontFamily="Inter,sans-serif">{chart.yLabels.lo}</text>
        </svg>
        {go && showDot && chart.dot && (
          <div style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${(chart.dot.cx / CHART_VB.w) * 100}%`,
            width: "1px",
            background: "linear-gradient(to bottom, transparent, rgba(0,200,122,0.22), transparent)",
            pointerEvents: "none",
          }} />
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        marginTop: "10px",
        flexShrink: 0,
        transform: go ? "translateY(0)" : "translateY(6px)",
        opacity: go ? 1 : 0,
        transition: "transform 0.4s ease 0.7s, opacity 0.4s ease 0.7s",
      }}>
        {[
          { label: "Total donated", value: formatUsd(donationTotal) },
          { label: "Donors", value: donationCount.toLocaleString("en-US") },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.035)", borderRadius: "7px", padding: "7px 7px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "7.5px", color: PC.muted, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "3px" }}>{label}</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: PC.white, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "9px",
        padding: "7px 9px",
        borderRadius: "7px",
        background: "rgba(0,200,122,0.06)",
        border: "1px solid rgba(0,200,122,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexShrink: 0,
        transform: go ? "translateY(0)" : "translateY(4px)",
        opacity: go ? 1 : 0,
        transition: "transform 0.4s ease 0.82s, opacity 0.4s ease 0.82s",
      }}>
        <span style={{ fontSize: "8px", color: PC.green }}>◆</span>
        <span style={{ fontSize: "8px", color: "rgba(0,200,122,0.62)", letterSpacing: "0.01em", lineHeight: 1.35 }}>
          {donationTotal <= 0
            ? "Numbers update live when someone donates."
            : "Totals sync from real donations."}
        </span>
      </div>
    </div>
  );
}

// ── CARD SCREEN ───────────────────────────────────────────────────────────────
// Full-bleed card experience. The card itself is larger and takes up most of
// the screen. Below: two benefit rows + a tier badge. Card has: holographic
// sheen, diagonal micro-lines, radial mesh gradient, gold chip with fine grid,
// contactless arcs, embossed card number, dual-circle network logo.
function CardScreen({ visible }: { visible: boolean }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGo(visible), visible ? 250 : 0);
    return () => clearTimeout(t);
  }, [visible]);

  const wrap: React.CSSProperties = {
    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
    padding: "14px 16px 12px",
    opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
  };

  return (
    <div style={wrap}>
      {/* Screen label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "10px", fontWeight: 500, color: PC.muted, letterSpacing: "0.07em", textTransform: "uppercase" }}>
          Member card
        </span>
        {/* Tier badge */}
        <div style={{
          padding: "2px 7px", borderRadius: "100px",
          background: "linear-gradient(90deg, rgba(0,200,122,0.18), rgba(0,200,122,0.08))",
          border: "1px solid rgba(0,200,122,0.25)",
          fontSize: "7px", fontWeight: 800, color: PC.green, letterSpacing: "0.1em", textTransform: "uppercase",
          transform: go ? "translateY(0)" : "translateY(-4px)", opacity: go ? 1 : 0,
          transition: "transform 0.4s ease 0.55s, opacity 0.4s ease 0.55s",
        }}>
          ◆ Donor Elite
        </div>
      </div>

      {/* ── THE CARD — larger, fills more of the screen ── */}
      <div style={{
        width: "100%", height: "136px", borderRadius: "14px",
        // Deep dark green mesh gradient — layered for depth
        background: "linear-gradient(145deg, #0d1f12 0%, #071009 40%, #0c1a10 70%, #060e08 100%)",
        border: "1px solid rgba(0,200,122,0.18)",
        boxShadow: go
          ? "0 20px 52px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,200,122,0.08) inset, 0 1px 0 rgba(255,255,255,0.04) inset"
          : "0 8px 20px rgba(0,0,0,0.4)",
        padding: "13px 14px",
        position: "relative", overflow: "hidden", flexShrink: 0,
        transform: go
          ? "scale(1) rotateY(0deg) rotateX(0deg)"
          : "scale(0.84) rotateY(-24deg) rotateX(10deg)",
        opacity: go ? 1 : 0,
        transition: "transform 1.05s cubic-bezier(0.16,1,0.3,1) 0.1s, opacity 0.65s ease 0.1s, box-shadow 0.8s ease 0.1s",
        perspective: "800px",
      }}>
        {/* Radial mesh — ambient green glow in top-right corner */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px", width: "130px", height: "130px",
          borderRadius: "50%", pointerEvents: "none", zIndex: 1,
          background: "radial-gradient(circle, rgba(0,200,122,0.13) 0%, transparent 65%)",
        }} />
        {/* Second glow — bottom-left */}
        <div style={{
          position: "absolute", bottom: "-30px", left: "-20px", width: "90px", height: "90px",
          borderRadius: "50%", pointerEvents: "none", zIndex: 1,
          background: "radial-gradient(circle, rgba(0,200,122,0.06) 0%, transparent 70%)",
        }} />
        {/* Diagonal micro-line texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.045,
          backgroundImage: "repeating-linear-gradient(-38deg, transparent, transparent 14px, rgba(0,200,122,1) 14px, rgba(0,200,122,1) 15px)",
        }} />
        {/* Horizontal scan-line texture — very fine */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.025,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,1) 3px, rgba(255,255,255,1) 4px)",
        }} />
        {/* Holographic sheen — always sweeping */}
        <div style={{
          position: "absolute", top: "-30%", bottom: "-30%", left: 0, width: "60%",
          background: "linear-gradient(112deg, transparent 18%, rgba(0,220,122,0.1) 42%, rgba(160,255,190,0.07) 55%, transparent 78%)",
          animation: "cardSheen 5.5s ease-in-out infinite",
          pointerEvents: "none", zIndex: 6,
        }} />
        {/* Top edge highlight */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* TOP ROW: brand + W$ monogram */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", position: "relative", zIndex: 4 }}>
          <div>
            <div style={{ fontSize: "6px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,200,122,0.45)", textTransform: "uppercase", lineHeight: 1 }}>
              WASTE A DOLLAR™
            </div>
            <div style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em", marginTop: "2px" }}>
              MEMBER SERVICES
            </div>
          </div>
          {/* W$ monogram — stylised */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
              <span style={{ fontSize: "15px", fontWeight: 900, color: PC.green, letterSpacing: "-0.07em", lineHeight: 1 }}>W</span>
              <span style={{ fontSize: "10px", fontWeight: 900, color: PC.green, letterSpacing: "-0.03em", lineHeight: 1 }}>$</span>
            </div>
          </div>
        </div>

        {/* CHIP + CONTACTLESS ROW */}
        <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "11px", position: "relative", zIndex: 4 }}>
          {/* Gold EMV chip — detailed grid */}
          <div style={{
            width: "30px", height: "22px", borderRadius: "4px",
            background: "linear-gradient(135deg, #c8a84a 0%, #f0db7a 35%, #d4a840 65%, #a07830 100%)",
            border: "1px solid rgba(255,255,255,0.2)", position: "relative", overflow: "hidden", flexShrink: 0,
          }}>
            {/* Chip internal grid */}
            <div style={{ position: "absolute", top: "30%",  left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.22)" }} />
            <div style={{ position: "absolute", top: "65%",  left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.18)" }} />
            <div style={{ position: "absolute", left: "30%", top: 0, bottom: 0, width: "1px", background: "rgba(0,0,0,0.18)" }} />
            <div style={{ position: "absolute", left: "60%", top: 0, bottom: 0, width: "1px", background: "rgba(0,0,0,0.14)" }} />
            {/* Centre contact pad */}
            <div style={{ position: "absolute", top: "22%", left: "22%", right: "22%", bottom: "22%", borderRadius: "2px", background: "rgba(0,0,0,0.12)", border: "0.5px solid rgba(0,0,0,0.1)" }} />
            {/* Sheen */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, rgba(255,255,255,0.22) 0%, transparent 55%)" }} />
          </div>
          {/* Contactless wave — 4 arcs */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {[3, 5.5, 8, 10.5].map((rv, i) => (
              <path key={i}
                d={`M ${9 - rv * 0.52} ${9 + rv * 0.52} A ${rv} ${rv} 0 0 1 ${9 + rv * 0.52} ${9 + rv * 0.52}`}
                stroke={`rgba(0,200,122,${0.6 - i * 0.12})`}
                strokeWidth="1.1" strokeLinecap="round"
              />
            ))}
          </svg>
          {/* VISA-style network name placeholder */}
          <div style={{ marginLeft: "auto", fontSize: "5.5px", fontWeight: 800, color: "rgba(255,255,255,0.18)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            PREMIUM
          </div>
        </div>

        {/* CARD NUMBER — embossed-look */}
        <div style={{
          fontFamily: "'Courier New', monospace", fontSize: "11px", fontWeight: 600,
          color: "rgba(255,255,255,0.58)", letterSpacing: "0.16em", marginBottom: "10px",
          position: "relative", zIndex: 4,
          textShadow: "0 1px 2px rgba(0,0,0,0.6)",
        }}>
          **** **** **** 0001
        </div>

        {/* BOTTOM ROW: cardholder / expiry / network */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 4 }}>
          <div>
            <div style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginBottom: "2px", textTransform: "uppercase" }}>Cardholder</div>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em" }}>ALEX</div>
          </div>
          <div>
            <div style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginBottom: "2px", textTransform: "uppercase" }}>Expires</div>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>∞ / ∞</div>
          </div>
          <div>
            <div style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginBottom: "2px", textTransform: "uppercase" }}>CVV</div>
            <div style={{ fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>$$$</div>
          </div>
          {/* Dual-circle logo */}
          <div style={{ position: "relative", width: "34px", height: "21px" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: "21px", height: "21px", borderRadius: "50%", background: "rgba(0,200,122,0.8)", boxShadow: "0 0 10px rgba(0,200,122,0.35)" }} />
            <div style={{ position: "absolute", right: 0, top: 0, width: "21px", height: "21px", borderRadius: "50%", background: "rgba(0,200,122,0.36)" }} />
          </div>
        </div>
      </div>

      {/* Benefits rows — appear below the card */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "9px", flex: 1 }}>
        {[
          { icon: "✦", label: "Zero fees",        note: "Besides your donations"},
          { icon: "✦", label: "For the top donor", note: "Minimum $10000"},
        ].map(({ icon, label, note }, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "5px 8px", borderRadius: "7px",
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
            transform: go ? "translateX(0)" : "translateX(-8px)", opacity: go ? 1 : 0,
            transition: `transform 0.4s ease ${0.6 + i * 0.1}s, opacity 0.4s ease ${0.6 + i * 0.1}s`,
          }}>
            <span style={{ fontSize: "8px", color: PC.green }}>{icon}</span>
            <div>
              <div style={{ fontSize: "9px", fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "-0.01em" }}>{label}</div>
              <div style={{ fontSize: "7.5px", color: PC.muted, marginTop: "0px" }}>{note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CERT SCREEN ───────────────────────────────────────────────────────────────
// Trading-card certificate (matches Why section “Receive a certificate” design).
const CERT_RARITY_LABELS = ["Common", "Uncommon", "Rare", "Epic", "Legendary"] as const;

function CertScreen({ visible }: { visible: boolean }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGo(visible), visible ? 350 : 0);
    return () => clearTimeout(t);
  }, [visible]);

  const wrap: React.CSSProperties = {
    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
    padding: "14px 14px 12px", alignItems: "stretch", justifyContent: "center", gap: "8px",
    opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
  };

  const G = PC.green;

  return (
    <div style={wrap}>
      <div
        style={{
          width: "100%",
          transform: go ? "scale(1)" : "scale(0.94)", opacity: go ? 1 : 0,
          transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.08s, opacity 0.5s ease 0.08s",
          display: "flex", flexDirection: "column", gap: "8px",
        }}
      >
        {/* Credit card — same structure as WhySection IllustrationCertificate */}
        <div style={{
          width: "100%", aspectRatio: "85.6 / 53.98",
          borderRadius: "12px", overflow: "hidden",
          position: "relative",
          background: "#0a0d0b",
          border: `1px solid ${go ? "rgba(0,200,122,0.28)" : "rgba(255,255,255,0.08)"}`,
          transition: "border-color 0.5s ease",
        }}>
          {/* No photo — dark card with subtle green depth */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            background: "radial-gradient(ellipse 90% 70% at 50% 25%, rgba(0,200,122,0.09) 0%, transparent 50%), #0a0d0b",
          }} />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            background: "linear-gradient(160deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.65) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            background: go
              ? "repeating-linear-gradient(-42deg,transparent,transparent 12px,rgba(0,200,122,0.04) 12px,rgba(0,200,122,0.04) 13px)"
              : "repeating-linear-gradient(-42deg,transparent,transparent 12px,rgba(255,255,255,0.02) 12px,rgba(255,255,255,0.02) 13px)",
            transition: "background 0.45s ease",
          }} />
          <div style={{
            position: "absolute", inset: 0, padding: "10px 12px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            zIndex: 2, fontFamily: "Inter, sans-serif",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                color: go ? "rgba(0,200,122,0.75)" : "rgba(255,255,255,0.35)",
                transition: "color 0.45s ease",
              }}>Purchase</div>
              <div style={{
                padding: "2px 6px", borderRadius: "100px",
                fontSize: "6px", fontWeight: 800, letterSpacing: "0.1em",
                background: go ? "rgba(0,200,122,0.18)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${go ? "rgba(0,200,122,0.4)" : "rgba(255,255,255,0.12)"}`,
                color: go ? G : "rgba(255,255,255,0.35)",
                transition: "all 0.45s ease",
              }}>COMMON</div>
            </div>
            <div style={{
              width: "22px", height: "17px", borderRadius: "3px",
              background: go
                ? "linear-gradient(135deg, rgba(0,200,122,0.28) 0%, rgba(0,200,122,0.1) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
              border: `1px solid ${go ? "rgba(0,200,122,0.35)" : "rgba(255,255,255,0.12)"}`,
              position: "relative", overflow: "hidden", transition: "all 0.45s ease",
            }}>
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: go ? "rgba(0,200,122,0.28)" : "rgba(255,255,255,0.1)", transform: "translateY(-50%)" }} />
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: go ? "rgba(0,200,122,0.28)" : "rgba(255,255,255,0.1)", transform: "translateX(-50%)" }} />
            </div>
            <div style={{
              fontSize: "8px", fontWeight: 600, letterSpacing: "0.2em", fontVariantNumeric: "tabular-nums",
              color: go ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
              transition: "color 0.45s ease",
            }}>•••• •••• •••• 0001</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: "6px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "2px" }}>Card holder</div>
                <div style={{
                  fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                  color: go ? "#fff" : "rgba(255,255,255,0.72)",
                  transition: "color 0.45s ease",
                }}>Alex</div>
                <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                  {[true, false, false, false, false].map((on, i) => (
                    <div key={i} style={{
                      width: "6px", height: "6px", borderRadius: "1px",
                      background: on ? (go ? G : "rgba(255,255,255,0.28)") : "rgba(255,255,255,0.06)",
                      transition: "background 0.45s ease",
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "6px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: "2px" }}>Amount</div>
                <div style={{
                  fontSize: "8px", fontWeight: 700,
                  color: go ? "rgba(0,200,122,0.9)" : "rgba(255,255,255,0.45)",
                  transition: "color 0.45s ease",
                }}>$1.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rarity bar — tuned for dark phone UI */}
        <div style={{ opacity: go ? 1 : 0, transform: go ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.45s ease 0.35s, transform 0.45s ease 0.35s" }}>
          <div style={{ display: "flex", gap: "4px", height: "5px" }}>
            {CERT_RARITY_LABELS.map((_, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: "3px",
                background: i === 0 ? (go ? "rgba(0,200,122,0.85)" : "rgba(255,255,255,0.12)") : "rgba(255,255,255,0.06)",
                transition: "background 0.45s ease",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", marginTop: "5px" }}>
            {CERT_RARITY_LABELS.map((label, i) => (
              <div key={i} style={{
                flex: 1, textAlign: "center",
                fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.02em", fontFamily: "Inter, sans-serif",
                color: i === 0 ? (go ? G : "rgba(255,255,255,0.28)") : "rgba(255,255,255,0.2)",
                transition: "color 0.45s ease",
              }}>{label}</div>
            ))}
          </div>
        </div>
      </div>
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
  const [autoRotateKey, setAutoRotateKey] = useState(0);
  const [glareX, setGlareX] = useState(30);
  const [glareY, setGlareY] = useState(20);
  const swipeStartX = useRef<number | null>(null);
  const screenSwipeRef = useRef<HTMLDivElement>(null);

  const nScreens = SCREENS.length;
  const bumpAutoRotate = useCallback(() => setAutoRotateKey(k => k + 1), []);
  const goNextScreen = useCallback(() => {
    setScreen(s => (s + 1) % nScreens);
    bumpAutoRotate();
  }, [nScreens, bumpAutoRotate]);
  const goPrevScreen = useCallback(() => {
    setScreen(s => (s - 1 + nScreens) % nScreens);
    bumpAutoRotate();
  }, [nScreens, bumpAutoRotate]);

  useEffect(() => {
    const id = setInterval(() => setScreen(s => (s + 1) % nScreens), 5000);
    return () => clearInterval(id);
  }, [autoRotateKey, nScreens]);

  useEffect(() => {
    const el = screenSwipeRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dx = e.deltaX;
      if (Math.abs(dx) < 12 && Math.abs(e.deltaY) >= Math.abs(dx)) return;
      const dominant = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (Math.abs(dominant) < 20) return;
      e.preventDefault();
      if (dominant > 0) goPrevScreen();
      else goNextScreen();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [goNextScreen, goPrevScreen]);

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
      {/* Side buttons */}
      {[{ side: "left", top: "78px", h: "22px" }, { side: "left", top: "110px", h: "32px" }, { side: "left", top: "154px", h: "32px" }, { side: "right", top: "130px", h: "52px" }].map(({ side, top, h }, i) => (
        <div key={i} style={{ position: "absolute", [side]: "-3px", top, height: h, width: "3px", borderRadius: side === "left" ? "3px 0 0 3px" : "0 3px 3px 0", background: "linear-gradient(180deg,#222 0%,#2e2e2e 40%,#222 100%)", boxShadow: side === "left" ? "-1px 0 3px rgba(0,0,0,0.3)" : "1px 0 3px rgba(0,0,0,0.3)" }} />
      ))}
      {/* Chassis */}
      <div style={{ position: "absolute", inset: 0, borderRadius: `${RADIUS}px`, background: "linear-gradient(145deg,#2a2a2a 0%,#181818 35%,#111 60%,#1e1e1e 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(255,255,255,0.04) inset, 0 -1px 2px rgba(0,0,0,0.9) inset, 0 40px 80px rgba(0,0,0,0.25), 0 20px 40px rgba(0,0,0,0.15)" }} />
      <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)", borderRadius: "100px" }} />
      {/* Screen — swipe / drag horizontally to change slides */}
      <div
        ref={screenSwipeRef}
        style={{ position: "absolute", inset: `${BEZEL}px`, borderRadius: `${SCREEN_R}px`, background: "#000", overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)", touchAction: "pan-y" }}
        onTouchStart={e => {
          swipeStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={e => {
          if (swipeStartX.current == null) return;
          const dx = e.changedTouches[0].clientX - swipeStartX.current;
          swipeStartX.current = null;
          if (Math.abs(dx) < 36) return;
          if (dx < 0) goNextScreen();
          else goPrevScreen();
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#060d09 0%,#030806 100%)" }} />
        {/* Status bar */}
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
        {/* Tab label + dots */}
        <div style={{ padding: "10px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
          <span style={{ fontSize: "10px", fontWeight: 500, color: "rgba(0,200,122,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{SCREENS[screen].label}</span>
          <div style={{ display: "flex", gap: "3px" }}>
            {SCREENS.map((_, i) => (
              <div key={i} style={{ width: i === screen ? "14px" : "4px", height: "3px", borderRadius: "100px", background: i === screen ? PC.green : "rgba(255,255,255,0.1)", transition: "width 0.4s ease, background 0.4s ease" }} />
            ))}
          </div>
        </div>
        {/* Content */}
        <div style={{ position: "relative", height: "calc(100% - 88px)", zIndex: 10 }}>
          <AmountScreen    visible={screen === 0} donationCount={donationCount} donationTotal={donationTotal} />
          <TxFeedScreen    visible={screen === 1} />
          <AnalyticsScreen
            visible={screen === 2}
            donationCount={donationCount}
            donationTotal={donationTotal}
          />
          <CardScreen      visible={screen === 3} />
          <CertScreen      visible={screen === 4} />
        </div>
        {/* Glare */}
        <div style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none", background: `radial-gradient(ellipse 55% 40% at ${glareX}% ${glareY}%, rgba(255,255,255,0.04) 0%, transparent 70%)`, transition: "background 0.8s ease", borderRadius: `${SCREEN_R}px` }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 19, pointerEvents: "none", boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)", borderRadius: `${SCREEN_R}px` }} />
        <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", width: "100px", height: "4px", borderRadius: "100px", background: "rgba(255,255,255,0.2)", zIndex: 20 }} />
      </div>
      {/* Chassis gloss */}
      <div style={{ position: "absolute", inset: 0, borderRadius: `${RADIUS}px`, background: "linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 40%)", pointerEvents: "none" }} />
    </div>
  );
}

// ── WARM BACKGROUND ───────────────────────────────────────────────────────────
function WarmBackground() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(135deg, #EDE8E1 0%, #F4F0EB 40%, #EAE5DE 70%, #F0EDE8 100%)" }} />
      <div style={{ position: "absolute", top: "-15%", right: "-10%", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,168,98,0.07) 0%, transparent 65%)", pointerEvents: "none", animation: "orbDrift1 18s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(180,160,130,0.12) 0%, transparent 65%)", pointerEvents: "none", animation: "orbDrift2 14s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "30%", right: "15%", width: "400px", height: "500px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,168,98,0.06) 0%, transparent 70%)", pointerEvents: "none", animation: "orbDrift3 20s ease-in-out infinite", filter: "blur(8px)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(200,190,178,0.25) 100%)" }} />
      {/* Grain texture — paper-stock feel */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        opacity: 0.038, mixBlendMode: "multiply" as const,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: "220px 220px",
      }} />
      {/* Dot grid — fades up from bottom half, fintech terminal feel */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: "radial-gradient(circle, rgba(13,13,13,0.09) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, transparent 62%)",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, transparent 62%)",
      }} />
    </>
  );
}

// ── HEADLINES ─────────────────────────────────────────────────────────────────
const LINES = [
  "waste a dollar.\nFor Alex.",
  "You were going\nto waste it\nanyway.",
  "One dollar.\nThat's it.",
  "The financially\nresponsible\nchoice.",
];

// ── HERO ──────────────────────────────────────────────────────────────────────
interface HeroProps {
  onDonateClick?: () => void;
  videoSrc?: string;
  donationCount?: number;
  donationTotal?: number;
}

export default function Hero({ onDonateClick, videoSrc, donationCount = 0, donationTotal = 0 }: HeroProps) {
  const [liveCount, setLiveCount]     = useState(donationCount);
  const [liveTotal, setLiveTotal]     = useState(donationTotal);
  const [mounted, setMounted]         = useState(false);
  const [lineIdx, setLineIdx]         = useState(0);
  const [trigger, setTrigger]         = useState(0);
  const [txtVisible, setTxtVisible]   = useState(true);
  const [meme67RunId, setMeme67RunId] = useState(0);
  const [isLeaderboardSection, setIsLeaderboardSection] = useState(false);
  const [btnHov, setBtnHov]           = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mouse    = useMousePos();

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch("/api/donations/stats", { cache: "no-store" });
        const json = (await res.json()) as { count?: unknown; total?: unknown };
        const c =
          typeof json.count === "number" && Number.isFinite(json.count) ? json.count : 0;
        const t =
          typeof json.total === "number" && Number.isFinite(json.total) ? json.total : 0;
        if (!cancelled) {
          setLiveCount(c);
          setLiveTotal(t);
        }
      } catch {
        /* keep last values */
      }
    };
    void poll();
    const id = setInterval(poll, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const next = useCallback(() => {
    setTxtVisible(false);
    setTimeout(() => { setLineIdx(i => (i + 1) % LINES.length); setTrigger(t => t + 1); setTxtVisible(true); }, 200);
  }, []);

  useEffect(() => { const id = setInterval(next, 5000); return () => clearInterval(id); }, [next]);

  useEffect(() => {
    const root = document.getElementById("snap-container");
    if (!root) return;
    let raf: number | null = null;
    const update = () => {
      const h = root.clientHeight || window.innerHeight || 1;
      setIsLeaderboardSection(Math.round(root.scrollTop / h) === 6);
    };
    const onScroll = () => { if (raf != null) cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => { if (raf != null) cancelAnimationFrame(raf); root.removeEventListener("scroll", onScroll); window.removeEventListener("resize", update); };
  }, []);

  const scrambled = useScramble(LINES[lineIdx], trigger);
  const tiltY = mounted ? ((mouse.x / (window.innerWidth  || 1)) - 0.5) * 16 : 0;
  const tiltX = mounted ? ((mouse.y / (window.innerHeight || 1)) - 0.5) * -8 : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { background:${C.bg}; }

        @keyframes pulse  { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:none;} }
        @keyframes navIn  { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:none;} }

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
        @keyframes memeSix {
          0%{transform:translateY(0)} 25%{transform:translateY(-10px)}
          50%{transform:translateY(0)} 75%{transform:translateY(10px)} 100%{transform:translateY(0)}
        }
        @keyframes memeSeven {
          0%{transform:translateY(0)} 25%{transform:translateY(10px)}
          50%{transform:translateY(0)} 75%{transform:translateY(-10px)} 100%{transform:translateY(0)}
        }

        /* Shimmer: sweeps once (0–30% of cycle), then long idle pause */
        @keyframes shimmerLoop {
          0%   { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
          5%   { opacity: 1; }
          28%  { transform: translateX(260%)  skewX(-18deg); opacity: 1; }
          30%  { opacity: 0; transform: translateX(260%) skewX(-18deg); }
          100% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
        }

        @keyframes floatUp {
          0%   { opacity:0;   transform:translateY(0)     scale(1);   }
          8%   { opacity:0.09;                                         }
          88%  { opacity:0.07;                                         }
          100% { opacity:0;   transform:translateY(-88vh) scale(0.75);}
        }

        @keyframes phoneGlow {
          0%,100% { opacity:0.55; transform:scale(1);    }
          50%     { opacity:0.80; transform:scale(1.04); }
        }

        /* Card holographic sheen — always on */
        @keyframes cardSheen {
          0%,100% { transform:translateX(-70%);  opacity:0; }
          10%     { opacity:1; }
          60%     { transform:translateX(240%);  opacity:1; }
          68%     { opacity:0; }
        }

        /* Ticker: translateX(-50%) scrolls exactly one copy width */
        @keyframes tickerScroll {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 56px", height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "transparent", borderBottom: "none",
        animation: "navIn 0.6s ease 0.1s both", fontFamily: "Inter, sans-serif",
      }}>
        <span style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.04em", color: isLeaderboardSection ? C.bg : C.green, transition: "color 0.25s ease" }}>
          waste a dollar.
        </span>
        <button onClick={onDonateClick} style={{
          padding: "10px 24px", borderRadius: "100px", background: "rgba(13,13,13,0.92)",
          color: isLeaderboardSection ? C.bg : C.green, border: "1px solid rgba(0,168,98,0.28)",
          boxShadow: "0 10px 26px rgba(0,0,0,0.16)", fontSize: "13px", fontWeight: 800,
          fontFamily: "Inter, sans-serif", cursor: "pointer", letterSpacing: "-0.01em",
          transition: "opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, color 0.25s ease",
        }}>Donate $1</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px 80px 80px", position: "relative", overflow: "hidden",
        fontFamily: "Inter, sans-serif", gap: "80px",
      }}>
        <WarmBackground />
        <FloatingDollars />
        <TickerTape />

        {/* LEFT */}
        <div style={{ flex: 1, maxWidth: "480px", display: "flex", flexDirection: "column", gap: "36px", position: "relative", zIndex: 2 }}>
          <h1 style={{
            fontSize: "clamp(50px, 5.5vw, 78px)", fontWeight: 900, lineHeight: 0.94,
            letterSpacing: "-0.04em", minHeight: "clamp(110px, 15vw, 160px)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            opacity: txtVisible ? 1 : 0, transform: txtVisible ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}>
            {scrambled.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block", color: i === 1 ? C.green : C.black }}>{line}</span>
            ))}
          </h1>

          <p style={{
            fontSize: "17px", fontWeight: 400, color: C.muted, lineHeight: 1.7,
            letterSpacing: "-0.01em", maxWidth: "360px",
            animation: mounted ? "fadeIn 0.8s ease 1s both" : "none", opacity: mounted ? undefined : 0,
          }}>
            You will spend a dollar today on something meaningless.{" "}
            <span style={{ color: C.black }}>It could go to Alex instead.</span>
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px", animation: mounted ? "fadeIn 0.8s ease 1.2s both" : "none", opacity: mounted ? undefined : 0 }}>
            {/* CTA — always-moving shimmer */}
            <button
              onClick={onDonateClick}
              onMouseEnter={() => setBtnHov(true)}
              onMouseLeave={() => setBtnHov(false)}
              style={{
                padding: "16px 40px", borderRadius: "100px", background: "rgba(13,13,13,0.92)",
                color: C.green, border: "1px solid rgba(0,168,98,0.28)",
                boxShadow: btnHov ? "0 18px 44px rgba(0,0,0,0.26), 0 0 0 1px rgba(0,168,98,0.35)" : "0 18px 44px rgba(0,0,0,0.18)",
                fontSize: "16px", fontWeight: 800, fontFamily: "Inter, sans-serif", cursor: "pointer",
                letterSpacing: "-0.01em", position: "relative", overflow: "hidden",
                transform: btnHov ? "translateY(-1px) scale(1.015)" : "translateY(0) scale(1)",
                transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
              }}
            >
              Donate $1 Now
              {/* Always-moving shimmer — sweeps once then idles */}
              <span style={{
                position: "absolute", top: 0, bottom: 0, left: 0, width: "55%",
                background: "linear-gradient(105deg, transparent 20%, rgba(0,200,122,0.22) 50%, transparent 80%)",
                animation: "shimmerLoop 3.2s ease-in-out infinite",
                pointerEvents: "none",
              }} />
            </button>

            <WhyButton />

            <button type="button" onClick={() => setMeme67RunId(v => v + 1)}
              style={{ fontSize: "12px", color: C.muted, paddingLeft: "4px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
              aria-label="Animate 6 and 7">
              Takes{" "}
              <span key={`six-${meme67RunId}`}   style={{ display: "inline-block", animation: "memeSix 0.38s linear 0s 6" }}>6</span>
              -
              <span key={`seven-${meme67RunId}`} style={{ display: "inline-block", animation: "memeSeven 0.38s linear 0s 6" }}>7</span>
              {" "}seconds. No account needed.
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "9px", animation: mounted ? "fadeIn 0.8s ease 1.4s both" : "none", opacity: mounted ? undefined : 0 }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.green, flexShrink: 0, animation: "pulse 2.8s ease-in-out infinite" }} />
            <span style={{ fontSize: "13px", color: C.muted }}>
              {liveCount === 0
                ? <span style={{ color: C.black, fontWeight: 600 }}>Be the first!</span>
                : <><span style={{ color: C.black, fontWeight: 600 }}>{liveCount.toLocaleString("en-US")}</span>{" "}{liveCount === 1 ? "person" : "people"} already donated</>
              }
            </span>
          </div>
        </div>

        {/* RIGHT — perspective container + 3D tilt layer (optional video replaces phone mockup) */}
        <div style={{
          position: "relative", zIndex: 2, flexShrink: 0,
          animation: mounted ? "fadeIn 1s ease 0.5s both" : "none",
          opacity: mounted ? undefined : 0,
          perspective: "900px",
        }}>
          {/* Ambient glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", width: "310px", height: "310px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,168,98,0.14) 0%, transparent 65%)",
            transform: "translate(-50%, -50%)", filter: "blur(30px)",
            pointerEvents: "none", animation: "phoneGlow 4s ease-in-out infinite", zIndex: 0,
          }} />
          {/* 3D tilt */}
          <div style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: "transform 0.12s ease-out",
            transformStyle: "preserve-3d", position: "relative", zIndex: 1,
          }}>
            {videoSrc ? (
              <div style={{ width: "320px", height: "540px", borderRadius: "32px", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.18), 0 16px 32px rgba(0,0,0,0.1)", animation: "phoneFloat 8s ease-in-out infinite" }}>
                <video ref={videoRef} src={videoSrc} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
            ) : (
              <>
                <div style={{ position: "absolute", top: "50%", left: "50%", width: "340px", height: "460px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,168,98,0.09) 0%, transparent 70%)", transform: "translate(-50%, -50%)", filter: "blur(32px)", pointerEvents: "none" }} />
                <div style={{ animation: "phoneFloat 8s ease-in-out infinite" }}>
                  <Phone donationCount={liveCount} donationTotal={liveTotal} />
                </div>
                <div style={{ position: "absolute", bottom: "-24px", left: "50%", transform: "translateX(-50%)", width: "180px", height: "30px", background: "radial-gradient(ellipse, rgba(0,0,0,0.1) 0%, transparent 70%)", filter: "blur(12px)" }} />
              </>
            )}
          </div>
        </div>

      </section>
    </>
  );
}
