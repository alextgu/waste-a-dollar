export default function Hero() {
  return (
    <section
      className="flex h-screen shrink-0 snap-start snap-always items-center justify-center bg-[var(--color-gold)] px-6 pt-24 pb-20 text-[var(--color-black)]"
      data-bg="gold"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <div className="space-y-3">
          <h1
            className="text-4xl sm:text-5xl"
            style={{ fontWeight: "var(--font-weight-header)" }}
          >
            Waste a Dollar.
          </h1>
          <p
            className="text-[13px] sm:text-sm uppercase tracking-[0.18em] text-black/70"
            style={{ fontWeight: "var(--font-weight-subtitle)" }}
          >
            an extremely serious one–dollar decision
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[var(--color-brass)] bg-[var(--color-gold)] px-4 py-3 text-sm text-[var(--color-black)]">
            <div className="font-semibold">Aero Loonie Gold</div>
            <div className="text-xs opacity-80">#FFD600</div>
          </div>
          <div className="rounded-xl border border-[var(--color-brass)] bg-[var(--color-black)] px-4 py-3 text-sm text-[var(--color-white)]">
            <div className="font-semibold">Expensive Black</div>
            <div className="text-xs opacity-80">#0D0D0D</div>
          </div>
          <div className="rounded-xl border border-[var(--color-brass)] bg-[var(--color-cream)] px-4 py-3 text-sm text-[var(--color-black)]">
            <div className="font-semibold">Cream White</div>
            <div className="text-xs opacity-80">#F0EDE8</div>
          </div>
          <div className="rounded-xl border border-[var(--color-brass)] bg-[var(--color-white)] px-4 py-3 text-sm text-[var(--color-black)]">
            <div className="font-semibold">White</div>
            <div className="text-xs opacity-80">#FFFFFF</div>
          </div>
        </div>
      </div>
    </section>
  );
}
