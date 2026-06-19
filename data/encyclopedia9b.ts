// ============================================================
// data/encyclopedia9b.ts — the full 9B GrowOS plant knowledge base.
// Every plant your user might grow in Zone 9b, treated as a teacher
// would: how to grow it, why to grow it, what it heals, what it feeds,
// who it helps, who it hurts, and every 9b-specific gotcha.
//
// This is the content moat. Extend it season by season.
// Run:  node --experimental-strip-types encyclopedia9b.ts
// ============================================================

export type CropCat = 'fruiting_veg' | 'leafy' | 'root' | 'brassica' | 'legume' | 'herb' | 'citrus' | 'stone_fruit' | 'berry' | 'flower' | 'allium' | 'cucurbit' | 'nightshade';
export type Sun = 'full_sun' | 'part_sun' | 'part_shade' | 'full_shade';
export type Water = 'low' | 'medium' | 'high';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface NutritionFact { perServing: string; calories?: number; highlights: string[]; }
export interface MedicinalUse { use: string; evidence: 'traditional' | 'emerging' | 'well-studied'; note: string; }
export interface CompanionInfo { goodWith: string[]; badWith: string[]; why: string; }
export interface PestRisk { pest: string; likelihood: 'low' | 'moderate' | 'high'; prevention: string; }

export interface PlantProfile {
  // Identity
  commonName: string;
  variety?: string;
  species: string;
  family: string;
  cropCat: CropCat;

  // Growing
  sun: Sun;
  water: Water;
  difficulty: Difficulty;
  soilPh: [number, number];           // ideal range
  soilType: string;
  daysToHarvest?: number;
  spacing: { inRow: number; betweenRows: number; unit: 'in' };  // for sq-ft beds
  sowMonths: number[];
  harvestMonths: number[];
  growingTips: string[];

  // 9b specifics
  zone9b: {
    bestSeason: string;
    heatStrategy: string;
    frostRisk: string;
    microclimate: string;
    commonMistakes: string[];
  };

  // Pros & cons
  pros: string[];
  cons: string[];

  // Nutrition & health
  nutrition: NutritionFact;
  healthBenefits: string[];
  medicinal: MedicinalUse[];

  // Culinary
  culinaryUses: string[];
  flavorProfile: string;
  storage: string;

  // Companions & pests
  companions: CompanionInfo;
  pestRisks: PestRisk[];

  // Feeding
  feedingNotes: string;
}

// ============================================================
// THE ENCYCLOPEDIA
// ============================================================
export const ENCYCLOPEDIA: PlantProfile[] = [

  // ---- TOMATOES ----
  {
    commonName: 'Tomato', variety: 'Sungold', species: 'Solanum lycopersicum', family: 'Solanaceae', cropCat: 'fruiting_veg',
    sun: 'full_sun', water: 'high', difficulty: 'beginner', soilPh: [6.0, 6.8], soilType: 'Rich loam with compost',
    daysToHarvest: 65, spacing: { inRow: 24, betweenRows: 36, unit: 'in' }, sowMonths: [2, 3], harvestMonths: [5, 6, 7, 8],
    growingTips: [
      'Start seeds indoors 6–8 weeks before last frost or buy transplants.',
      'Bury stem deep (2/3) at transplant — roots form along buried stem.',
      'Cage or stake immediately; Sungold is indeterminate and will reach 6–8 ft.',
      'Prune suckers below first flower cluster for earlier, larger fruit.',
      'Mulch 3–4" to retain moisture and prevent soil splash (blight vector).',
    ],
    zone9b: {
      bestSeason: 'Spring transplant Feb–Mar for May–Aug harvest; possible fall crop Aug sow.',
      heatStrategy: 'Shade cloth (30–40%) when temps exceed 95°F — prevents blossom drop. White Vego beds help reflect heat.',
      frostRisk: 'Minimal in 9b; cover only on rare frost nights (Dec–Jan).',
      microclimate: 'Coastal 9b can plant 2 weeks earlier; inland valleys need shade cloth sooner.',
      commonMistakes: ['Overwatering (invites root rot)', 'No shade cloth in July heat → blossom drop', 'Planting too late (May) → fruiting in peak heat'],
    },
    pros: ['Incredible sweetness — best cherry tomato', 'Prolific producer (100+ fruits/plant)', 'Early harvest', 'Kids love them', 'Crack-resistant'],
    cons: ['Indeterminate = needs tall support', 'Thin skin splits if watering is inconsistent', 'Not great for sauce (too small)', 'Prone to hornworms'],
    nutrition: { perServing: '1 cup cherry', calories: 27, highlights: ['High lycopene (antioxidant)', 'Vitamin C', 'Vitamin A', 'Potassium'] },
    healthBenefits: [
      'Lycopene linked to reduced risk of heart disease and certain cancers.',
      'High in vitamin C — supports immune function.',
      'Beta-carotene supports eye health.',
      'Low calorie, high fiber — supports weight management.',
    ],
    medicinal: [
      { use: 'Cardiovascular support', evidence: 'well-studied', note: 'Lycopene reduces LDL oxidation; bioavailability increases when cooked with fat.' },
      { use: 'Skin UV protection', evidence: 'emerging', note: 'Regular tomato consumption may reduce sunburn sensitivity over time.' },
    ],
    culinaryUses: ['Fresh eating / snacking', 'Salads', 'Roasted on pasta', 'Quick sauces', 'Dehydrated as candy tomatoes'],
    flavorProfile: 'Intensely sweet with tropical undertones; low acid.',
    storage: 'Counter at room temp (never refrigerate). Use within 3–5 days of harvest.',
    companions: { goodWith: ['Basil', 'Carrot', 'Marigold', 'Parsley', 'Asparagus'], badWith: ['Fennel', 'Brassicas', 'Corn', 'Dill (mature)'], why: 'Basil repels aphids/whitefly and may improve flavor. Marigolds deter nematodes. Fennel inhibits growth.' },
    pestRisks: [
      { pest: 'Tomato hornworm', likelihood: 'moderate', prevention: 'Hand-pick; plant dill to attract parasitic wasps; BT spray.' },
      { pest: 'Whitefly', likelihood: 'high', prevention: 'Yellow sticky traps; insecticidal soap; avoid over-fertilizing N.' },
      { pest: 'Blossom end rot', likelihood: 'moderate', prevention: 'Not a pest — calcium uptake issue. Consistent watering fixes it; don\'t over-lime.' },
    ],
    feedingNotes: 'Heavy feeder. Balanced feed at transplant; switch to low-N, high-K (like 2-3-4) once flowering. Feed every 2 weeks.',
  },

  {
    commonName: 'Tomato', variety: 'Cherokee Purple', species: 'Solanum lycopersicum', family: 'Solanaceae', cropCat: 'fruiting_veg',
    sun: 'full_sun', water: 'high', difficulty: 'intermediate', soilPh: [6.0, 6.8], soilType: 'Rich, well-drained',
    daysToHarvest: 80, spacing: { inRow: 24, betweenRows: 36, unit: 'in' }, sowMonths: [2, 3], harvestMonths: [6, 7, 8],
    growingTips: [
      'Heirloom — save seeds for next year.',
      'Needs strong caging; heavy fruit on long vines.',
      'Water deeply and consistently — prone to cracking.',
      'Harvest when shoulders are dark and fruit gives slightly to pressure.',
    ],
    zone9b: {
      bestSeason: 'Transplant Mar for Jun–Aug harvest.',
      heatStrategy: 'Shade cloth essential; thin skin + dark color absorbs heat → sunscald if exposed.',
      frostRisk: 'Low.',
      microclimate: 'Performs better in coastal 9b where nights cool down.',
      commonMistakes: ['Letting fruit sunscald', 'Inconsistent watering → cracking', 'Harvesting too late (goes mealy)'],
    },
    pros: ['Exceptional complex flavor — smoky, sweet, rich', 'Beautiful slicing tomato', 'Heirloom / seed-savable', 'Large fruit (10–16 oz)'],
    cons: ['Thin skin — cracks easily', 'Short shelf life', 'Lower yield than hybrids', 'Ugly but delicious'],
    nutrition: { perServing: '1 medium tomato', calories: 35, highlights: ['Anthocyanins (dark pigment)', 'Lycopene', 'Vitamin C'] },
    healthBenefits: ['Anthocyanins provide additional antioxidant activity beyond red tomatoes.', 'Same lycopene benefits as red varieties.'],
    medicinal: [{ use: 'Antioxidant support', evidence: 'emerging', note: 'Dark tomato varieties show higher total antioxidant capacity in studies.' }],
    culinaryUses: ['Slicing for sandwiches/burgers', 'Caprese salads', 'Fresh salsas', 'Heirloom tomato tasting plates'],
    flavorProfile: 'Rich, smoky-sweet, winey, complex. Low acid with deep umami.',
    storage: 'Counter; use within 2–3 days — does not hold.',
    companions: { goodWith: ['Basil', 'Carrot', 'Marigold'], badWith: ['Fennel', 'Brassicas'], why: 'Same as other tomatoes.' },
    pestRisks: [
      { pest: 'Hornworm', likelihood: 'moderate', prevention: 'Same as Sungold.' },
      { pest: 'Cracking', likelihood: 'high', prevention: 'Consistent, even moisture — drip is essential.' },
    ],
    feedingNotes: 'Same as other tomatoes; slightly heavier calcium need for large fruit.',
  },

  // ---- PEPPERS ----
  {
    commonName: 'Pepper', variety: 'Shishito', species: 'Capsicum annuum', family: 'Solanaceae', cropCat: 'fruiting_veg',
    sun: 'full_sun', water: 'medium', difficulty: 'beginner', soilPh: [6.0, 6.8], soilType: 'Well-drained, fertile',
    daysToHarvest: 60, spacing: { inRow: 18, betweenRows: 24, unit: 'in' }, sowMonths: [3, 4], harvestMonths: [6, 7, 8, 9, 10],
    growingTips: [
      'Harvest when 3–4" long and bright green; don\'t wait for red.',
      'The more you pick, the more it produces.',
      'Loves heat — no shade cloth needed until 105°F+.',
      'Light, frequent feeding beats heavy doses.',
    ],
    zone9b: {
      bestSeason: 'Transplant Apr; produces Jun–Nov (one of the longest seasons in 9b).',
      heatStrategy: 'Thrives in heat; one of the best 9b summer performers.',
      frostRisk: 'Frost-tender; pull before first frost or cover.',
      microclimate: 'Inland 9b valleys = peak performance.',
      commonMistakes: ['Over-watering (peppers like to dry slightly between)', 'Letting fruit turn red (stops new fruit set)'],
    },
    pros: ['Prolific — dozens per plant per week', 'Mild (1 in 10 is spicy — the fun surprise)', 'Perfect for blistering/grilling', 'Long season', 'Compact plant'],
    cons: ['Mild heat may bore spice lovers', 'Thin walls — not for stuffing', 'Aphid magnet early season'],
    nutrition: { perServing: '1 cup', calories: 33, highlights: ['Very high vitamin C', 'Vitamin A', 'Vitamin B6', 'Low calorie'] },
    healthBenefits: [
      'One cup delivers 2x daily vitamin C.',
      'Capsaicin (in the spicy ones) supports metabolism and pain relief.',
      'Anti-inflammatory compounds.',
    ],
    medicinal: [{ use: 'Vitamin C supplementation', evidence: 'well-studied', note: 'Peppers are among the highest vitamin C foods per calorie.' }],
    culinaryUses: ['Blistered in sesame oil (izakaya style)', 'Tempura', 'Grilled as a side', 'Stir-fried', 'Pickled'],
    flavorProfile: 'Mild, slightly sweet, thin-skinned, delicate. Occasional surprise heat.',
    storage: 'Refrigerator 1 week; best eaten fresh.',
    companions: { goodWith: ['Tomato', 'Basil', 'Carrot', 'Spinach'], badWith: ['Fennel', 'Kohlrabi'], why: 'Peppers and tomatoes share sun/feed needs. Fennel inhibits.' },
    pestRisks: [
      { pest: 'Aphids', likelihood: 'high', prevention: 'Blast with water; ladybugs; neem early.' },
      { pest: 'Pepper weevil', likelihood: 'low', prevention: 'Rotate; remove dropped fruit.' },
    ],
    feedingNotes: 'Medium feeder. Balanced at transplant; light feed every 3 weeks. Avoid excess nitrogen — makes leaves, not fruit.',
  },

  // ---- LEAFY GREENS ----
  {
    commonName: 'Lettuce', variety: 'Jericho Romaine', species: 'Lactuca sativa', family: 'Asteraceae', cropCat: 'leafy',
    sun: 'part_shade', water: 'high', difficulty: 'beginner', soilPh: [6.0, 7.0], soilType: 'Loose, moisture-retentive',
    daysToHarvest: 55, spacing: { inRow: 8, betweenRows: 12, unit: 'in' }, sowMonths: [1, 2, 10, 11, 12], harvestMonths: [11, 12, 1, 2, 3, 4],
    growingTips: [
      'Direct sow — lettuce hates transplant shock.',
      'Cut-and-come-again: harvest outer leaves, let center grow.',
      'Succession sow every 2–3 weeks for continuous harvest.',
      'Keep soil consistently moist; mulch to cool roots.',
    ],
    zone9b: {
      bestSeason: 'Cool season: Oct–Mar. Summer lettuce bolts even in shade.',
      heatStrategy: 'PM shade mandatory; shade cloth (50–60%) extends shoulder season. Jericho is the most heat-tolerant romaine.',
      frostRisk: 'Handles light frost; actually sweetens after cold nights.',
      microclimate: 'Coastal 9b can grow almost year-round with shade.',
      commonMistakes: ['Planting in summer without shade', 'Letting soil dry out (bitter, bolts)', 'Sowing too thickly'],
    },
    pros: ['Fast — seed to salad in 55 days', 'Cut-and-come-again extends harvest', 'Dense planting in small beds', 'Cool-season superstar fills the winter gap'],
    cons: ['Bolts in heat', 'Slug/snail magnet', 'Needs consistent moisture', 'Short harvest window per planting'],
    nutrition: { perServing: '2 cups chopped', calories: 16, highlights: ['Vitamin K (bone health)', 'Folate', 'Vitamin A', 'Hydrating (95% water)'] },
    healthBenefits: ['High vitamin K supports bone density.', 'Folate essential for cell repair.', 'Hydration support — one of the most water-rich foods.'],
    medicinal: [{ use: 'Mild sedative / sleep aid', evidence: 'traditional', note: 'Lactucarium (lettuce sap) has a long folk history as a mild calming agent; modern evidence is limited.' }],
    culinaryUses: ['Salads', 'Lettuce wraps', 'Grilled romaine', 'Juicing', 'Caesar salad base'],
    flavorProfile: 'Crisp, mild, slightly sweet. Jericho has thicker ribs and holds dressing well.',
    storage: 'Refrigerator in a damp towel / sealed bag, 5–7 days.',
    companions: { goodWith: ['Carrot', 'Radish', 'Strawberry', 'Chives', 'Onion'], badWith: ['Celery', 'Parsley (competition)'], why: 'Shallow-rooted lettuce interplants well with deep-rooted carrots. Chives/onions deter slugs.' },
    pestRisks: [
      { pest: 'Slugs/snails', likelihood: 'high', prevention: 'Iron phosphate bait; copper tape around bed; evening hand-pick.' },
      { pest: 'Aphids', likelihood: 'moderate', prevention: 'Blast with water; row cover.' },
    ],
    feedingNotes: 'Light feeder. Nitrogen-forward (fish emulsion) every 3 weeks. Overfeeding makes leaves tough.',
  },

  {
    commonName: 'Kale', variety: 'Lacinato (Dinosaur)', species: 'Brassica oleracea var. sabellica', family: 'Brassicaceae', cropCat: 'brassica',
    sun: 'full_sun', water: 'medium', difficulty: 'beginner', soilPh: [6.0, 7.5], soilType: 'Rich, well-drained',
    daysToHarvest: 60, spacing: { inRow: 18, betweenRows: 24, unit: 'in' }, sowMonths: [9, 10, 11], harvestMonths: [11, 12, 1, 2, 3],
    growingTips: [
      'Harvest lowest leaves first; always leave the growing tip.',
      'Sweetens dramatically after a few cool nights.',
      'Can produce for 6+ months in mild 9b winters.',
      'Interplant with alliums to confuse cabbage moth.',
    ],
    zone9b: {
      bestSeason: 'Fall/winter — sow Sep–Nov for Nov–Mar harvest.',
      heatStrategy: 'Don\'t bother in summer; it bolts and tastes bitter.',
      frostRisk: 'Loves frost; one of the most cold-hardy vegetables.',
      microclimate: 'Inland 9b with cooler nights produces sweeter leaves.',
      commonMistakes: ['Growing in summer heat', 'Not harvesting enough (gets woody)', 'Ignoring aphids in fall'],
    },
    pros: ['Extremely nutritious — superfood status', 'Produces for months', 'Frost-proof', 'Beautiful in the garden', 'Handles neglect'],
    cons: ['Aphid magnet in fall', 'Cabbage worms', 'Tough texture raw (needs massage or cooking)', 'Takes up space'],
    nutrition: { perServing: '1 cup chopped', calories: 33, highlights: ['#1 vitamin K source', 'Vitamin A', 'Vitamin C', 'Calcium', 'Iron', 'Antioxidants (kaempferol, quercetin)'] },
    healthBenefits: [
      'One cup provides 7x daily vitamin K — essential for blood clotting and bone health.',
      'Sulforaphane and indole-3-carbinol linked to cancer-protective effects.',
      'High antioxidant load (kaempferol, quercetin) — anti-inflammatory.',
      'One of the best plant sources of calcium and iron.',
    ],
    medicinal: [
      { use: 'Anti-inflammatory', evidence: 'well-studied', note: 'Brassica glucosinolates produce sulforaphane, shown to reduce inflammatory markers.' },
      { use: 'Cholesterol reduction', evidence: 'emerging', note: 'Steamed kale binds bile acids more effectively than raw, potentially lowering cholesterol.' },
    ],
    culinaryUses: ['Massaged raw salads (with lemon + olive oil)', 'Kale chips', 'Soups / minestrone', 'Sautéed with garlic', 'Smoothies', 'Pesto'],
    flavorProfile: 'Lacinato is nuttier, sweeter, and less bitter than curly kale. Tender after frost.',
    storage: 'Refrigerator 5–7 days; freezes well (blanch first).',
    companions: { goodWith: ['Onion', 'Garlic', 'Beet', 'Celery', 'Dill', 'Nasturtium'], badWith: ['Strawberry', 'Tomato', 'Pole bean'], why: 'Alliums confuse cabbage moths; nasturtiums act as a trap crop for aphids.' },
    pestRisks: [
      { pest: 'Cabbage worm / cabbage moth', likelihood: 'high', prevention: 'BT spray; row cover; hand-pick; interplant with alliums.' },
      { pest: 'Aphids', likelihood: 'high', prevention: 'Strong water blast; ladybugs; neem.' },
    ],
    feedingNotes: 'Medium feeder. Nitrogen-forward; feed every 3–4 weeks with compost tea or fish emulsion.',
  },

  // ---- HERBS ----
  {
    commonName: 'Basil', variety: 'Genovese', species: 'Ocimum basilicum', family: 'Lamiaceae', cropCat: 'herb',
    sun: 'full_sun', water: 'medium', difficulty: 'beginner', soilPh: [6.0, 7.0], soilType: 'Well-drained, fertile',
    daysToHarvest: 40, spacing: { inRow: 12, betweenRows: 18, unit: 'in' }, sowMonths: [3, 4, 5, 6], harvestMonths: [5, 6, 7, 8, 9, 10],
    growingTips: [
      'Pinch flower buds the moment they appear — extends leaf production weeks.',
      'Harvest from the top down, cutting just above a leaf pair (promotes branching).',
      'Water at the base; wet leaves invite downy mildew.',
      'Succession sow every 4 weeks for continuous fresh basil.',
    ],
    zone9b: {
      bestSeason: 'Spring–fall; dies at first frost but that\'s not until Dec–Jan in 9b.',
      heatStrategy: 'Loves heat — one of the few herbs that thrives in 9b summers.',
      frostRisk: 'Very frost-tender; cover or bring indoors below 40°F.',
      microclimate: 'Coastal fog can trigger downy mildew; inland = better basil.',
      commonMistakes: ['Letting it flower (leaves turn bitter)', 'Over-watering', 'Not harvesting enough (gets leggy)'],
    },
    pros: ['Fast-growing', 'Aromatic pest deterrent for companion planting', 'Culinary essential', 'Easy from seed', 'Thrives in heat'],
    cons: ['Annual — dies with frost', 'Downy mildew in humid/coastal conditions', 'Bolts if stressed'],
    nutrition: { perServing: '2 tbsp fresh', calories: 1, highlights: ['Vitamin K', 'Manganese', 'Essential oils (linalool, eugenol)'] },
    healthBenefits: ['Anti-inflammatory essential oils.', 'Antibacterial properties (eugenol).', 'Stress-reducing aroma (adaptogenic tradition).'],
    medicinal: [
      { use: 'Digestive aid', evidence: 'traditional', note: 'Basil tea used in Ayurveda for bloating and nausea.' },
      { use: 'Antibacterial', evidence: 'emerging', note: 'Eugenol and linalool show antibacterial activity in lab studies.' },
      { use: 'Stress relief / adaptogen', evidence: 'traditional', note: 'Holy basil (Tulsi) is the adaptogenic relative; Genovese has milder calming effect.' },
    ],
    culinaryUses: ['Fresh on pizza and pasta', 'Pesto (classic Genovese)', 'Caprese salad', 'Thai / Vietnamese dishes', 'Infused oils and vinegars', 'Cocktails (basil smash)'],
    flavorProfile: 'Sweet, peppery, slightly anise. Best fresh; loses potency when cooked long.',
    storage: 'Stem-in water on counter (like flowers); never refrigerate. Freezes well as pesto or in olive oil cubes.',
    companions: { goodWith: ['Tomato', 'Pepper', 'Oregano', 'Marigold'], badWith: ['Sage', 'Rue', 'Common thyme (competes)'], why: 'Basil repels aphids and whitefly; may improve tomato flavor (anecdotal but widely reported).' },
    pestRisks: [
      { pest: 'Downy mildew', likelihood: 'moderate', prevention: 'Good airflow; avoid overhead water; grow resistant varieties (Prospera).' },
      { pest: 'Japanese beetle', likelihood: 'low', prevention: 'Hand-pick; neem.' },
    ],
    feedingNotes: 'Light feeder. Compost at planting is enough; over-feeding reduces essential oil concentration (less flavor).',
  },

  {
    commonName: 'Rosemary', species: 'Salvia rosmarinus', family: 'Lamiaceae', cropCat: 'herb',
    sun: 'full_sun', water: 'low', difficulty: 'beginner', soilPh: [6.0, 7.5], soilType: 'Sandy, well-drained — hates wet feet',
    spacing: { inRow: 24, betweenRows: 36, unit: 'in' }, sowMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    growingTips: [
      'Start from cuttings, not seed (germination is slow and unreliable).',
      'Excellent in the ground or a large container.',
      'Prune after flowering to keep compact; never cut into old wood.',
      'Basically unkillable in 9b if drainage is good.',
    ],
    zone9b: {
      bestSeason: 'Year-round evergreen perennial. The ultimate set-and-forget 9b herb.',
      heatStrategy: 'Mediterranean native — 9b heat is its comfort zone.',
      frostRisk: 'Hardy to mid-20s°F; no protection needed in 9b.',
      microclimate: 'Grows equally well coast or inland.',
      commonMistakes: ['Overwatering (root rot is the #1 killer)', 'Planting in heavy clay without amendment', 'Cutting into old wood (won\'t regrow)'],
    },
    pros: ['Evergreen perennial — plant once, harvest forever', 'Drought-tolerant', 'Beautiful flowers attract pollinators', 'Deer/rabbit resistant', 'Fragrant'],
    cons: ['Slow from seed', 'Can get woody/leggy without pruning', 'Takes up space when mature (3–4 ft)'],
    nutrition: { perServing: '1 tbsp fresh', calories: 2, highlights: ['Rosmarinic acid (antioxidant)', 'Iron', 'Calcium', 'Vitamin B6'] },
    healthBenefits: [
      'Rosmarinic acid is a potent anti-inflammatory and antioxidant.',
      'Traditionally used to improve memory and concentration (confirmed by some studies).',
      'Supports digestion and bile flow.',
      'Antimicrobial properties.',
    ],
    medicinal: [
      { use: 'Memory and cognition', evidence: 'emerging', note: 'Rosemary aroma improved cognitive performance in controlled trials (Moss et al., 2003).' },
      { use: 'Hair growth', evidence: 'emerging', note: 'Rosemary oil compared favorably to minoxidil in a 2015 trial for androgenic alopecia.' },
      { use: 'Anti-inflammatory', evidence: 'well-studied', note: 'Rosmarinic acid and carnosic acid are well-documented anti-inflammatory compounds.' },
      { use: 'Digestive tonic', evidence: 'traditional', note: 'Rosemary tea used for centuries for bloating and indigestion.' },
    ],
    culinaryUses: ['Roasted meats (lamb, chicken, pork)', 'Focaccia and bread', 'Roasted potatoes/vegetables', 'Infused olive oil', 'Cocktails (rosemary gin)'],
    flavorProfile: 'Piney, peppery, slightly camphor. Strong — use sparingly.',
    storage: 'Stem-in water on counter for 2 weeks; dries well; freezes in olive oil.',
    companions: { goodWith: ['Sage', 'Thyme', 'Lavender', 'Bean', 'Brassica', 'Carrot'], badWith: ['Basil (different water needs)', 'Mint'], why: 'Rosemary deters cabbage moth and carrot fly. Group with other drought-tolerant Mediterranean herbs.' },
    pestRisks: [
      { pest: 'Root rot', likelihood: 'moderate', prevention: 'Well-drained soil only; reduce watering; no standing water.' },
      { pest: 'Powdery mildew', likelihood: 'low', prevention: 'Good airflow; avoid overhead water.' },
    ],
    feedingNotes: 'Almost none. A light compost top-dress once a year is plenty. Over-feeding weakens flavor.',
  },

  // ---- CITRUS ----
  {
    commonName: 'Meyer Lemon', variety: 'Improved Meyer', species: 'Citrus × meyeri', family: 'Rutaceae', cropCat: 'citrus',
    sun: 'full_sun', water: 'medium', difficulty: 'beginner', soilPh: [6.0, 7.0], soilType: 'Well-drained; amend clay with gypsum',
    spacing: { inRow: 120, betweenRows: 120, unit: 'in' }, sowMonths: [1, 2, 3, 4, 11, 12], harvestMonths: [11, 12, 1, 2, 3],
    growingTips: [
      'Plant on a slight mound — citrus hates wet crown.',
      'Mulch out to drip line but keep 6" clear of trunk.',
      'Water deeply and infrequently; let top 2" dry between.',
      'Fruit ripens on the tree — taste test, don\'t judge by color alone.',
    ],
    zone9b: {
      bestSeason: 'Evergreen year-round; main harvest Nov–Mar.',
      heatStrategy: 'Handles 9b heat well; water deeply in summer. Fruit may drop in extreme heat.',
      frostRisk: 'Damaged below 28°F; cover or use holiday lights for warmth on rare hard-frost nights.',
      microclimate: 'Coastal = ideal; inland plant on south-facing wall for thermal mass.',
      commonMistakes: ['Watering too often (root rot)', 'Not feeding enough (citrus are heavy feeders)', 'Trunk sunburn (whitewash exposed trunk)'],
    },
    pros: ['Year-round beauty', 'Sweeter and less acidic than true lemon', 'Prolific (100+ fruit/year at maturity)', 'Fragrant blooms', 'Compact — fits small yards'],
    cons: ['Frost-sensitive', 'Susceptible to citrus leaf miner', 'Takes 2–3 years to produce heavily', 'Heavy feeder'],
    nutrition: { perServing: '1 lemon juice + zest', calories: 12, highlights: ['Very high vitamin C', 'Flavonoids (hesperidin, diosmin)', 'D-limonene in peel'] },
    healthBenefits: [
      'Vitamin C powerhouse — immune support.',
      'Flavonoids support vascular health.',
      'D-limonene (peel) has anti-cancer and digestive properties in studies.',
      'Alkalizing effect despite being acidic (mineral content).',
    ],
    medicinal: [
      { use: 'Immune support / cold remedy', evidence: 'well-studied', note: 'Vitamin C shortens cold duration; hot lemon water is the classic remedy.' },
      { use: 'Digestive aid', evidence: 'traditional', note: 'Warm lemon water before meals stimulates digestive enzymes.' },
      { use: 'D-limonene for reflux', evidence: 'emerging', note: 'Lemon peel extract studied for GERD relief; small trials promising.' },
    ],
    culinaryUses: ['Juice in everything', 'Zest for baking/cooking', 'Preserved lemons (Moroccan)', 'Lemon curd', 'Cocktails', 'Lemonade', 'Salad dressings'],
    flavorProfile: 'Sweeter, rounder, and more floral than Eureka/Lisbon. Thin skin with edible peel.',
    storage: 'Counter 1 week; refrigerator 3–4 weeks; juice freezes well in ice cube trays.',
    companions: { goodWith: ['Lavender', 'Marigold', 'Nasturtium', 'Comfrey (mulch)'], badWith: ['Lawn grass at base (competition)', 'Heavy shade trees'], why: 'Nasturtiums attract beneficial insects; comfrey as chop-and-drop mulch feeds the tree.' },
    pestRisks: [
      { pest: 'Citrus leaf miner', likelihood: 'high', prevention: 'Spinosad spray on new flushes; doesn\'t harm mature leaves.' },
      { pest: 'Scale', likelihood: 'moderate', prevention: 'Horticultural oil; ants farm scale, so control ants first (sticky barrier on trunk).' },
      { pest: 'Citrus thrips', likelihood: 'moderate', prevention: 'Spinosad; beneficial predatory mites.' },
    ],
    feedingNotes: 'Heavy feeder. 3x/year: Feb, May, Aug ("Presidents, Memorial, Labor Day" rule). Use citrus-specific fertilizer (high N, with iron, zinc, manganese micros).',
  },

  // ---- STONE FRUIT ----
  {
    commonName: 'Peach', variety: 'Babcock', species: 'Prunus persica', family: 'Rosaceae', cropCat: 'stone_fruit',
    sun: 'full_sun', water: 'medium', difficulty: 'intermediate', soilPh: [6.0, 7.0], soilType: 'Well-drained loam',
    daysToHarvest: 0, spacing: { inRow: 180, betweenRows: 180, unit: 'in' }, sowMonths: [12, 1], harvestMonths: [6, 7],
    growingTips: [
      'Open-center (vase) pruning for air and light in the canopy.',
      'Thin fruit to 6–8" apart after fruit set — bigger, sweeter peaches.',
      'Dormant spray (copper + oil) in Dec and Jan for peach leaf curl.',
      'Water deeply but infrequently; reduce water 2 weeks before harvest for sweeter fruit.',
    ],
    zone9b: {
      bestSeason: 'Babcock is a low-chill (250–300 hrs) white peach bred for SoCal.',
      heatStrategy: 'Heat is fine; but reduce water pre-harvest for best flavor.',
      frostRisk: 'Needs some winter chill; open blossoms can be damaged by rare late frost.',
      microclimate: 'Inland 9b gets better chill hours; coastal may need another low-chill variety.',
      commonMistakes: ['Skipping dormant spray → peach leaf curl every spring', 'Not thinning fruit → small, bland peaches', 'Pruning in summer (invites disease)'],
    },
    pros: ['Unbelievably sweet white peach', 'Low chill — perfect for 9b', 'Self-fertile (no pollinator needed)', 'Beautiful spring blossoms'],
    cons: ['Peach leaf curl requires annual dormant spray', 'Short harvest window', 'Fruit bruises easily', 'Annual pruning required'],
    nutrition: { perServing: '1 medium peach', calories: 59, highlights: ['Vitamin C', 'Vitamin A', 'Potassium', 'Fiber', 'Phenolic acids'] },
    healthBenefits: ['Rich in antioxidants (chlorogenic acid).', 'Supports skin health (vitamins A + C).', 'Fiber supports digestion.', 'Potassium supports blood pressure.'],
    medicinal: [
      { use: 'Digestive support', evidence: 'traditional', note: 'Peach leaf tea used in folk medicine for nausea and constipation.' },
      { use: 'Skin health', evidence: 'traditional', note: 'Topical peach kernel oil used for moisturizing in East Asian medicine.' },
    ],
    culinaryUses: ['Fresh eating (peak flavor)', 'Grilled with burrata', 'Pies and cobblers', 'Preserves / jam', 'Peach salsa', 'Smoothies', 'Dried'],
    flavorProfile: 'Babcock: aromatic white flesh, honey-sweet, low acid, melt-in-your-mouth. Best eaten same day.',
    storage: 'Counter to ripen; refrigerator slows ripening to 3–5 days. Does not ship well — that\'s why homegrown wins.',
    companions: { goodWith: ['Garlic', 'Chives (at base)', 'Nasturtium', 'Comfrey'], badWith: ['Tomato/nightshade family', 'Other stone fruit too close (disease spread)'], why: 'Alliums at the base deter borers; avoid nightshades which share bacterial spot.' },
    pestRisks: [
      { pest: 'Peach leaf curl', likelihood: 'high', prevention: 'Dormant copper spray Dec + Jan before bud swell. No cure once leaves curl; they recover.' },
      { pest: 'Oriental fruit moth', likelihood: 'moderate', prevention: 'Pheromone traps; spinosad at petal fall.' },
      { pest: 'Brown rot', likelihood: 'moderate', prevention: 'Remove mummified fruit; thin for airflow; copper at bloom.' },
    ],
    feedingNotes: 'Medium feeder. Feed at bud-break (Mar) and after fruit set (Jun). Avoid late-season N — delays dormancy.',
  },

  // ---- BERRIES ----
  {
    commonName: 'Strawberry', variety: 'Albion', species: 'Fragaria × ananassa', family: 'Rosaceae', cropCat: 'berry',
    sun: 'full_sun', water: 'high', difficulty: 'beginner', soilPh: [5.5, 6.5], soilType: 'Rich, well-drained, slightly acidic',
    daysToHarvest: 0, spacing: { inRow: 12, betweenRows: 12, unit: 'in' }, sowMonths: [10, 11], harvestMonths: [3, 4, 5, 6, 7, 8],
    growingTips: [
      'Plant bare-root crowns in fall for spring fruit.',
      'Keep crown above soil line but roots buried — the #1 planting mistake.',
      'Straw or pine mulch under fruit prevents rot and keeps berries clean.',
      'Pinch first flowers for 4–6 weeks after planting to build root strength.',
    ],
    zone9b: {
      bestSeason: 'Plant Oct–Nov; harvest Mar–Aug (day-neutral means long season).',
      heatStrategy: 'Production slows above 85°F; shade cloth helps. Spider mites explode in heat.',
      frostRisk: 'Handles light frost; cover blooms on rare hard-frost nights.',
      microclimate: 'Coastal 9b = ideal; inland needs shade cloth mid-summer.',
      commonMistakes: ['Planting crown too deep (rots)', 'Not mulching under fruit (dirty/rotting berries)', 'Ignoring spider mites in July'],
    },
    pros: ['Long season (day-neutral)', 'Excellent flavor — firm, sweet, aromatic', 'Compact — perfect for raised beds', 'Kids love picking'],
    cons: ['Spider mites in summer heat', 'Needs replacing every 2–3 years', 'Birds love them (net the bed)', 'High water need'],
    nutrition: { perServing: '1 cup', calories: 49, highlights: ['Very high vitamin C', 'Manganese', 'Folate', 'Anthocyanins', 'Ellagic acid'] },
    healthBenefits: [
      'One cup = 150% daily vitamin C.',
      'Anthocyanins and ellagic acid linked to reduced inflammation and cancer risk.',
      'Low glycemic index despite sweetness — suitable for blood sugar management.',
      'Heart health: studies show strawberry consumption improves cholesterol markers.',
    ],
    medicinal: [
      { use: 'Anti-inflammatory', evidence: 'well-studied', note: 'Clinical trials show regular strawberry intake reduces CRP and IL-6 inflammatory markers.' },
      { use: 'Cardiovascular support', evidence: 'well-studied', note: 'Lowers LDL oxidation and improves endothelial function in studies.' },
      { use: 'Skin brightening', evidence: 'traditional', note: 'Topical strawberry mask used traditionally for skin tone; ellagic acid inhibits melanin production in vitro.' },
    ],
    culinaryUses: ['Fresh eating', 'Shortcake', 'Smoothies', 'Jam / preserves', 'Chocolate-dipped', 'Freeze-dried snacks', 'Salads with balsamic'],
    flavorProfile: 'Albion: firm, sweet, aromatic, complex. Holds shape well. Best eaten warm from the plant.',
    storage: 'Unwashed in refrigerator 3–5 days; wash just before eating. Freezes well.',
    companions: { goodWith: ['Lettuce', 'Spinach', 'Onion', 'Borage', 'Thyme'], badWith: ['Brassicas', 'Fennel', 'Mint (takes over)'], why: 'Borage attracts pollinators and may improve yield. Thyme groundcover deters slugs.' },
    pestRisks: [
      { pest: 'Spider mites', likelihood: 'high', prevention: 'Spray undersides with water every 2–3 days in heat; insecticidal soap; predatory mites.' },
      { pest: 'Slugs/snails', likelihood: 'moderate', prevention: 'Straw mulch; iron phosphate bait; beer traps.' },
      { pest: 'Birds', likelihood: 'high', prevention: 'Bird netting over the bed.' },
    ],
    feedingNotes: 'Medium feeder. Light balanced feed every 3 weeks while fruiting. Avoid excess N — soft fruit, less flavor.',
  },

  {
    commonName: 'Blueberry', variety: 'Sunshine Blue', species: 'Vaccinium corymbosum', family: 'Ericaceae', cropCat: 'berry',
    sun: 'full_sun', water: 'high', difficulty: 'intermediate', soilPh: [4.5, 5.5], soilType: 'Acidic, well-drained, high organic matter — peat/sulfur amended',
    spacing: { inRow: 36, betweenRows: 60, unit: 'in' }, sowMonths: [11, 12, 1], harvestMonths: [5, 6, 7],
    growingTips: [
      'Acidic soil is NON-NEGOTIABLE. Test pH and amend with sulfur before planting.',
      'Use rainwater or acidified water if your tap is alkaline (common in SoCal).',
      'Mulch heavily with pine bark (maintains acidity).',
      'Plant at least 2 varieties for best pollination and yield.',
    ],
    zone9b: {
      bestSeason: 'Plant bare-root Dec–Jan; harvest May–Jul.',
      heatStrategy: 'Afternoon shade helps in inland 9b. Mulch heavily to keep roots cool.',
      frostRisk: 'Deciduous; handles 9b winters easily. 150 chill hours (Sunshine Blue is among lowest).',
      microclimate: 'Struggles in hot, dry inland without irrigation + shade. Coastal 9b = easier.',
      commonMistakes: ['Not acidifying soil (pH 7+ = iron chlorosis, yellow leaves, death)', 'Using tap water without acidifying (SoCal water is alkaline)', 'Underestimating water needs'],
    },
    pros: ['Superb antioxidant superfood', 'Beautiful ornamental (fall color, spring flowers)', 'Compact — works in containers', 'Self-fertile (but better with cross-pollination)', 'Long-lived perennial'],
    cons: ['Demanding pH requirements', 'SoCal water is often too alkaline', 'Slow to establish (2–3 years to full production)', 'Birds steal every ripe berry'],
    nutrition: { perServing: '1 cup', calories: 84, highlights: ['Highest antioxidant capacity of common fruits', 'Anthocyanins', 'Vitamin C', 'Vitamin K', 'Manganese', 'Fiber'] },
    healthBenefits: [
      'Among the highest antioxidant foods measured (ORAC scale).',
      'Anthocyanins improve memory and cognitive function in studies (even in older adults).',
      'Regular consumption linked to lower blood pressure.',
      'Anti-diabetic effects — improves insulin sensitivity.',
      'Supports urinary tract health (similar mechanism to cranberry).',
    ],
    medicinal: [
      { use: 'Cognitive function / brain health', evidence: 'well-studied', note: 'Multiple clinical trials show improved memory and delayed cognitive decline with daily blueberry consumption.' },
      { use: 'Cardiovascular health', evidence: 'well-studied', note: '1 cup/day for 6 months reduced blood pressure and arterial stiffness in a 2019 clinical trial.' },
      { use: 'Urinary tract health', evidence: 'emerging', note: 'Contains proanthocyanidins that inhibit bacterial adhesion, similar to cranberry.' },
      { use: 'Anti-diabetic', evidence: 'emerging', note: 'Anthocyanins improve insulin sensitivity and glucose metabolism in metabolic syndrome patients.' },
    ],
    culinaryUses: ['Fresh snacking', 'Smoothies', 'Pancakes/muffins/scones', 'Jam', 'Pie', 'Freeze beautifully', 'Dried as trail mix'],
    flavorProfile: 'Sunshine Blue: medium-sweet, tangy, aromatic. Smaller berry but intense flavor.',
    storage: 'Unwashed in refrigerator 1–2 weeks (longer than most fruit). Freezes perfectly.',
    companions: { goodWith: ['Other blueberries (cross-pollination)', 'Azalea', 'Rhododendron (same acid needs)', 'Strawberry (separate bed)'], badWith: ['Alkaline-loving plants', 'Walnut trees (juglone)'], why: 'Group acid-lovers together so amendments benefit all.' },
    pestRisks: [
      { pest: 'Birds', likelihood: 'high', prevention: 'Bird netting — essential; they will eat everything.' },
      { pest: 'Iron chlorosis', likelihood: 'high', prevention: 'Not a pest — pH too high. Amend with sulfur; foliar iron chelate as rescue.' },
      { pest: 'Mummy berry', likelihood: 'low', prevention: 'Remove fallen fruit; good airflow.' },
    ],
    feedingNotes: 'Use acidifying fertilizer only (azalea/camellia food or ammonium sulfate). Feed lightly in spring and again after fruit set. NEVER use nitrate-form nitrogen (blueberries can\'t absorb it).',
  },

  // ---- ROOTS ----
  {
    commonName: 'Carrot', variety: 'Nantes', species: 'Daucus carota', family: 'Apiaceae', cropCat: 'root',
    sun: 'full_sun', water: 'medium', difficulty: 'beginner', soilPh: [6.0, 6.8], soilType: 'Loose, stone-free, sandy loam — raised beds are ideal',
    daysToHarvest: 70, spacing: { inRow: 3, betweenRows: 6, unit: 'in' }, sowMonths: [9, 10, 11, 1, 2], harvestMonths: [12, 1, 2, 3, 4],
    growingTips: [
      'Direct sow only — carrots don\'t transplant.',
      'Keep soil surface moist until germination (10–14 days); cover with burlap/cardboard.',
      'Thin to 2–3" apart when 2" tall — crowded carrots fork.',
      'Your 17" Vego beds are perfect — full root depth with no rocks.',
    ],
    zone9b: {
      bestSeason: 'Cool season: sow Sep–Feb for Dec–Apr harvest.',
      heatStrategy: 'Don\'t grow in summer — roots are bitter and woody.',
      frostRisk: 'Frost improves sweetness; can overwinter in the ground in 9b.',
      microclimate: 'Inland 9b with cooler nights produces the sweetest carrots.',
      commonMistakes: ['Sowing too thickly', 'Letting soil crust (kills germination)', 'Growing in rocky/heavy soil (forking)'],
    },
    pros: ['Perfect raised-bed crop — uses the full 15" depth', 'Very space-efficient', 'Sweet and satisfying to pull', 'Stores in the ground for months', 'Great with kids'],
    cons: ['Slow germination', 'Needs thinning', 'Forked in heavy/rocky soil', 'Carrot rust fly in some areas'],
    nutrition: { perServing: '1 medium carrot', calories: 25, highlights: ['Extreme beta-carotene (vitamin A precursor)', 'Fiber', 'Vitamin K', 'Potassium', 'Biotin'] },
    healthBenefits: [
      'Beta-carotene → vitamin A: essential for vision, immune function, skin.',
      'Lutein and zeaxanthin support eye health / macular degeneration prevention.',
      'Soluble fiber supports gut health and cholesterol reduction.',
      'Falcarinol (polyacetylene) shows anti-cancer activity in lab studies.',
    ],
    medicinal: [
      { use: 'Eye health', evidence: 'well-studied', note: 'Beta-carotene + lutein definitively support vision; carrot\'s reputation is earned.' },
      { use: 'Skin health', evidence: 'emerging', note: 'Beta-carotene improves skin color and provides mild UV protection from within.' },
      { use: 'Gut health', evidence: 'well-studied', note: 'Soluble fiber (pectin) feeds beneficial gut bacteria.' },
    ],
    culinaryUses: ['Raw snacking / crudités', 'Roasted (caramelized)', 'Soups / stock base (mirepoix)', 'Juicing', 'Fermented (carrot sticks)', 'Carrot cake', 'Glazed as side dish'],
    flavorProfile: 'Nantes: sweet, tender, coreless. Best fresh from the ground — incomparably better than store-bought.',
    storage: 'Brush off dirt (don\'t wash); refrigerator in plastic bag for 4+ weeks. Or leave in the ground and pull as needed.',
    companions: { goodWith: ['Lettuce', 'Onion', 'Leek', 'Rosemary', 'Tomato', 'Radish (row marker)'], badWith: ['Dill (cross-pollinates / attracts carrot fly)', 'Parsnip (same pests)'], why: 'Onions/rosemary repel carrot rust fly. Radishes mark the row and break soil crust.' },
    pestRisks: [
      { pest: 'Carrot rust fly', likelihood: 'low', prevention: 'Row cover; interplant with alliums; harvest before overwintering larvae.' },
      { pest: 'Aphids on foliage', likelihood: 'moderate', prevention: 'Blast with water; they rarely affect the root.' },
    ],
    feedingNotes: 'Light feeder. Too much nitrogen = forked, hairy roots. Compost at planting is sufficient; no side-dressing needed.',
  },

  // ---- FLOWERS ----
  {
    commonName: 'Marigold', variety: 'French (Bonanza)', species: 'Tagetes patula', family: 'Asteraceae', cropCat: 'flower',
    sun: 'full_sun', water: 'low', difficulty: 'beginner', soilPh: [6.0, 7.5], soilType: 'Any — tolerates poor soil',
    daysToHarvest: 50, spacing: { inRow: 8, betweenRows: 12, unit: 'in' }, sowMonths: [3, 4, 5, 9], harvestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    growingTips: [
      'Direct sow after last frost; germinates in 5–7 days.',
      'Deadhead spent blooms for continuous flowering.',
      'Plant at bed edges as a living pest barrier.',
      'Pull entire plant at end of season and compost.',
    ],
    zone9b: {
      bestSeason: 'Spring–fall; in 9b they can bloom nearly 8 months.',
      heatStrategy: 'Handles heat well; may pause blooming in extreme heat, then resume.',
      frostRisk: 'Annual; dies with hard frost. In 9b often survives until Dec.',
      microclimate: 'Equally good coast or inland.',
      commonMistakes: ['Overwatering (they like it lean)', 'Not deadheading', 'Planting in full shade'],
    },
    pros: ['Best companion plant — repels many pests', 'Nematode-suppressing roots', 'Incredibly easy', 'Cheerful color all season', 'Edible petals', 'Attracts beneficial insects'],
    cons: ['Annual — replant each year', 'Strong scent (some people dislike it)', 'Can reseed aggressively', 'Spider mites in dry heat'],
    nutrition: { perServing: 'Petals (garnish)', highlights: ['Lutein (eye health)', 'Flavonoids', 'Edible but primarily medicinal/ornamental'] },
    healthBenefits: ['Lutein extracted from marigold petals is the primary commercial source for eye-health supplements.', 'Traditional wound-healing herb (Calendula is the medicinal cousin).'],
    medicinal: [
      { use: 'Eye health (lutein source)', evidence: 'well-studied', note: 'Tagetes-derived lutein is the global standard for macular health supplements.' },
      { use: 'Nematode suppression (soil health)', evidence: 'well-studied', note: 'French marigold roots release alpha-terthienyl, toxic to root-knot nematodes. Plant as a cover crop and till in.' },
      { use: 'Skin healing', evidence: 'traditional', note: 'Calendula (pot marigold, different species) is the classic wound herb; French marigold has similar but weaker compounds.' },
    ],
    culinaryUses: ['Petals as edible garnish (salads, rice)', 'Natural food coloring (saffron substitute in some cultures)', 'Herbal tea (mild)'],
    flavorProfile: 'Petals: slightly citrusy, peppery, mildly bitter. Use sparingly.',
    storage: 'Dry petals for tea or coloring; fresh blooms last 5–7 days in a vase.',
    companions: { goodWith: ['Tomato', 'Pepper', 'Squash', 'Bean', 'Cucumber', 'Rose — essentially everything'], badWith: ['None significant'], why: 'Root exudates suppress nematodes; scent deters aphids, whitefly, and cabbage moths; flowers attract hoverflies and parasitic wasps.' },
    pestRisks: [
      { pest: 'Spider mites', likelihood: 'moderate', prevention: 'Water spray; usually not severe enough to treat.' },
      { pest: 'Slugs on seedlings', likelihood: 'low', prevention: 'Iron phosphate if needed.' },
    ],
    feedingNotes: 'Almost none. Poor soil = more flowers. Rich soil = lots of leaf, fewer blooms.',
  },
];

// ============================================================
// Helpers
// ============================================================
export function getProfile(name: string, variety?: string): PlantProfile | undefined {
  const n = name.toLowerCase();
  return ENCYCLOPEDIA.find(p =>
    p.commonName.toLowerCase() === n && (!variety || p.variety?.toLowerCase() === variety.toLowerCase()));
}
export function byCropCat(cat: CropCat): PlantProfile[] { return ENCYCLOPEDIA.filter(p => p.cropCat === cat); }
export function withMedicinalUse(use: string): PlantProfile[] {
  const u = use.toLowerCase();
  return ENCYCLOPEDIA.filter(p => p.medicinal.some(m => m.use.toLowerCase().includes(u)));
}
export function companionSearch(plantName: string): { goodWith: string[]; badWith: string[] } | undefined {
  const p = ENCYCLOPEDIA.find(e => e.commonName.toLowerCase() === plantName.toLowerCase());
  return p ? p.companions : undefined;
}

// ============================================================
// DEMO
// ============================================================
function demo() {
  console.log(`\n📚  9B GrowOS PLANT ENCYCLOPEDIA — ${ENCYCLOPEDIA.length} profiles\n`);
  for (const p of ENCYCLOPEDIA) {
    console.log(`  🌱 ${p.commonName}${p.variety ? ` '${p.variety}'` : ''} (${p.family})`);
    console.log(`     ${p.difficulty} · ${p.sun} · ${p.water} water · pH ${p.soilPh[0]}–${p.soilPh[1]}`);
    console.log(`     9b: ${p.zone9b.bestSeason}`);
    console.log(`     Pros: ${p.pros[0]}`);
    console.log(`     Health: ${p.healthBenefits[0]}`);
    console.log(`     Medicinal: ${p.medicinal[0]?.use ?? '—'} (${p.medicinal[0]?.evidence ?? '—'})`);
    console.log(`     Companions: ✅ ${p.companions.goodWith.slice(0, 3).join(', ')}  ❌ ${p.companions.badWith.slice(0, 2).join(', ')}`);
    console.log('');
  }

  console.log(`  🔍 Plants with medicinal brain/memory benefits:`);
  withMedicinalUse('cognit').forEach(p => console.log(`     → ${p.commonName} ${p.variety ?? ''}`));
  withMedicinalUse('memory').forEach(p => console.log(`     → ${p.commonName} ${p.variety ?? ''}`));
  console.log(`\n  🔍 Anti-inflammatory plants:`);
  withMedicinalUse('anti-inflam').forEach(p => console.log(`     → ${p.commonName} ${p.variety ?? ''}`));
  console.log('');
}
demo();
