-- Bloom Materials Tracker — Database Setup
-- Paste this entire file into the Supabase SQL Editor and click "Run"

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Table: clients
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  contact_name text not null default '',
  created_at timestamptz not null default now()
);

create index idx_clients_created_at on public.clients (created_at desc);

-- Table: material_logs
create table public.material_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  date timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create index idx_material_logs_client_id on public.material_logs (client_id);
create index idx_material_logs_date on public.material_logs (date desc);

-- Table: material_items
create table public.material_items (
  id uuid primary key default gen_random_uuid(),
  log_id uuid not null references public.material_logs(id) on delete cascade,
  name text not null,
  quantity double precision not null default 1.0,
  unit text not null
);

create index idx_material_items_log_id on public.material_items (log_id);

-- Table: quick_select_materials
create table public.quick_select_materials (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  unit text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security (all signed-in users can do everything)
alter table public.clients enable row level security;
alter table public.material_logs enable row level security;
alter table public.material_items enable row level security;
alter table public.quick_select_materials enable row level security;

create policy "auth_select_clients" on public.clients for select to authenticated using (true);
create policy "auth_insert_clients" on public.clients for insert to authenticated with check (true);
create policy "auth_update_clients" on public.clients for update to authenticated using (true) with check (true);
create policy "auth_delete_clients" on public.clients for delete to authenticated using (true);

create policy "auth_select_logs" on public.material_logs for select to authenticated using (true);
create policy "auth_insert_logs" on public.material_logs for insert to authenticated with check (true);
create policy "auth_update_logs" on public.material_logs for update to authenticated using (true) with check (true);
create policy "auth_delete_logs" on public.material_logs for delete to authenticated using (true);

create policy "auth_select_items" on public.material_items for select to authenticated using (true);
create policy "auth_insert_items" on public.material_items for insert to authenticated with check (true);
create policy "auth_update_items" on public.material_items for update to authenticated using (true) with check (true);
create policy "auth_delete_items" on public.material_items for delete to authenticated using (true);

create policy "auth_select_qsm" on public.quick_select_materials for select to authenticated using (true);
create policy "auth_insert_qsm" on public.quick_select_materials for insert to authenticated with check (true);
create policy "auth_delete_qsm" on public.quick_select_materials for delete to authenticated using (true);

-- Enable real-time sync (so all employees see updates instantly)
alter publication supabase_realtime add table public.clients;
alter publication supabase_realtime add table public.material_logs;
alter publication supabase_realtime add table public.material_items;
alter publication supabase_realtime add table public.quick_select_materials;

-- Default quick-select materials for landscaping
insert into public.quick_select_materials (name, unit, is_default) values
  ('Mulch', 'cubic yards', true),
  ('Topsoil', 'cubic yards', true),
  ('Gravel', 'tons', true),
  ('Sand', 'tons', true),
  ('Compost', 'bags', true),
  ('Landscape Fabric', 'rolls', true),
  ('Edging', 'linear feet', true),
  ('Pavers', 'square feet', true),
  ('Sod', 'square feet', true),
  ('Plants', 'units', true),
  ('Fertilizer', 'bags', true),
  ('Seed', 'pounds', true);
