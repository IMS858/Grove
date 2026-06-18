create table gardens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Garden',
  lat double precision, lon double precision,
  zone text not null default '9b',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on gardens (user_id);

create table beds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  garden_id uuid not null references gardens(id) on delete cascade,
  name text not null, area_type area_type not null default 'raised_bed',
  rows smallint default 2, cols smallint default 8,
  pos_x real default 0, pos_y real default 0,
  width real default 100, height real default 100,
  sun_exposure sun_exposure, irrigation_zone text,
  height_in smallint, fill_depth_in smallint,
  color text, bottomless boolean default true,
  soil_volume_cuft numeric, brand text, model text,
  bed_shape text default 'rect',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on beds (garden_id);

create table plant_varieties (
  id uuid primary key default gen_random_uuid(),
  common_name text not null, variety text, species text, category text,
  sun_req sun_exposure, water_req text, soil_type text,
  days_to_harvest int, ideal_ph_low numeric(3,1), ideal_ph_high numeric(3,1),
  zone9b_notes text, is_public boolean not null default true,
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  garden_id uuid not null references gardens(id) on delete cascade,
  bed_id uuid references beds(id) on delete set null,
  variety_id uuid references plant_varieties(id) on delete set null,
  name text not null, species text,
  plant_date date, expected_harvest date,
  stage growth_stage not null default 'seedling',
  sun_req sun_exposure, water_req text, soil_type text,
  location_text text, cell_row smallint, cell_col smallint,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on plants (garden_id);
create index on plants (bed_id);
create index on plants (user_id);
