"use client";

import BMCButton from "./BMCButton";

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-end gap-4 bg-[var(--color-background)]/90 p-4 backdrop-blur-sm">
      <BMCButton />
    </nav>
  );
}
