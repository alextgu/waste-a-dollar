export default function WhatYourMoneyCanDo() {
  return (
    <section
      className="flex h-screen shrink-0 snap-start snap-always items-center justify-center bg-[var(--color-cream)] px-6 py-20 text-[var(--color-black)]"
      data-bg="cream"
    >
      <div className="grid h-full w-full max-w-6xl grid-cols-1 items-center gap-10 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Sticky / framed video side */}
        <div className="relative flex h-full items-center justify-center">
          <div className="sticky top-24 w-full max-w-md rounded-[32px] border border-[rgba(13,13,13,0.12)] bg-[var(--color-black)] shadow-[0_22px_60px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] bg-[var(--color-black)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,214,0,0.18),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(13,13,13,0.9),rgba(13,13,13,1))]" />
              <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-cream)]/75">
                  cinematic proof of concept
                </p>
                <p className="mt-3 text-2xl font-semibold text-[var(--color-cream)]">
                  One dollar. Infinite rationalizations.
                </p>
                <p className="mt-3 text-[11px] text-[var(--color-cream)]/70">
                  This is where a slow, over-produced video would convince you that
                  a micro–$1 decision says something profound about you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll / editorial text side */}
        <div className="no-scrollbar h-full overflow-y-auto pr-1 text-[var(--color-black)]">
          <div className="space-y-10">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight text-[var(--color-black)]">
                Where will your money go?
              </h1>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-black)]/60">
                what your money can do
              </p>
            </div>

            <div className="space-y-4 text-[var(--color-black)]">
              <p className="text-2xl font-semibold leading-tight">
                Into a story you&apos;ll tell, not a product you&apos;ll use.
              </p>
              <p className="text-2xl font-semibold leading-tight">
                Into the 1% of people who thought, &ldquo;this is dumb&rdquo; and
                still clicked.
              </p>
              <p className="text-2xl font-semibold leading-tight">
                Into a private joke between you, your bank app, and this page.
              </p>
              <p className="text-2xl font-semibold leading-tight">
                Into proof that you can afford to be a little bit ridiculous.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
