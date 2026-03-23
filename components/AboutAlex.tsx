"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const C = {
  bg:      "#0D0D0D",
  green:   "#00A862",
  greenHi: "#00C87A",
  white:   "#FFFFFF",
  muted:   "rgba(255,255,255,0.35)",
  dim:     "rgba(255,255,255,0.14)",
  line:    "rgba(255,255,255,0.07)",
  card:    "#0a0d0b",
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
      setTc(`00:0${m}:${String(s).padStart(2,"0")}:${String(fr).padStart(2,"0")}`);
    }, 33);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ fontFamily:"'Courier New',monospace", fontSize:"9px", letterSpacing:"0.1em", color:"rgba(0,168,98,0.5)" }}>
      {tc}
    </span>
  );
}

// ── VHS VARIANTS ──────────────────────────────────────────────────────────────
const vhsIn: Variants = {
  hidden:  { scaleY:0.06, scaleX:1.04, filter:"blur(12px)", opacity:0 },
  visible: { scaleY:1, scaleX:1, filter:"blur(0px)", opacity:1,
    transition:{ duration:0.85, ease:[0.22,1,0.36,1] } },
};
const glitch1: Variants = {
  hidden:  { top:"22%", opacity:0 },
  visible: { top:["22%","58%","58%"], opacity:[0.9,0.3,0], transition:{ duration:0.5, ease:"easeOut" } },
};
const glitch2: Variants = {
  hidden:  { top:"72%", opacity:0 },
  visible: { top:["72%","32%","32%"], opacity:[0.7,0.2,0], transition:{ duration:0.5, ease:"easeOut", delay:0.07 } },
};

// ── FUNDING BAR ───────────────────────────────────────────────────────────────
function FundingBar({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={isInView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.55, delay:0.9 }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"10px" }}>
        <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.dim }}>
          Funding progress
        </span>
        <span style={{ fontFamily:"'Courier New',monospace", fontSize:"13px", color:C.green, fontWeight:700, letterSpacing:"-0.02em" }}>
          $0 <span style={{ color:C.dim, fontSize:"11px" }}>/ $1</span>
        </span>
      </div>
      <div style={{ height:"2px", background:"rgba(255,255,255,0.06)", borderRadius:"99px", overflow:"hidden", position:"relative" }}>
        <motion.div
          initial={{ width:"0%" }}
          animate={isInView ? { width:"1%" } : {}}
          transition={{ duration:1.8, delay:1.2, ease:[0.16,1,0.3,1] }}
          style={{ position:"absolute", left:0, top:0, height:"100%", background:C.green, borderRadius:"99px", boxShadow:`0 0 6px ${C.green}` }}
        />
      </div>
      <div style={{ marginTop:"8px", fontSize:"10px", color:C.dim }}>
        0% — <span style={{ color:"rgba(0,168,98,0.7)" }}>be the first to contribute</span>
      </div>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function AboutAlex() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once:true, margin:"-80px" });
  const [photoLoaded, setPhotoLoaded] = useState(false);

  const PHOTO = "/alex-photo.jpg";

  return (
    <section
      ref={ref}
      style={{
        background: C.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        padding: "clamp(48px,8vh,88px) clamp(24px,6vw,80px)",
      }}
    >
      {/* Ambient orbs */}
      <div style={{ position:"absolute", top:"-120px", left:"-80px", width:"480px", height:"480px", borderRadius:"50%", background:"radial-gradient(circle,rgba(0,168,98,0.07) 0%,transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-100px", right:"-60px", width:"360px", height:"360px", borderRadius:"50%", background:"radial-gradient(circle,rgba(0,168,98,0.04) 0%,transparent 65%)", pointerEvents:"none" }} />

      <div style={{ maxWidth:"1160px", width:"100%", margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1.15fr",
          gap:"clamp(32px,5vw,72px)",
          alignItems:"center",
        }}>

          {/* ══ LEFT COLUMN ══════════════════════════════════════════════════ */}
          <div style={{ display:"flex", flexDirection:"column", gap:"clamp(28px,4vh,40px)" }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity:0, y:12 }}
              animate={isInView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
              style={{ display:"flex", alignItems:"center", gap:"10px" }}
            >
              <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:C.green, animation:"pulse 2.6s ease-in-out infinite", boxShadow:`0 0 8px ${C.green}` }} />
              <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.green }}>
                Who is Alex?
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity:0, y:18 }}
              animate={isInView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.75, ease:[0.16,1,0.3,1], delay:0.07 }}
              style={{ fontSize:"clamp(32px,4vw,58px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:0.93, color:C.white, margin:0 }}
            >
              Alex is a person<br />
              who <span style={{ color:C.green }}>needs a dollar.</span>
            </motion.h2>

            {/* ── PROFILE CARD ── */}
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={isInView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.65, ease:[0.16,1,0.3,1], delay:0.2 }}
              style={{
                background: C.card,
                border:`1px solid ${C.line}`,
                borderRadius:"16px",
                overflow:"hidden",
                position:"relative",
              }}
            >
              {/* Top edge glow */}
              <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,168,98,0.3),transparent)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", top:"-50px", right:"-50px", width:"130px", height:"130px", borderRadius:"50%", background:"radial-gradient(circle,rgba(0,200,122,0.09) 0%,transparent 70%)", pointerEvents:"none" }} />

              {/* Photo — vertical, top of card */}
              <div style={{
                width:"100%",
                height:"180px",
                position:"relative",
                overflow:"hidden",
                background:"#0a0f0c",
                borderBottom:`1px solid ${C.line}`,
              }}>
                <img
                  src={PHOTO}
                  alt="Alex"
                  onLoad={() => setPhotoLoaded(true)}
                  style={{
                    position:"absolute", inset:0,
                    width:"100%", height:"100%",
                    objectFit:"cover", objectPosition:"center top",
                    opacity: photoLoaded ? 1 : 0,
                    transition:"opacity 0.6s ease",
                  }}
                />
                {!photoLoaded && (
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="13" r="7" stroke="rgba(0,168,98,0.25)" strokeWidth="1.5"/>
                      <path d="M4 34c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="rgba(0,168,98,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize:"9px", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(0,168,98,0.25)" }}>Photo coming soon</span>
                  </div>
                )}
                {/* Bottom fade */}
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"55%", background:"linear-gradient(to top,#0a0d0b 0%,transparent 100%)", pointerEvents:"none" }} />
                {/* Name overlay */}
                <div style={{ position:"absolute", bottom:"14px", left:"16px", right:"16px", display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                    <span style={{ fontSize:"18px", fontWeight:800, color:C.white, letterSpacing:"-0.03em" }}>Alex</span>
                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill={C.green}/>
                      <path d="M4 7l2 2 4-4" stroke="#000" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize:"9px", color:C.dim }}>Est. human</span>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding:"16px 20px 20px", position:"relative", zIndex:1 }}>
                <p style={{ fontSize:"13px", color:C.muted, lineHeight:1.75, margin:"0 0 16px" }}>
                  Hi, I'm Alex. I made this website because I genuinely think you'd rather give me a dollar than spend it on something forgettable. I'm not a charity. I'm not solving a problem.{" "}
                  <span style={{ color:"rgba(255,255,255,0.6)" }}>I just think it would be funny if this worked — and I could really use the dollar.</span>
                </p>

                <div style={{ height:"1px", background:C.line, marginBottom:"14px" }} />

                {/* Mini stats */}
                <div style={{ display:"flex" }}>
                  {[
                    { value:"$0.67", label:"Per dollar to Alex" },
                    { value:"$1k",   label:"First milestone"    },
                    { value:"$0",    label:"Raised so far"      },
                  ].map(({ value, label }, i) => (
                    <div key={i} style={{ flex:1, borderLeft: i>0 ? `1px solid ${C.line}` : "none", paddingLeft: i>0 ? "14px" : "0" }}>
                      <div style={{ fontFamily:"'Courier New',monospace", fontSize:"16px", fontWeight:700, color:C.green, letterSpacing:"-0.03em", lineHeight:1, marginBottom:"4px" }}>{value}</div>
                      <div style={{ fontSize:"9px", color:C.dim, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Milestone note */}
            <motion.div
              initial={{ opacity:0, y:8 }}
              animate={isInView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.5, delay:0.35 }}
              style={{ padding:"12px 16px", borderRadius:"10px", border:`1px solid rgba(0,168,98,0.16)`, background:"rgba(0,168,98,0.05)", display:"flex", gap:"12px", alignItems:"flex-start" }}
            >
              <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:C.green, flexShrink:0, marginTop:"6px" }} />
              <p style={{ fontSize:"12px", color:C.muted, lineHeight:1.6, margin:0 }}>
                <span style={{ color:"rgba(255,255,255,0.65)", fontWeight:600 }}>First $1,000 goes entirely to Alex.</span>{" "}
                After that, $0.67 per dollar — payment processing takes the rest. Not Alex's fault.
              </p>
            </motion.div>

            {/* Funding bar */}
            <FundingBar isInView={isInView} />
          </div>

          {/* ══ RIGHT COLUMN — cinematic video ═══════════════════════════════ */}
          <motion.div
            initial={{ opacity:0, x:24 }}
            animate={isInView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.85, ease:[0.16,1,0.3,1], delay:0.15 }}
            style={{ position:"relative" }}
          >
            {/* Green glow behind video */}
            <div style={{
              position:"absolute", inset:"-32px",
              borderRadius:"32px",
              background:"radial-gradient(ellipse at 50% 50%, rgba(0,168,98,0.11) 0%, transparent 68%)",
              filter:"blur(24px)",
              pointerEvents:"none",
              zIndex:0,
            }} />

            <motion.div
              variants={vhsIn}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              style={{ position:"relative", zIndex:1 }}
            >
              <div style={{
                position:"relative",
                width:"100%",
                aspectRatio:"16 / 10",
                overflow:"hidden",
                borderRadius:"18px",
                background:"#060908",
                border:`1px solid rgba(0,168,98,0.14)`,
                boxShadow:[
                  "0 0 0 1px rgba(0,0,0,0.6)",
                  "0 40px 80px rgba(0,0,0,0.7)",
                  "0 8px 24px rgba(0,0,0,0.5)",
                  "0 0 60px rgba(0,168,98,0.06)",
                ].join(","),
              }}>
                {/* Glitch lines */}
                <motion.div variants={glitch1} initial="hidden" animate={isInView ? "visible" : "hidden"}
                  style={{ position:"absolute", left:0, right:0, height:"2px", background:"rgba(0,168,98,0.85)", pointerEvents:"none", zIndex:12 }} />
                <motion.div variants={glitch2} initial="hidden" animate={isInView ? "visible" : "hidden"}
                  style={{ position:"absolute", left:0, right:0, height:"1px", background:"rgba(0,168,98,0.55)", pointerEvents:"none", zIndex:12 }} />

                {/* Scanline */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"rgba(0,168,98,0.18)", animation:"scanline 6s linear infinite", pointerEvents:"none", zIndex:8 }} />

                {/* Film grain */}
                <div style={{
                  position:"absolute", inset:0, pointerEvents:"none", zIndex:7, opacity:0.35, mixBlendMode:"overlay",
                  backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
                  backgroundSize:"120px 120px",
                  animation:"grain 0.45s steps(1) infinite",
                }} />

                {/* Vignette */}
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:6, background:"radial-gradient(ellipse 75% 70% at 50% 50%, transparent 25%, rgba(6,9,8,0.55) 65%, rgba(6,9,8,0.92) 100%)" }} />

                {/* Letterbox */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"8%", background:"#000", zIndex:5 }} />
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"8%", background:"#000", zIndex:5 }} />

                {/* Play */}
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"18px", zIndex:9 }}>
                  <div style={{
                    width:"72px", height:"72px", borderRadius:"50%",
                    border:`1.5px solid rgba(0,168,98,0.45)`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    animation:"pulse 2.8s ease-in-out infinite",
                    background:"rgba(0,168,98,0.05)",
                    backdropFilter:"blur(4px)",
                  }}>
                    <div style={{ width:0, height:0, borderTop:"11px solid transparent", borderBottom:"11px solid transparent", borderLeft:`20px solid ${C.green}`, marginLeft:"5px" }} />
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:C.green, marginBottom:"6px" }}>Coming soon</div>
                    <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.18)", lineHeight:1.6 }}>Cinematic montage — Alex in his natural habitat</div>
                  </div>
                </div>

                {/* HUD */}
                <div style={{ position:"absolute", bottom:"14px", left:"16px", zIndex:11 }}><Timecode /></div>
                <div style={{ position:"absolute", top:"14px", right:"16px", display:"flex", alignItems:"center", gap:"5px", zIndex:11 }}>
                  <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#ff3b30", boxShadow:"0 0 5px #ff3b30", animation:"blink 1.2s ease-in-out infinite" }} />
                  <span style={{ fontSize:"8px", fontWeight:700, letterSpacing:"0.12em", color:"rgba(255,255,255,0.18)", fontFamily:"'Courier New',monospace" }}>REC</span>
                </div>
                <div style={{ position:"absolute", top:"14px", left:"16px", zIndex:11 }}>
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:"8px", fontWeight:600, letterSpacing:"0.12em", color:"rgba(0,168,98,0.4)" }}>2.35:1</span>
                </div>

                {/* Scrubber */}
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"2px", background:"rgba(255,255,255,0.04)", zIndex:11 }}>
                  <div style={{ height:"100%", background:C.green, opacity:0.55, animation:"progress 14s linear infinite" }} />
                </div>
              </div>
            </motion.div>

            {/* Caption */}
            <motion.div
              initial={{ opacity:0 }}
              animate={isInView ? { opacity:1 } : {}}
              transition={{ duration:0.5, delay:0.95 }}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"12px", paddingLeft:"2px" }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{ width:"3px", height:"3px", borderRadius:"50%", background:C.green }} />
                <span style={{ fontSize:"11px", color:C.dim }}>Directed by Alex · For Alex · About Alex</span>
              </div>
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:"9px", color:"rgba(0,168,98,0.38)" }}>EP.01</span>
            </motion.div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes scanline { from{top:-1px} to{top:100%} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.1} }
        @keyframes progress { from{width:0%} to{width:100%} }
        @keyframes grain    { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-1%,-1%)} 50%{transform:translate(1%,0)} 75%{transform:translate(0,1%)} }
      `}</style>
    </section>
  );
}
