-- ============================================
-- Grove: cross-device sync table
-- Stores each user's full garden state as JSON.
-- Survives refresh, re-login, and syncs across devices.
-- ============================================

create table if not exists garden_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security: each user only sees/edits their own row
alter table garden_state enable row level security;

drop policy if exists "garden_state_own" on garden_state;
create policy "garden_state_own" on garden_state
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Auto-bump updated_at on every write
create or replace function touch_garden_state()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists garden_state_touch on garden_state;
create trigger garden_state_touch
  before update on garden_state
  for each row execute function touch_garden_state();
