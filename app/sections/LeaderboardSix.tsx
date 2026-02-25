import { getDonations } from "@/lib/donations";

export default async function Leaderboard() {
  const { data: donations, error } = await getDonations();

  return (
    <section className="flex h-screen shrink-0 snap-start snap-always flex-col items-center justify-center gap-8 px-6 py-20">
      <h2 className="text-2xl font-semibold text-[var(--color-gold)]">
        Active Leaderboard
      </h2>
      {error && (
        <p className="text-sm text-[var(--color-foreground)]/60">
          Could not load leaderboard. Try again later.
        </p>
      )}
      {!error && (!donations || donations.length === 0) && (
        <p className="text-sm text-[var(--color-foreground)]/60">
          No donations yet. Be the first!
        </p>
      )}
      {!error && donations && donations.length > 0 && (
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
    </section>
  );
}
