# AUTOPS — Procurement Operations

AUTOPS is a dedicated procurement workspace for managing the journey from lead registration through supplier discovery, RFQs, supplier responses, quotation comparison, and final client quotes.

## Stack
- Next.js App Router + TypeScript
- Supabase (planned persistent database, authentication and document storage)
- Vercel deployment with GitHub-based continuous deployment

## Current status
The initial responsive dashboard and interactive UI prototype are in place. It currently uses sample data in the browser; it is **not yet a production-connected workflow**. Live document extraction, supplier discovery, email delivery/inbox ingestion, durable storage, PDF generation, authentication and role permissions require their service integrations and credentials.

## Local development
1. Install Node.js 20 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the values when the Supabase project is created.
4. Run `npm run dev` and open http://localhost:3000.

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-side integrations will be added using server-only environment variables. Never expose service-role keys, AI provider keys, or email provider secrets to the browser.

## Database
Review `supabase/schema.sql` and apply it to the dedicated AUTOPS Supabase project. Do not apply it to SensCore, NexPro, or LexRenew databases.

## Procurement stages
1. Lead registration and verification
2. Supplier discovery and selection
3. RFQ preparation and sending
4. Supplier response tracking
5. Quotation comparison and selection
6. Final quote generation

## Deployment
Connect this repository to the existing AUTOPS project in Vercel, or create a new Git-connected project with this repository as its production source. Pushes to the production branch should trigger deployments after the connection and build settings are verified.
