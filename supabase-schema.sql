-- ============================================================
-- Household OS — Supabase Schema
-- Run this entire file in your Supabase SQL editor once.
-- ============================================================

-- ENTRIES: the core log for every module
create table if not exists entries (
  id           uuid primary key default gen_random_uuid(),
  module       text not null check (module in ('utilities','vehicles','finances','maintenance','health')),
  title        text not null,
  description  text,
  amount       text,
  status       text default 'info' check (status in ('done','due_soon','overdue','scheduled','info','paid','unpaid')),
  due_date     date,
  added_by     text not null default 'Member',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- MEMBERS: household members
create table if not exists members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  initials   text not null,
  color      text not null default '#5ba3f5',
  is_online  boolean default false,
  created_at timestamptz default now()
);

-- ALERTS: high-priority flags
create table if not exists alerts (
  id         uuid primary key default gen_random_uuid(),
  entry_id   uuid references entries(id) on delete cascade,
  module     text not null,
  title      text not null,
  priority   text default 'medium' check (priority in ('high','medium','low')),
  resolved   boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security (open read/write for household use — tighten with auth later)
alter table entries enable row level security;
alter table members enable row level security;
alter table alerts enable row level security;

create policy "Public read entries" on entries for select using (true);
create policy "Public insert entries" on entries for insert with check (true);
create policy "Public update entries" on entries for update using (true);
create policy "Public delete entries" on entries for delete using (true);

create policy "Public read members" on members for select using (true);
create policy "Public insert members" on members for insert with check (true);
create policy "Public update members" on members for update using (true);

create policy "Public read alerts" on alerts for select using (true);
create policy "Public insert alerts" on alerts for insert with check (true);
create policy "Public update alerts" on alerts for update using (true);

-- Enable Realtime on entries and alerts
alter publication supabase_realtime add table entries;
alter publication supabase_realtime add table alerts;
alter publication supabase_realtime add table members;

-- Seed some default members (edit names/colors as needed)
insert into members (name, initials, color, is_online) values
  ('Emmanuel', 'EM', '#5ba3f5', true),
  ('Member 2',  'M2', '#4dd9ac', false),
  ('Member 3',  'M3', '#c8f064', false);

-- Seed some starter entries so the dashboard isn't empty
insert into entries (module, title, description, amount, status, due_date, added_by) values
  ('utilities',    'ECG electricity — May 2026',        '312 kWh consumed',            '₵680',   'unpaid',    '2026-05-05', 'Emmanuel'),
  ('utilities',    'Water bill — May 2026',             '14 m³ used',                  '₵120',   'unpaid',    '2026-05-15', 'Emmanuel'),
  ('utilities',    'Internet (Fibre)',                  'Monthly subscription',        '₵450',   'paid',      null,         'Emmanuel'),
  ('utilities',    'Netflix',                           'Monthly subscription',        '₵95',    'paid',      null,         'Emmanuel'),
  ('vehicles',     'Toyota Camry — oil change',        'Overdue since Oct 2025',       null,     'overdue',   '2025-10-01', 'Emmanuel'),
  ('vehicles',     'Toyota Camry — road worthy',       'Expires Sep 14, 2026',         null,     'info',      '2026-09-14', 'Emmanuel'),
  ('vehicles',     'Toyota Camry — insurance',         'Expires Jul 31, 2026',         null,     'due_soon',  '2026-07-31', 'Emmanuel'),
  ('vehicles',     'Second vehicle — insurance',       'Expires Nov 30, 2026',         null,     'info',      '2026-11-30', 'Emmanuel'),
  ('finances',     'Monthly budget',                   'Household income',             '₵12000', 'info',      null,         'Emmanuel'),
  ('maintenance',  'AC filter cleaning',               'Every 3 months',               null,     'due_soon',  '2026-05-06', 'Emmanuel'),
  ('maintenance',  'Pest control treatment',           'Quarterly',                    null,     'due_soon',  '2026-05-31', 'Emmanuel'),
  ('maintenance',  'Generator service',                'Every 6 months',               null,     'scheduled', '2026-06-15', 'Emmanuel'),
  ('maintenance',  'Plumbing check',                   'Completed',                    null,     'done',      null,         'Member 2'),
  ('health',       'AC last serviced',                 'Feb 2026 — filter due soon',   null,     'due_soon',  '2026-05-06', 'Emmanuel'),
  ('health',       'Water filter',                     'Next change Jul 2026',         null,     'info',      '2026-07-01', 'Emmanuel');

-- Seed alerts for overdue items
insert into alerts (module, title, priority) values
  ('vehicles',    'Toyota Camry — oil change overdue', 'high'),
  ('utilities',   'Electricity bill up 18% vs last month', 'medium');
