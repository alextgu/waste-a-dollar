"use client";

import { motion } from "framer-motion";

const GREEN = "#00A862";
const BLACK = "#0D0D0D";
const BG    = "#F0EDE8";

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -1 }}
      style={{
        fontSize: "12px",
        color: "rgba(13,13,13,0.35)",
        fontWeight: 400,
        textDecoration: "none",
        fontFamily: "Inter, sans-serif",
        transition: "color 0.2s ease",
      }}
      onMouseEnter={e => (e.currentTarget.style.color = GREEN)}
      onMouseLeave={e => (e.currentTarget.style.color = "rgba(13,13,13,0.35)")}
    >
      {label}
    </motion.a>
  );
}

export default function Footer() {
  return (
    <footer style={{
      background: BG,
      borderTop: "1px solid rgba(13,13,13,0.07)",
      fontFamily: "Inter, sans-serif",
      padding: "32px clamp(24px, 6vw, 80px)",
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "-0.04em", color: GREEN, cursor: "default" }}
        >
          waste a dollar.
        </motion.div>

        <p style={{ fontSize: "11px", color: "rgba(13,13,13,0.3)", fontWeight: 300 }}>
          © {new Date().getFullYear()} Alex. All dollars reserved.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {["Privacy", "Terms", "Contact", "Certificate Portal"].map(l => (
            <FooterLink key={l} label={l} href="#" />
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: GREEN }} />
            <span style={{ fontSize: "11px", color: GREEN, fontWeight: 600 }}>Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
