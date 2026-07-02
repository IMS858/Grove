-- ============================================================
-- 011_seed_user_beds.sql
-- Seeds 14 × Vego 2'×8' · 17" tall · Pearl White classic beds
-- (bottomless, ~15" soil/mulch fill, ~2" freeboard)
--
-- USAGE: set your auth user id + garden id, then run.
--   psql ... -v user_id="'YOUR-AUTH-UID'" -v garden_id="'YOUR-GARDEN-UUID'" -f 011_seed_user_beds.sql
-- (If you have no garden yet, the optional block at the bottom creates one.)
-- ============================================================

-- --- 1. Extend beds with physical attributes the app needs --------------
-- Height drives root-depth crop suggestions; color drives heat/albedo logic
-- (white Aluzinc reflects heat — relevant for the 9b summer task engine).
alter table beds add column if not exists height_in       smallint;
alter table beds add column if not exists fill_depth_in    smallint;
alter table beds add column if not exists color            text;
alter table beds add column if not exists bottomless       boolean default true;
alter table beds add column if not exists soil_volume_cuft numeric;
alter table beds add column if not exists brand            text;
alter table beds add column if not exists model            text;

-- --- 2. Insert the 14 beds ---------------------------------------------
-- Grid: 2 (across 2-ft width) × 8 (along 8-ft length) = 16 one-ft cells.
-- Soil volume per bed: 2ft × 8ft × 15in = 16 sq ft × 1.25 ft = 20.0 cu ft.
-- Canvas: two columns of 7 with a central path (30 px/ft, beds 60×240 px).
insert into beds (
  user_id, garden_id, name, area_type, rows, cols,
  pos_x, pos_y, width, height, sun_exposure, irrigation_zone,
  height_in, fill_depth_in, color, bottomless, soil_volume_cuft, brand, model
)
select
  :user_id::uuid,
  :garden_id::uuid,
  'Bed ' || k,                                   -- name
  'raised_bed',
  2, 8,                                          -- rows × cols (16 cells)
  ((k - 1) % 2) * 90,                            -- pos_x: 2 columns at 0 / 90
  ((k - 1) / 2) * 270,                           -- pos_y: 7 rows, 270 apart
  60, 240,                                       -- canvas size (2ft × 8ft)
  'full_sun',                                    -- edit per bed later
  'Zone ' || (((k - 1) / 7) + 1),                -- 2 irrigation zones (7 beds each)
  17,                                            -- height_in
  15,                                            -- fill_depth_in
  'pearl_white',
  true,
  20.0,                                          -- soil_volume_cuft
  'Vego Garden',
  '2x8 17in Classic'
from generate_series(1, 14) as k;

-- --- 3. (Optional) create the garden first if you don't have one -------
-- Uncomment, set your user id, run this block, then use the returned id above.
--
-- insert into gardens (user_id, name, zone)
-- values (:user_id::uuid, 'Backyard 9b', '9b')
-- returning id;

-- --- Quick totals for reference ----------------------------------------
--   Growing space : 14 beds × 16 sq ft = 224 one-foot planting cells
--   Soil to fill  : 14 × 20.0 = 280 cu ft  ≈ 10.4 cubic yards
