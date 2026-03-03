"use client";

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[var(--color-background)]/90 p-4 backdrop-blur-sm">
      <span className="text-sm text-[var(--color-foreground)]/70">
        Waste a Dollar
      </span>
      <button
        type="button"
        className="rounded-xl border border-[var(--color-brass)] px-4 py-2 text-sm text-[var(--color-foreground)]/80"
      >
        Donate
      </button>
    </nav>
  );
}
