// ============================================================
// data/seed9b.ts — Zone 9b (Southern California) knowledge base.
// The task engine and coach both read from this. Curated, not exhaustive;
// extend freely. Months are 1=Jan..12=Dec.
// ============================================================

export type CropCat = 'leafy' | 'fruiting_veg' | 'root' | 'herb' | 'citrus' | 'stone_fruit' | 'berry' | 'flower' | 'brassica' | 'legume';

export interface Variety {
  commonName: string; variety?: string; cropCat: CropCat;
  sun: 'full_sun' | 'part_sun' | 'part_shade';
  water: 'low' | 'medium' | 'high';
  daysToHarvest?: number;
  sowMonths: number[];          // good months to start in 9b
  notes: string;                // 9b-specific
}

export const VARIETIES_9B: Variety[] = [
  { commonName: 'Tomato', variety: 'Sungold', cropCat: 'fruiting_veg', sun: 'full_sun', water: 'high', daysToHarvest: 65, sowMonths: [2, 3], notes: 'Transplant after Feb; mulch heavily for summer heat. Afternoon shade cloth >95°F prevents blossom drop.' },
  { commonName: 'Tomato', variety: 'Heatmaster', cropCat: 'fruiting_veg', sun: 'full_sun', water: 'high', daysToHarvest: 75, sowMonths: [2, 3, 8], notes: 'Heat-set variety; can do a fall crop sown Aug for Oct–Nov harvest.' },
  { commonName: 'Pepper', variety: 'Shishito', cropCat: 'fruiting_veg', sun: 'full_sun', water: 'medium', daysToHarvest: 60, sowMonths: [3, 4], notes: 'Loves 9b summers; keeps producing into fall.' },
  { commonName: 'Lettuce', variety: 'Jericho Romaine', cropCat: 'leafy', sun: 'part_shade', water: 'high', daysToHarvest: 55, sowMonths: [1, 2, 10, 11], notes: 'Bolts in heat — grow in cool season or PM shade. Jericho is heat-tolerant.' },
  { commonName: 'Kale', variety: 'Lacinato', cropCat: 'brassica', sun: 'full_sun', water: 'medium', daysToHarvest: 60, sowMonths: [9, 10, 11], notes: 'Best as a fall/winter crop in 9b; sweetens after cool nights.' },
  { commonName: 'Carrot', variety: 'Nantes', cropCat: 'root', sun: 'full_sun', water: 'medium', daysToHarvest: 70, sowMonths: [9, 10, 11, 1], notes: 'Loves the deep 17" beds; cool-season sowing avoids forking in heat.' },
  { commonName: 'Basil', variety: 'Genovese', cropCat: 'herb', sun: 'full_sun', water: 'medium', daysToHarvest: 40, sowMonths: [3, 4, 5], notes: 'Frost-tender; thrives all summer. Pinch flowers to extend.' },
  { commonName: 'Strawberry', variety: 'Albion', cropCat: 'berry', sun: 'full_sun', water: 'high', daysToHarvest: 0, sowMonths: [10, 11], notes: 'Day-neutral; plant bare-root in fall for spring–summer fruit. Watch spider mites in heat.' },
  { commonName: 'Blueberry', variety: 'Southern Highbush (Sunshine Blue)', cropCat: 'berry', sun: 'full_sun', water: 'high', sowMonths: [11, 12, 1], notes: 'Needs acidic soil (pH 4.5–5.5) — amend with sulfur/peat; 9b needs low-chill types.' },
  { commonName: 'Bush bean', variety: 'Provider', cropCat: 'legume', sun: 'full_sun', water: 'medium', daysToHarvest: 55, sowMonths: [3, 4, 8], notes: 'Direct sow; fixes nitrogen — good after heavy feeders like tomatoes.' },
  { commonName: 'Zucchini', variety: 'Black Beauty', cropCat: 'fruiting_veg', sun: 'full_sun', water: 'high', daysToHarvest: 50, sowMonths: [3, 4, 8], notes: 'Watch powdery mildew in late summer; water at soil level.' },
];

// Feeding windows by crop category. months = when to feed; intervalDays = fallback cadence.
export interface FeedWindow { cropCat: CropCat; months?: number[]; intervalDays?: number; note: string; }
export const FEED_WINDOWS_9B: FeedWindow[] = [
  { cropCat: 'citrus', months: [2, 5, 8], note: '9b citrus: feed ~Feb, May, Aug (Presidents/Memorial/Labor Day rule of thumb) with high-nitrogen citrus food.' },
  { cropCat: 'stone_fruit', months: [3, 6], note: 'Light feed at bud-break (Mar) and after fruit set (Jun); avoid late N that delays dormancy.' },
  { cropCat: 'berry', intervalDays: 21, note: 'Blueberries: acidic fertilizer; strawberries: light balanced feed every ~3 weeks while fruiting.' },
  { cropCat: 'fruiting_veg', intervalDays: 14, note: 'Heavy feeders; balanced feed every 2 weeks, shift to lower-N/higher-K at fruiting.' },
  { cropCat: 'leafy', intervalDays: 21, note: 'Nitrogen-forward feed every ~3 weeks for tender leaves.' },
];

// 12-month seasonal calendar (highlights). category drives task type.
export interface CalendarItem { month: number; category: 'plant' | 'harvest' | 'feed' | 'prune' | 'spray' | 'soil'; crop?: string; action: string; }
export const SEASONAL_CALENDAR_9B: CalendarItem[] = [
  { month: 1, category: 'prune', crop: 'stone_fruit', action: 'Finish dormant pruning of peaches/plums/apricots before bud swell.' },
  { month: 1, category: 'spray', crop: 'stone_fruit', action: 'Dormant oil + copper for peach leaf curl (before buds open).' },
  { month: 2, category: 'feed', crop: 'citrus', action: 'First citrus feeding of the year.' },
  { month: 2, category: 'plant', crop: 'tomato', action: 'Start warm-season seeds indoors; transplant tomatoes late Feb–Mar.' },
  { month: 3, category: 'plant', action: 'Direct sow beans, squash, cucumbers, basil once soil warms.' },
  { month: 4, category: 'soil', action: 'Top-dress beds with compost; refresh mulch before heat.' },
  { month: 5, category: 'feed', crop: 'citrus', action: 'Second citrus feeding.' },
  { month: 6, category: 'harvest', action: 'Peak stone-fruit + early tomato harvest; thin excess fruit on trees.' },
  { month: 7, category: 'spray', action: 'Scout for spider mites/whitefly in heat; hose undersides, treat early.' },
  { month: 8, category: 'feed', crop: 'citrus', action: 'Third (final) citrus feeding.' },
  { month: 8, category: 'plant', action: 'Sow fall tomatoes, beans, and start brassica seeds for transplant.' },
  { month: 9, category: 'plant', action: 'Transplant kale/broccoli; sow carrots, lettuce, beets for cool season.' },
  { month: 10, category: 'plant', crop: 'strawberry', action: 'Plant bare-root strawberries; sow more cool-season greens.' },
  { month: 11, category: 'plant', crop: 'blueberry', action: 'Plant bare-root blueberries/deciduous fruit; cool-season crops thriving.' },
  { month: 12, category: 'prune', crop: 'stone_fruit', action: 'Begin dormant pruning; apply first peach-leaf-curl spray.' },
];

export function inSeasonNow(month: number): Variety[] {
  return VARIETIES_9B.filter(v => v.sowMonths.includes(month));
}
export function calendarForMonth(month: number): CalendarItem[] {
  return SEASONAL_CALENDAR_9B.filter(c => c.month === month);
}
export function feedDueThisMonth(cropCat: CropCat, month: number): FeedWindow | undefined {
  return FEED_WINDOWS_9B.find(f => f.cropCat === cropCat && f.months?.includes(month));
}
