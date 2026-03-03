export default function HeroTwo() {
  return (
    <section
      className="flex h-screen shrink-0 snap-start snap-always items-center justify-center bg-[var(--color-black)] px-6 py-20 text-[var(--color-foreground)]"
      data-bg="black"
    >
      <div className="grid h-full w-full max-w-6xl grid-cols-1 items-center gap-10 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Sticky / framed video side – alternate guilt reel */}
        <div className="relative flex h-full items-center justify-center">
          <div className="sticky top-24 w-full max-w-md rounded-[32px] border border-[rgba(255,255,255,0.16)] bg-[var(--color-black)] shadow-[0_22px_70px_rgba(0,0,0,0.75)]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] bg-[var(--color-black)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,214,0,0.22),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.95),rgba(0,0,0,1))]" />
              <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-cream)]/70">
                  guilt montage v2
                </p>
                <p className="mt-3 text-2xl font-semibold text-[var(--color-cream)]">
                  You will forget this dollar.
                </p>
                <p className="mt-3 text-[11px] text-[var(--color-cream)]/70">
                  New clip, same thesis: future-you will not remember the money,
                  only that you either did or did not tap &ldquo;Donate.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: copy + faux graph component */}
        <div className="no-scrollbar h-full overflow-y-auto pr-1 text-[var(--color-foreground)]">
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight text-[var(--color-foreground)]">
                Where will your money go?
              </h1>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-foreground)]/55">
                alternate edit — same destination
              </p>
            </div>

            <div className="space-y-3 text-[var(--color-foreground)]">
              <p className="text-2xl font-semibold leading-tight">
                Financial impact: microscopic. Emotional impact: annoyingly large.
              </p>
              <p className="text-2xl font-semibold leading-tight">
                Your brain will log this as a &ldquo;decision,&rdquo; not a
                &ldquo;transaction.&rdquo;
              </p>
              <p className="text-2xl font-semibold leading-tight">
                The bar chart below is fake — the guilt curve is not.
              </p>
            </div>

            {/* Graph card */}
            <div className="rounded-3xl border border-[rgba(255,255,255,0.12)] bg-[rgba(10,10,10,0.9)] px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground)]/50">
                    perceived impact vs. actual cost
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-foreground)]">
                    Guilt curve vs. $1 reality.
                  </p>
                </div>
                <span className="rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[10px] text-[var(--color-foreground)]/65">
                  Mock data · For vibes only
                </span>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3 text-[10px] text-[var(--color-foreground)]/55">
                <span>Now</span>
                <span>+1 day</span>
                <span>+1 week</span>
                <span>+1 year</span>
              </div>

              <div className="mt-2 flex h-40 items-end gap-4">
                {/* Bar 1 – Now: high guilt, tiny cost */}
                <div className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    <div className="h-[75%] w-6 rounded-full bg-[var(--color-gold)] shadow-[0_0_24px_rgba(255,214,0,0.6)]" />
                  </div>
                  <p className="text-[10px] text-[var(--color-foreground)]/70">
                    Guilt
                  </p>
                </div>
                {/* Bar 2 – +1 day */}
                <div className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    <div className="h-[40%] w-6 rounded-full bg-[var(--color-gold)]/90" />
                  </div>
                  <p className="text-[10px] text-[var(--color-foreground)]/70">
                    Mild
                  </p>
                </div>
                {/* Bar 3 – +1 week */}
                <div className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    <div className="h-[18%] w-6 rounded-full bg-[var(--color-gold)]/70" />
                  </div>
                  <p className="text-[10px] text-[var(--color-foreground)]/70">
                    Memory
                  </p>
                </div>
                {/* Bar 4 – +1 year: cost vs. life graph */}
                <div className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    <div className="absolute bottom-0 h-[6%] w-6 rounded-full bg-[var(--color-gold)]/60" />
                    <div className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[var(--color-foreground)]/25" />
                  </div>
                  <p className="text-[10px] text-[var(--color-foreground)]/70">
                    Noise
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-[var(--color-foreground)]/60">
                The bar chart is fake, but the feeling is real: the guilt falls off
                fast; the story you tell about doing it sticks around longer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
