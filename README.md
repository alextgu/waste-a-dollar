# waste a dollar

Alex will convince you to waste a dollar on him

## Buy Me a Coffee (BMC) – seeing donations from BMC

- **GET `/api/donations/bmc`** – Fetches from BMC’s API when you set `BUYMEACOFFEE_API_URL` and `BUYMEACOFFEE_ACCESS_TOKEN` in `.env` (BMC’s REST API is deprecated; use this when/if they document a list endpoint).
- **POST `/api/webhooks/bmc`** – Webhook receiver. In BMC Studio → Webhooks set the endpoint to `https://your-domain.com/api/webhooks/bmc`. Donation events are normalized and stored in Supabase. Optional: set `BUYMEACOFFEE_WEBHOOK_SECRET` in BMC and in `.env` to verify requests.

## Supabase verification

- **Database:** Table `public.donations`; RLS with insert/select/update policies. Migrations in `supabase/migrations/`.
- **Rows:** Types in `types/donation.ts` match table columns.
- **Endpoints:** GET/POST `/api/donations`, GET/PATCH `/api/donations/[id]`. Invalid body → 400; invalid UUID → 400; not found → 404; server error → 500.
