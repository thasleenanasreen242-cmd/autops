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
