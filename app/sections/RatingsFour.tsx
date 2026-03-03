export default function Ratings() {
  return (
    <section
      className="flex h-screen shrink-0 snap-start snap-always items-center justify-center bg-[var(--color-black)] px-6 py-20 text-[var(--color-gold)]"
      data-bg="black"
    >
      <div className="w-full max-w-5xl space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-2xl font-semibold text-[var(--color-gold)]">
            Donation Confidence Grid
          </h2>
          <p className="max-w-sm text-xs text-[var(--color-foreground)]/60">
            A very serious, very fake institutional dashboard proving that wasting
            a dollar is a sound financial decision.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="col-span-2 rounded-[40px] border border-[rgba(255,255,255,0.12)] bg-[var(--color-black)] px-6 py-6 sm:py-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/50">
              Total donors (lifetime)
            </p>
            <p className="mt-3 text-4xl font-semibold text-[var(--color-foreground)]">
              1,024
            </p>
            <p className="mt-2 text-xs text-[var(--color-foreground)]/60">
              Enough people have done this that your $1 is statistically normal
              behaviour.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-[40px] border border-[rgba(255,255,255,0.12)] bg-[var(--color-black)] px-6 py-6 sm:py-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/50">
              Avg. decision time
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--color-foreground)]">
              3.7s
            </p>
            <p className="mt-2 text-xs text-[var(--color-foreground)]/60">
              The time between “this is dumb” and “fine, here’s a dollar.”
            </p>
          </div>

          {/* Action Card – Gold */}
          <div className="rounded-[40px] border border-[rgba(0,0,0,0.6)] bg-[var(--color-gold)] px-6 py-6 sm:py-7 text-[var(--color-black)]">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-black)]/70">
              Action card
            </p>
            <p className="mt-3 text-3xl font-semibold">
              100% verified
            </p>
            <p className="mt-2 text-xs text-[var(--color-black)]/75">
              This is not investment advice, but our models strongly suggest
              clicking “Donate” will feel weirdly official.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-[40px] border border-[rgba(255,255,255,0.12)] bg-[var(--color-black)] px-6 py-6 sm:py-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/50">
              Regret rate
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--color-foreground)]">
              &lt; 0.5%
            </p>
            <p className="mt-2 text-xs text-[var(--color-foreground)]/60">
              Statistically, you&apos;re more likely to regret not donating.
            </p>
          </div>

          {/* Card 5 */}
          <div className="col-span-2 rounded-[40px] border border-[rgba(255,255,255,0.12)] bg-[var(--color-black)] px-6 py-6 sm:py-7">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/50">
              Financial responsibility score
            </p>
            <p className="mt-3 text-4xl font-semibold text-[var(--color-foreground)]">
              9.8 / 10
            </p>
            <p className="mt-2 text-xs text-[var(--color-foreground)]/60">
              Our made-up rating agency officially classifies this as a
              low-volatility, high-satisfaction micro-spend.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
