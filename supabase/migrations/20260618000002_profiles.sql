create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text, avatar_path text,
  unit_system unit_system not null default 'imperial',
  theme theme_pref not null default 'system',
  zone text not null default '9b',
  lat double precision, lon double precision,
  grow_types text[] not null default '{}',
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
