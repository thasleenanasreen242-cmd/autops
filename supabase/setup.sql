-- AUTOPS dedicated database schema.
-- Apply only to the AUTOPS Supabase project, never to another project.
create extension if not exists pgcrypto;

create sequence if not exists public.lead_id_seq start 125;

create or replace function public.make_lead_id()
returns text language sql volatile as $$
  select 'LEAD-' || extract(year from now())::int::text || '-' || lpad(nextval('public.lead_id_seq')::text, 5, '0');
$$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_number text not null unique default public.make_lead_id(),
  company_name text not null,
  opportunity_title text not null,
  description text,
  contact_name text,
  contact_email text,
  contact_phone text,
  country text,
  sourcing_region text not null check (sourcing_region in ('Inside UAE','Overseas','UAE + Overseas')),
  status text not null default 'Awaiting review',
  stage text not null default 'Lead registration',
  priority text not null default 'Medium' check (priority in ('Low','Medium','High','Urgent')),
  owner_name text,
  extracted_fields jsonb not null default '{}'::jsonb,
  verification_notes text,
  verified_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_documents (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  file_size bigint,
  extraction_status text not null default 'pending',
  extracted_text text,
  extracted_fields jsonb not null default '{}'::jsonb,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  supplier_name text not null,
  country text,
  region text,
  website text,
  email text,
  phone text,
  capabilities text[] not null default '{}',
  certifications text[] not null default '{}',
  source text not null default 'internal',
  verification_status text not null default 'unverified',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_suppliers (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  match_score numeric(5,2),
  match_reason text,
  selection_status text not null default 'shortlisted',
  created_at timestamptz not null default now(),
  unique (lead_id, supplier_id)
);

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  rfq_number text not null unique,
  lead_id uuid not null references public.leads(id) on delete cascade,
  subject text not null,
  body text not null,
  recipient_emails text[] not null default '{}',
  cc_emails text[] not null default '{}',
  attachment_paths text[] not null default '{}',
  status text not null default 'draft',
  sent_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.rfq_supplier_invites (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  email_status text not null default 'pending',
  sent_at timestamptz,
  last_reminder_at timestamptz,
  unique (rfq_id, supplier_id)
);

create table if not exists public.supplier_responses (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete set null,
  response_email_id text,
  response_received_at timestamptz,
  response_status text not null default 'received',
  original_subject text,
  original_body text,
  attachment_paths text[] not null default '{}',
  extracted_quote jsonb not null default '{}'::jsonb,
  extraction_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  lead_id uuid not null references public.leads(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete set null,
  supplier_response_id uuid references public.supplier_responses(id) on delete set null,
  currency text not null default 'AED',
  subtotal numeric(14,2) not null default 0,
  freight_cost numeric(14,2) not null default 0,
  duties_cost numeric(14,2) not null default 0,
  other_costs numeric(14,2) not null default 0,
  delivery_days integer,
  payment_terms text,
  validity_until date,
  line_items jsonb not null default '[]'::jsonb,
  commercial_notes text,
  internal_notes text,
  status text not null default 'under_review',
  selected boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.final_quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  lead_id uuid not null references public.leads(id) on delete cascade,
  selected_quotation_ids uuid[] not null default '{}',
  currency text not null default 'AED',
  cost_total numeric(14,2) not null default 0,
  freight_cost numeric(14,2) not null default 0,
  duties_cost numeric(14,2) not null default 0,
  markup_percent numeric(7,3) not null default 0,
  selling_total numeric(14,2) not null default 0,
  terms text,
  client_notes text,
  pdf_storage_path text,
  status text not null default 'draft',
  generated_by uuid references auth.users(id) on delete set null,
  generated_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  event_type text not null,
  title text not null,
  details jsonb not null default '{}'::jsonb,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists leads_stage_idx on public.leads(stage);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists suppliers_country_idx on public.suppliers(country);
create index if not exists rfqs_lead_id_idx on public.rfqs(lead_id);
create index if not exists supplier_responses_rfq_idx on public.supplier_responses(rfq_id);
create index if not exists quotations_lead_id_idx on public.quotations(lead_id);
create index if not exists activity_log_lead_idx on public.activity_log(lead_id, created_at desc);

-- RLS is intentionally enabled before user-facing database access is implemented.
-- Add role-aware policies after the workspace membership model is chosen.
alter table public.leads enable row level security;
alter table public.lead_documents enable row level security;
alter table public.suppliers enable row level security;
alter table public.lead_suppliers enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_supplier_invites enable row level security;
alter table public.supplier_responses enable row level security;
alter table public.quotations enable row level security;
alter table public.final_quotes enable row level security;
alter table public.activity_log enable row level security;


-- AUTOPS initial application setup.
-- Run ONLY in the dedicated AUTOPS Supabase project after reviewing the project ref.
-- The app is a single-company workspace. Restrict access by requiring Supabase Auth.
-- Do not enable public/anon CRUD policies.

create table if not exists public.company_settings (
  id text primary key default 'default' check (id = 'default'),
  company_name text not null,
  legal_name text,
  email text,
  phone text,
  website text,
  address text,
  country text not null default 'United Arab Emirates',
  currency text not null default 'AED',
  sourcing_regions text not null default 'UAE + Overseas'
    check (sourcing_regions in ('Inside UAE','Overseas','UAE + Overseas')),
  quote_validity_days integer not null default 30 check (quote_validity_days between 1 and 365),
  default_markup numeric(7,3) not null default 0 check (default_markup >= 0 and default_markup <= 1000),
  quotation_terms text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.company_settings enable row level security;

drop policy if exists "Authenticated workspace users can read company settings" on public.company_settings;
create policy "Authenticated workspace users can read company settings"
  on public.company_settings for select to authenticated using (true);

drop policy if exists "Authenticated workspace users can insert company settings" on public.company_settings;
create policy "Authenticated workspace users can insert company settings"
  on public.company_settings for insert to authenticated with check (true);

drop policy if exists "Authenticated workspace users can update company settings" on public.company_settings;
create policy "Authenticated workspace users can update company settings"
  on public.company_settings for update to authenticated using (true) with check (true);

-- Single-workspace access model: every signed-in member of this private AUTOPS
-- project can operate its shared procurement records. No anon policies are created.
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'leads','lead_documents','suppliers','lead_suppliers','rfqs',
    'rfq_supplier_invites','supplier_responses','quotations','final_quotes','activity_log'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', 'Authenticated users can manage AUTOPS ' || tbl, tbl);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      'Authenticated users can manage AUTOPS ' || tbl, tbl
    );
  end loop;
end $$;

grant select, insert, update, delete on public.company_settings to authenticated;
grant select, insert, update, delete on public.leads, public.lead_documents, public.suppliers,
  public.lead_suppliers, public.rfqs, public.rfq_supplier_invites, public.supplier_responses,
  public.quotations, public.final_quotes, public.activity_log to authenticated;
grant usage, select on all sequences in schema public to authenticated;
