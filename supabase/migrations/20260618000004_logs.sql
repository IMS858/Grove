create table photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid references plants(id) on delete cascade,
  bed_id uuid references beds(id) on delete set null,
  storage_path text not null,
  taken_at timestamptz not null default now(),
  season text, caption text,
  created_at timestamptz not null default now()
);
create index on photos (plant_id, taken_at desc);

create table water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid references plants(id) on delete cascade,
  bed_id uuid references beds(id) on delete cascade,
  watered_at timestamptz not null default now(),
  amount numeric, unit text default 'gal',
  source water_source default 'hose', notes text,
  created_at timestamptz not null default now()
);

create table feed_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid references plants(id) on delete cascade,
  bed_id uuid references beds(id) on delete cascade,
  product_text text, feed_type feed_type,
  dose numeric, unit text, method feed_method,
  fed_at timestamptz not null default now(), notes text,
  created_at timestamptz not null default now()
);

create table ph_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid references plants(id) on delete cascade,
  bed_id uuid references beds(id) on delete cascade,
  input_ph numeric(4,2), runoff_ph numeric(4,2),
  input_ec numeric(6,2), runoff_ec numeric(6,2), ppm integer,
  measured_at timestamptz not null default now(), notes text,
  created_at timestamptz not null default now()
);

create table harvest_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid not null references plants(id) on delete cascade,
  harvested_at date not null default current_date,
  quantity numeric, quantity_unit text default 'count',
  weight numeric, weight_unit text default 'lb',
  quality_score smallint check (quality_score between 1 and 5),
  flavor_notes text, created_at timestamptz not null default now()
);

create table pest_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid references plants(id) on delete cascade,
  bed_id uuid references beds(id) on delete cascade,
  pest_type text not null, severity severity_level not null default 'low',
  photo_id uuid references photos(id) on delete set null,
  observed_at timestamptz not null default now(),
  resolved boolean not null default false, notes text,
  created_at timestamptz not null default now()
);

create table treatment_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pest_log_id uuid references pest_logs(id) on delete cascade,
  plant_id uuid references plants(id) on delete cascade,
  treatment text not null, applied_at timestamptz not null default now(),
  outcome text, notes text, created_at timestamptz not null default now()
);

create table ai_diagnoses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plant_id uuid references plants(id) on delete set null,
  photo_id uuid references photos(id) on delete set null,
  source diagnosis_source not null default 'ai_photo',
  likely_problem text, confidence numeric(4,3),
  severity severity_level, priority task_priority,
  causes jsonb, actions jsonb, raw_result jsonb,
  model text, created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  garden_id uuid references gardens(id) on delete cascade,
  plant_id uuid references plants(id) on delete cascade,
  bed_id uuid references beds(id) on delete cascade,
  title text not null, category task_category not null default 'other',
  priority task_priority not null default 'medium',
  status task_status not null default 'pending',
  due_date date, est_minutes smallint,
  source text default 'engine', completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on tasks (user_id, due_date, status);

create table weather_data (
  id uuid primary key default gen_random_uuid(),
  garden_id uuid not null references gardens(id) on delete cascade,
  observed_at timestamptz not null, type text not null,
  temp_f numeric, temp_min_f numeric, temp_max_f numeric,
  humidity numeric, wind_mph numeric, precip_prob numeric,
  condition text, raw jsonb,
  created_at timestamptz not null default now()
);

create table health_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  garden_id uuid not null references gardens(id) on delete cascade,
  score smallint not null check (score between 0 and 100),
  breakdown jsonb, for_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (garden_id, for_date)
);

create table subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier sub_tier not null default 'free',
  store text, expires_at timestamptz,
  updated_at timestamptz not null default now()
);
