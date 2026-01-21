-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. App Configuration (Global Lock)
create table app_config (
  id int primary key default 1,
  is_locked boolean default false
);
-- Insert default config
insert into app_config (id, is_locked) values (1, false) on conflict do nothing;

-- 2. Users (Agregado Familiar)
create table users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  color text not null, -- e.g. 'bg-orange-500'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tasks (Tarefas Base)
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  user_id uuid references users(id) on delete set null,
  color text not null, -- e.g. 'green'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Weekly Dinners (Jantares)
create table weekly_dinners (
  day text primary key, -- 'Segunda', 'Terça'...
  user_id uuid references users(id) on delete set null,
  dish text default '',
  "order" int not null
);

-- Seed Days of Week
insert into weekly_dinners (day, "order") values 
('Segunda', 1), ('Terça', 2), ('Quarta', 3), ('Quinta', 4), 
('Sexta', 5), ('Sábado', 6), ('Domingo', 7)
on conflict (day) do nothing;

-- 5. Shopping List (Compras)
create table shopping_items (
  id uuid primary key default uuid_generate_v4(),
  item text not null,
  type text default 'general', -- 'general' or 'dinner'
  day text, -- link to specific dinner day if needed
  done boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Realtime Configuration
-- Enable Realtime for all tables
alter publication supabase_realtime add table app_config, users, tasks, weekly_dinners, shopping_items;

-- Policies (RLS) - For MVP, we allow public read/write (since keys are anon)
-- Ideally, we would add Auth, but for this "Home Whiteboard", open access with valid key is acceptable for v1.
alter table app_config enable row level security;
create policy "Public access config" on app_config for all using (true) with check (true);

alter table users enable row level security;
create policy "Public access users" on users for all using (true) with check (true);

alter table tasks enable row level security;
create policy "Public access tasks" on tasks for all using (true) with check (true);

alter table weekly_dinners enable row level security;
create policy "Public access dinners" on weekly_dinners for all using (true) with check (true);

alter table shopping_items enable row level security;
create policy "Public access shopping" on shopping_items for all using (true) with check (true);
