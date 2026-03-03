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
      <div className="w-full max-w-3xl text-left sm:text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight text-[var(--color-gold)]">
          Still not convinced?
        </h1>
        <p className="mt-3 text-sm text-[var(--color-foreground)]/70">
          That&apos;s fine. This page exists purely to see how far you&apos;ll let a
          website negotiate with your impulse control.
        </p>
      </div>
    </section>
  );
}
