"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const pages = [
  { href: "/", label: "Home" },
  { href: "/dev", label: "Dev" },
  { href: "/donate", label: "Donate" },
  { href: "/thank-you", label: "Thank you" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [currentBg, setCurrentBg] = useState<"gold" | "cream" | "black" | "white">(
    "black",
  );

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-bg]"),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target) {
          const bg = visible.target.getAttribute("data-bg");
          if (bg === "gold" || bg === "cream" || bg === "black" || bg === "white") {
            setCurrentBg(bg);
          }
        }
      },
      { threshold: 0.55 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isGoldBg = currentBg === "gold";
  const accentColor = isGoldBg ? "var(--color-cream)" : "var(--color-gold)";
  const accentTextOn = "var(--color-black)";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-brass)] bg-[var(--color-gold)] text-xs font-semibold text-[var(--color-black)]">
          Logo
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/donate"
          style={{
            borderColor: accentColor,
            backgroundColor: accentColor,
            color: accentTextOn,
          }}
          className="hidden rounded-xl border px-4 py-1.5 text-sm font-medium transition-colors sm:inline-block"
        >
          Donate
        </Link>

        <div className="relative">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setOpen((v) => !v)}
            style={{ borderColor: accentColor }}
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-transparent text-[var(--color-foreground)]/80 transition-colors"
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-[3px]">
              <span
                className="block h-[1.5px] w-4 rounded"
                style={{ backgroundColor: accentColor }}
              />
              <span
                className="block h-[1.5px] w-4 rounded"
                style={{ backgroundColor: accentColor }}
              />
              <span
                className="block h-[1.5px] w-4 rounded"
                style={{ backgroundColor: accentColor }}
              />
            </span>
          </button>

          {open && (
            <div className="fixed inset-0 z-40 bg-[var(--color-black)]/95 px-6 py-6 text-sm sm:px-10 sm:py-10">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-brass)] bg-[var(--color-gold)] text-xs font-semibold text-[var(--color-black)]">
                    Logo
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-brass)] bg-transparent text-[var(--color-foreground)]/80 hover:border-[var(--color-gold)]"
                >
                  <span className="sr-only">Close</span>
                  <span className="block h-[1.5px] w-4 rotate-45 transform rounded bg-[var(--color-foreground)]" />
                  <span className="block h-[1.5px] w-4 -rotate-45 transform rounded bg-[var(--color-foreground)] -mt-[1.5px]" />
                </button>
              </div>

              <div className="mb-6">
                <Link
                  href="/donate"
                  onClick={() => setOpen(false)}
                  style={{
                    borderColor: accentColor,
                    backgroundColor: accentColor,
                    color: accentTextOn,
                  }}
                  className="inline-flex items-center justify-center rounded-xl border px-5 py-2 text-sm font-semibold transition-colors"
                >
                  Donate
                </Link>
              </div>

              <ul className="space-y-2 text-base sm:text-lg">
                {pages.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="block rounded-lg px-3 py-3 text-[var(--color-foreground)] hover:bg-[var(--color-gold)]/10"
                      onClick={() => setOpen(false)}
                    >
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
