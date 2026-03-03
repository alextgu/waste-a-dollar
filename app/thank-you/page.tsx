export default async function ThankYouPage({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const sessionId = typeof params.session_id === 'string' ? params.session_id : undefined;

  return (
    <div className="mx-auto mt-20 max-w-md px-6 text-center">
      <h1 className="text-2xl font-bold">Thank you!</h1>
      <p className="mt-3 text-sm text-[var(--color-foreground)]/70">
        Your donation was processed successfully.
      </p>
      {sessionId && (
        <p className="mt-6 break-all rounded-md border border-[var(--color-foreground)]/15 bg-black/5 px-3 py-2 text-xs text-[var(--color-foreground)]/70">
          Session: {sessionId}
        </p>
      )}
      <a
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-[var(--color-gold)] px-5 py-2 text-sm font-semibold text-black"
      >
        Back home
      </a>
    </div>
  );
}

