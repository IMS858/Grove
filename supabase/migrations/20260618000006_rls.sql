-- Enable RLS on all user tables
alter table profiles enable row level security;
alter table gardens enable row level security;
alter table beds enable row level security;
alter table plants enable row level security;
alter table photos enable row level security;
alter table water_logs enable row level security;
alter table feed_logs enable row level security;
alter table ph_logs enable row level security;
alter table harvest_logs enable row level security;
alter table pest_logs enable row level security;
alter table treatment_logs enable row level security;
alter table ai_diagnoses enable row level security;
alter table tasks enable row level security;
alter table weather_data enable row level security;
alter table health_scores enable row level security;
alter table subscriptions enable row level security;
alter table plant_varieties enable row level security;

-- Owner policies for user-scoped tables
do $$
declare t text;
begin
  foreach t in array array[
    'gardens','beds','plants','photos','water_logs','feed_logs','ph_logs',
    'harvest_logs','pest_logs','treatment_logs','ai_diagnoses','tasks','health_scores'
  ] loop
    execute format(
      'create policy "%1$s_sel" on %1$s for select using (user_id = auth.uid());
       create policy "%1$s_ins" on %1$s for insert with check (user_id = auth.uid());
       create policy "%1$s_upd" on %1$s for update using (user_id = auth.uid());
       create policy "%1$s_del" on %1$s for delete using (user_id = auth.uid());', t);
  end loop;
end $$;

create policy "profile_self" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "sub_read" on subscriptions for select using (user_id = auth.uid());
create policy "varieties_read" on plant_varieties for select using (is_public or owner_id = auth.uid());
create policy "varieties_write" on plant_varieties for insert with check (owner_id = auth.uid());

-- Storage
insert into storage.buckets (id, name, public) values ('plant-photos','plant-photos', false) on conflict do nothing;
create policy "photos_read" on storage.objects for select using (bucket_id = 'plant-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos_write" on storage.objects for insert with check (bucket_id = 'plant-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos_del" on storage.objects for delete using (bucket_id = 'plant-photos' and (storage.foldername(name))[1] = auth.uid()::text);
