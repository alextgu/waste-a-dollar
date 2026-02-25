export default function StillNotConvinced({
  connectFooter = false,
}: {
  connectFooter?: boolean;
}) {
  return (
    <section
      className={
        connectFooter
          ? "flex min-h-screen flex-shrink-0 items-center justify-center px-6 py-20"
          : "flex h-screen shrink-0 snap-start snap-always items-center justify-center px-6 py-20"
      }
    >
      <h2 className="text-2xl font-semibold text-[var(--color-gold)]">
        Still not convinced — Game
      </h2>
    </section>
  );
}
