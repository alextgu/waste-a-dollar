import { getDonations } from "@/lib/donations";

const fallbackLeaders = [
  { name: "Anonymous Whale", amount: 100 },
  { name: "Late Night Scroller", amount: 42 },
  { name: "Impulse Clicker", amount: 27 },
  { name: "Gold Standard", amount: 19 },
  { name: "Probably Alex", amount: 10 },
  { name: "Friend of a Friend", amount: 5 },
];

export default async function Leaderboard() {
  const { data: donations, error } = await getDonations();
  const hasError = Boolean(error);

  const effectiveLeaders =
    !hasError && donations && donations.length > 0
      ? donations
          .slice()
          .sort((a, b) => Number(b.amount_donated) - Number(a.amount_donated))
          .slice(0, 8)
          .map((d) => ({
            id: d.id,
            name: d.name ?? "Anonymous",
            amount: Number(d.amount_donated) || 0,
          }))
      : fallbackLeaders.map((d, i) => ({ id: i, ...d }));

  return (
    <section className="flex h-screen shrink-0 snap-start snap-always items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-5xl flex-col items-start gap-8">
        <div className="space-y-2 text-left">
          <h1 className="text-3xl font-semibold leading-tight text-[var(--color-gold)]">
            Active leaderboard
          </h1>
          <p className="text-xs text-[var(--color-foreground)]/70">
            Live-ish feed of who already wasted a dollar here.
          </p>
        </div>

        {/* Infinite moving cards strip (Aceternity-style, vertical) */}
        <div className="h-64 w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-brass)] bg-[var(--color-black)]/60 px-3 py-3 sm:h-72 sm:max-w-lg">
        <div className="relative h-full">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[var(--color-black)] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--color-black)] to-transparent" />

          <div className="leaderboard-marquee flex h-full flex-col gap-3">
            {[...effectiveLeaders, ...effectiveLeaders].map((d, idx) => (
              <div
                key={`${d.id}-${idx}`}
                className="rounded-xl border border-[var(--color-brass)] bg-[var(--color-background)]/80 px-4 py-3 text-xs sm:text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-[var(--color-foreground)]">
                    {idx % effectiveLeaders.length + 1}. {d.name}
                  </span>
                  <span className="font-semibold text-[var(--color-gold)]">
                    ${d.amount.toFixed(2)}
                  </span>
                </div>
                <div className="mt-1 h-[1px] w-full bg-[var(--color-brass)]/60" />
                <p className="mt-1 text-[10px] text-[var(--color-foreground)]/60">
                  Scrolling flex, infinite guilt.
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>

        {hasError && (
          <p className="text-sm text-[var(--color-foreground)]/60">
            Could not load leaderboard. Try again later.
          </p>
        )}
        {!hasError && (!donations || donations.length === 0) && (
          <p className="text-sm text-[var(--color-foreground)]/60">
            No real donations yet. Showing demo leaderboard.
          </p>
        )}
        {!hasError && donations && donations.length > 0 && (
          <ul className="w-full max-w-md space-y-2 text-left">
            {donations.slice(0, 10).map((d, i) => (
              <li
                key={d.id}
                className="flex justify-between rounded border border-[var(--color-brass)] px-4 py-2 text-sm"
              >
                <span className="text-[var(--color-foreground)]">
                  {i + 1}. {d.name}
                </span>
                <span className="text-[var(--color-gold)]">
                  ${Number(d.amount_donated).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
