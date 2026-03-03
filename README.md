# waste a dollar

Alex will convince you to waste a dollar on him

## Supabase verification

- **Database:** Table `public.donations`; RLS with insert/select/update policies. Migrations in `supabase/migrations/`.
- **Rows:** Types in `types/donation.ts` match table columns.
- **Endpoints:** GET/POST `/api/donations`, GET/PATCH `/api/donations/[id]`. Invalid body → 400; invalid UUID → 400; not found → 404; server error → 500.
