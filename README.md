# AUTOPS — Procurement Operations

AUTOPS is a single-company procurement workspace for managing leads and, as the remaining modules are connected, supplier discovery, RFQs, supplier responses, quotation comparison and final client quotes.

## Stack
- Next.js App Router + TypeScript
- Supabase Auth and Postgres
- Vercel deployment with GitHub-based continuous deployment

## Current implementation status
- Company settings screen reads and saves company details and quotation defaults to Supabase.
- Lead register reads, creates and verifies lead records in Supabase.
- Sign-in uses Supabase Auth; public sign-up is intentionally disabled in the UI.
- Supplier directory, RFQ delivery, supplier response ingestion, quote comparison, PDF generation, and Zoho inbox automation are not yet live. Any sample supplier/activity items still shown in the UI are demo content and must not be treated as real records.

## First-time setup
1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel for the AUTOPS project only.
2. Open the SQL Editor in the dedicated AUTOPS Supabase project and run the full `supabase/setup.sql` script. It creates the procurement tables, company settings table, indexes, grants and authenticated-user RLS policies. Review the SQL before applying it. Do not run it against SensCore, NexPro or LexRenew.
3. In Supabase Authentication, create the first AUTOPS administrator user. Public sign-up is intentionally not offered on the login page.
4. Deploy the branch and sign in at `/login`. Open Settings to enter the company name and other details.
5. Create a lead from the dashboard and confirm it appears after refreshing. Do not use production customer data until the project and permissions have been verified.

The current RLS policy model is for a single private workspace: signed-in users in this AUTOPS project share the workspace's records. If multiple companies or fine-grained roles are needed later, add workspace membership and owner-scoped policies before enabling that model.

## Local development
1. Install Node.js 20 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the AUTOPS Supabase URL and publishable/anon key.
4. Run `npm run dev` and open http://localhost:3000.

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Never expose service-role keys, Supabase secret keys, AI provider keys, Zoho OAuth secrets or email provider secrets to the browser. Keep server-side secrets in server-only Vercel environment variables.

## Remaining workflow
1. Lead registration and verification — database connected.
2. Supplier directory — to be connected to the supplier tables.
3. RFQ preparation and sending — database workflow and email delivery pending.
4. Supplier response tracking — inbox ingestion and extraction pending.
5. Quote comparison — supplier offer capture and comparison pending.
6. Final quote generation — company defaults, calculations and PDF generation pending.
7. Zoho inbox automation — OAuth setup and secure scheduled ingestion pending.

## Deployment
Use a Git-connected Vercel project linked to this repository. Preview builds should be verified before merging to the production branch.
