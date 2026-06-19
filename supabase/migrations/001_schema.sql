-- Full schema in one file for simplicity
create extension if not exists "pgcrypto";

create type area_type as enum ('raised_bed','container','tree_area','greenhouse','indoor','custom');
create type sun_exposure as enum ('full_sun','part_sun','part_shade','full_shade');
create type growth_stage as enum ('seed','seedling','vegetative','flowering','fruiting','harvest','dormant','done');
create type water_source as enum ('rain','hose','drip','watering_can','reservoir','other');
create type feed_type as enum ('organic','synthetic','amendment','compost_tea','foliar');
create type feed_method as enum ('soil_drench','foliar','granular','fertigation','top_dress');
create type severity_level as enum ('low','moderate','high','critical');
create type task_status as enum ('pending','done','skipped','snoozed');
create type task_priority as enum ('low','medium','high','urgent');
create type task_category as enum ('water','feed','prune','pest','harvest','soil','observe','ph','other');
create type diagnosis_source as enum ('ai_photo','ai_text','manual');
create type sub_tier as enum ('free','pro','pro_annual');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text, zone text not null default '9b',
  lat double precision, lon double precision,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gardens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Garden', zone text not null default '9b',
  created_at timestamptz not null default now()
);

create table beds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  garden_id uuid not null references gardens(id) on delete cascade,
  name text not null, area_type area_type default 'raised_bed',
  rows smallint default 2, cols smallint default 8,
  sun_exposure sun_exposure, bed_shape text default 'rect',
  created_at timestamptz not null default now()
);

create table plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  garden_id uuid not null references gardens(id) on delete cascade,
  bed_id uuid references beds(id) on delete set null,
  name text not null, species text,
  stage growth_stage not null default 'seedling',
  plant_date date, expected_harvest date,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table water_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, plant_id uuid references plants(id), bed_id uuid references beds(id), watered_at timestamptz default now(), amount numeric, unit text default 'gal', source water_source default 'hose', created_at timestamptz default now());
create table feed_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, plant_id uuid references plants(id), bed_id uuid references beds(id), product_text text, feed_type feed_type, dose numeric, method feed_method, fed_at timestamptz default now(), created_at timestamptz default now());
create table ph_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, plant_id uuid references plants(id), bed_id uuid references beds(id), input_ph numeric(4,2), runoff_ph numeric(4,2), input_ec numeric(6,2), runoff_ec numeric(6,2), ppm integer, measured_at timestamptz default now(), created_at timestamptz default now());
create table harvest_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, plant_id uuid not null references plants(id), harvested_at date default current_date, weight numeric, weight_unit text default 'lb', quality_score smallint, created_at timestamptz default now());
create table pest_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, plant_id uuid references plants(id), pest_type text not null, severity severity_level default 'low', resolved boolean default false, created_at timestamptz default now());
create table photos (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, plant_id uuid references plants(id), storage_path text not null, taken_at timestamptz default now(), created_at timestamptz default now());
create table ai_diagnoses (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, plant_id uuid references plants(id), likely_problem text, confidence numeric(4,3), severity severity_level, causes jsonb, actions jsonb, model text, created_at timestamptz default now());
create table tasks (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, plant_id uuid references plants(id), bed_id uuid references beds(id), title text not null, category task_category default 'other', priority task_priority default 'medium', status task_status default 'pending', due_date date, completed_at timestamptz, created_at timestamptz default now());
create table weather_data (id uuid primary key default gen_random_uuid(), garden_id uuid not null references gardens(id), observed_at timestamptz not null, temp_f numeric, condition text, raw jsonb, created_at timestamptz default now());
create table health_scores (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, garden_id uuid not null references gardens(id), score smallint check (score between 0 and 100), breakdown jsonb, for_date date default current_date, created_at timestamptz default now());
create table subscriptions (user_id uuid primary key references auth.users(id) on delete cascade, tier sub_tier default 'free', updated_at timestamptz default now());

-- Auto-create profile on signup
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'name','Gardener'));
  insert into subscriptions (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- RLS on everything
alter table profiles enable row level security;
alter table gardens enable row level security;
alter table beds enable row level security;
alter table plants enable row level security;
alter table water_logs enable row level security;
alter table feed_logs enable row level security;
alter table ph_logs enable row level security;
alter table harvest_logs enable row level security;
alter table pest_logs enable row level security;
alter table photos enable row level security;
alter table ai_diagnoses enable row level security;
alter table tasks enable row level security;
alter table health_scores enable row level security;
alter table subscriptions enable row level security;

create policy "profile_self" on profiles for all using (id = auth.uid());
do $$ declare t text; begin foreach t in array array['gardens','beds','plants','water_logs','feed_logs','ph_logs','harvest_logs','pest_logs','photos','ai_diagnoses','tasks','health_scores'] loop execute format('create policy "%1$s_own" on %1$s for all using (user_id = auth.uid()) with check (user_id = auth.uid());', t); end loop; end $$;
create policy "sub_read" on subscriptions for select using (user_id = auth.uid());

-- Storage
insert into storage.buckets (id, name, public) values ('plant-photos','plant-photos',false) on conflict do nothing;
