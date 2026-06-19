// ============================================================
// data/pests9b.ts — Zone 9b pest encyclopedia. Identifies, explains
// lifecycle, ranks severity, and gives organic treatment + prevention.
// The diagnostics engine and coach both reference this.
// Run:  node --experimental-strip-types pests9b.ts
// ============================================================

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
export type Severity = 'nuisance' | 'moderate' | 'serious' | 'devastating';

export interface Treatment {
  name: string;
  type: 'organic' | 'cultural' | 'biological' | 'mechanical';
  howTo: string;
  timing: string;
  effectiveness: 'high' | 'moderate' | 'low';
}

export interface PestProfile {
  commonName: string;
  scientificName?: string;
  type: 'insect' | 'mite' | 'mollusk' | 'mammal' | 'disease_fungal' | 'disease_bacterial' | 'disease_viral';
  description: string;
  identification: string[];
  affectedPlants: string[];
  severity: Severity;
  peakSeason9b: Season[];
  lifecycle: string;
  damage: string[];
  treatments: Treatment[];
  prevention: string[];
  zone9bNotes: string;
}

export const PEST_ENCYCLOPEDIA: PestProfile[] = [
  {
    commonName: 'Aphids',
    scientificName: 'Aphidoidea (multiple species)',
    type: 'insect',
    description: 'Tiny soft-bodied insects that cluster on new growth and leaf undersides, sucking sap. Green, black, white, or pink depending on species.',
    identification: ['Clusters of tiny (1–3mm) pear-shaped insects on stems/leaf undersides', 'Sticky honeydew residue on leaves', 'Black sooty mold growing on honeydew', 'Curled or distorted new growth', 'Ants farming (carrying) aphids up stems'],
    affectedPlants: ['Nearly everything — especially: kale, pepper, rose, citrus, lettuce, basil, tomato'],
    severity: 'moderate',
    peakSeason9b: ['spring', 'fall'],
    lifecycle: 'Reproduce explosively — a single female produces 80+ live clones without mating in warm weather. Winged forms appear when colonies are overcrowded and fly to new plants. Generation time: 7–10 days.',
    damage: ['Sap loss weakens plants', 'Honeydew → sooty mold → blocks photosynthesis', 'Transmit viral diseases (mosaic, leaf curl)', 'Deform new growth and flower buds'],
    treatments: [
      { name: 'Strong water blast', type: 'mechanical', howTo: 'Blast colonies off with a hose nozzle, especially undersides. Repeat every 2–3 days.', timing: 'Early morning', effectiveness: 'high' },
      { name: 'Insecticidal soap', type: 'organic', howTo: 'Spray contact on insects (must hit them directly). 2 tbsp Castile soap per quart of water.', timing: 'Early AM or evening; avoid midday heat', effectiveness: 'high' },
      { name: 'Neem oil', type: 'organic', howTo: 'Diluted neem (1 tbsp/gal + a few drops soap as emulsifier). Spray every 7–10 days.', timing: 'Evening (degrades in UV)', effectiveness: 'moderate' },
      { name: 'Ladybugs', type: 'biological', howTo: 'Release at dusk near infested plants after watering. One adult eats 50+ aphids/day.', timing: 'After watering, at dusk', effectiveness: 'high' },
      { name: 'Lacewing larvae', type: 'biological', howTo: 'Lacewing larvae ("aphid lions") are even more voracious than ladybugs. Buy eggs and sprinkle on affected plants.', timing: 'When colonies are active', effectiveness: 'high' },
    ],
    prevention: [
      'Encourage beneficials: plant alyssum, dill, fennel, yarrow nearby to attract ladybugs and lacewings.',
      'Avoid excess nitrogen fertilizer — lush new growth is aphid bait.',
      'Interplant with alliums (garlic/chives) and strongly scented herbs.',
      'Inspect new transplants before introducing to the garden.',
      'Control ants — they protect aphid colonies from predators.',
    ],
    zone9bNotes: 'Worst in 9b spring (Mar–May) and fall (Oct–Nov) when temps are 60–80°F. Summer heat often reduces populations naturally. Spring infestations on kale and fall infestations on pepper are predictable — preempt with beneficials.',
  },

  {
    commonName: 'Spider mites',
    scientificName: 'Tetranychus urticae (two-spotted spider mite)',
    type: 'mite',
    description: 'Microscopic mites (need a hand lens) that thrive in hot, dry conditions — the #1 summer pest in Zone 9b raised beds.',
    identification: ['Fine webbing on leaf undersides and between stems', 'Stippled/speckled yellowing on leaf tops', 'Tiny moving dots on leaf underside (use phone camera zoom)', 'Leaves feel gritty', 'Severe: bronzed, dry, crispy leaves'],
    affectedPlants: ['Strawberry', 'Tomato', 'Pepper', 'Bean', 'Cucumber', 'Rose', 'Citrus (especially in container)'],
    severity: 'serious',
    peakSeason9b: ['summer'],
    lifecycle: 'Eggs hatch in 3 days at 90°F; generation time 5–7 days in heat. Populations can increase 10x per week. Dusty conditions accelerate spread. Overwinter on weeds.',
    damage: ['Suck chlorophyll → stippled yellow/bronze leaves', 'Reduced photosynthesis → stunted growth, poor fruit', 'Severe infestations defoliate plants', 'Weaken plants, inviting secondary disease'],
    treatments: [
      { name: 'Strong water spray (undersides)', type: 'mechanical', howTo: 'Blast undersides of every affected leaf with hard water stream. Repeat every 2–3 days for 2 weeks. This alone controls moderate infestations.', timing: 'Morning', effectiveness: 'high' },
      { name: 'Insecticidal soap', type: 'organic', howTo: 'Thorough coverage of leaf undersides. Must contact mites to work. Repeat every 5–7 days.', timing: 'Avoid midday heat', effectiveness: 'moderate' },
      { name: 'Horticultural oil (summer weight)', type: 'organic', howTo: 'Suffocates mites and eggs. Use at 1–2% concentration. Coat undersides.', timing: 'Evening or cool AM; NEVER in full sun', effectiveness: 'high' },
      { name: 'Predatory mites (Phytoseiulus persimilis)', type: 'biological', howTo: 'Release on infested plants. They eat spider mites exclusively. Need humidity >50% to establish.', timing: 'When mites are present but not severe', effectiveness: 'high' },
    ],
    prevention: [
      'Keep foliage clean — mist or spray undersides regularly in dry heat.',
      'Avoid dusty conditions near beds.',
      'Maintain adequate water — drought-stressed plants are magnets.',
      'Remove weeds that harbor overwintering mites.',
      'Don\'t use broad-spectrum insecticides — they kill predatory mites and make outbreaks worse.',
    ],
    zone9bNotes: 'The defining summer pest for 9b raised beds. White metal beds (like your Vegos) dry the air around foliage faster. Start preventive water sprays in June before you see damage. Strawberries are first to show — scout weekly from May. Inland valleys: much worse than coastal.',
  },

  {
    commonName: 'Whitefly',
    scientificName: 'Bemisia tabaci / Trialeurodes vaporariorum',
    type: 'insect',
    description: 'Tiny white-winged insects that fly up in clouds when foliage is disturbed. Suck sap and excrete honeydew.',
    identification: ['Cloud of tiny white insects when you shake a plant', 'Sticky honeydew on leaf surfaces', 'Sooty mold (black coating)', 'Yellowing leaves', 'Tiny white oval eggs on leaf undersides'],
    affectedPlants: ['Tomato', 'Pepper', 'Squash', 'Cucumber', 'Citrus', 'Hibiscus'],
    severity: 'moderate',
    peakSeason9b: ['summer', 'fall'],
    lifecycle: 'Eggs to adults in 3–4 weeks in warm weather. Multiple overlapping generations. Adults live ~1 month.',
    damage: ['Sap loss → weak, yellow plants', 'Honeydew → sooty mold', 'Transmit tomato yellow leaf curl virus (devastating)', 'Reduce fruit quality'],
    treatments: [
      { name: 'Yellow sticky traps', type: 'mechanical', howTo: 'Hang yellow cards at canopy height. Traps adults and monitors population.', timing: 'Deploy early season as a monitor', effectiveness: 'moderate' },
      { name: 'Insecticidal soap', type: 'organic', howTo: 'Spray undersides thoroughly; must hit the nymphs.', timing: 'Every 5–7 days', effectiveness: 'moderate' },
      { name: 'Neem oil', type: 'organic', howTo: 'Acts as growth regulator on nymphs; disrupts feeding.', timing: 'Evening', effectiveness: 'moderate' },
      { name: 'Encarsia formosa (parasitic wasp)', type: 'biological', howTo: 'Tiny wasp parasitizes whitefly nymphs. Available as cards of pupae to hang near plants.', timing: 'When nymphs are present', effectiveness: 'high' },
    ],
    prevention: [
      'Reflective mulch (aluminum foil or silver plastic) confuses whiteflies — they can\'t find the plant.',
      'Avoid excessive nitrogen — soft growth attracts them.',
      'Inspect transplants before introducing.',
      'Encourage beneficials: plant alyssum and marigold nearby.',
    ],
    zone9bNotes: 'Year-round in mild 9b. Worst Jul–Nov. Tomato yellow leaf curl virus (TYLCV) is the real threat — transmitted by silverleaf whitefly. If a tomato goes stunted + curled + yellow, rogue it immediately to protect others.',
  },

  {
    commonName: 'Citrus leaf miner',
    scientificName: 'Phyllocnistis citrella',
    type: 'insect',
    description: 'Tiny moth whose larvae tunnel between leaf surfaces, leaving distinctive squiggly silver trails. Cosmetic on mature trees but can stunt young trees.',
    identification: ['Silver/white serpentine trails on leaf surfaces', 'Curled, distorted new leaves', 'Tiny yellowish larvae visible inside trails (with a lens)', 'Pupae rolled into leaf margins'],
    affectedPlants: ['All citrus — Meyer lemon, orange, grapefruit, lime, kumquat'],
    severity: 'moderate',
    peakSeason9b: ['summer', 'fall'],
    lifecycle: 'Moth lays eggs on new leaf flushes. Larvae mine through the leaf for 2–3 weeks, then pupate in a curled leaf edge. Multiple generations year-round in 9b.',
    damage: ['Mines reduce photosynthetic area', 'Curled/distorted leaves', 'Wounds provide entry for citrus canker bacteria', 'Young trees: stunted growth. Mature trees: cosmetic only'],
    treatments: [
      { name: 'Spinosad spray', type: 'organic', howTo: 'Spray new flush growth (light green, expanding leaves). Must be applied BEFORE larvae enter the leaf.', timing: 'When new flush begins — watch for light green growth', effectiveness: 'high' },
      { name: 'Horticultural oil', type: 'organic', howTo: 'Suffocates eggs and young larvae on leaf surfaces.', timing: 'When new flush starts', effectiveness: 'moderate' },
      { name: 'Do nothing (mature trees)', type: 'cultural', howTo: 'Healthy mature citrus tolerates leaf miner with no yield loss. Focus efforts on young trees.', timing: 'Ongoing', effectiveness: 'moderate' },
    ],
    prevention: [
      'Avoid pruning citrus in summer — it forces new flush, which is the target.',
      'Time fertilizing so new flushes happen in winter (Jan–Feb) when miner pressure is lowest.',
      'On young trees, protect every flush until the tree is established (3+ years).',
    ],
    zone9bNotes: 'Present year-round in 9b but worst Jul–Oct when multiple flushes coincide. Your Meyer lemon will get it — focus on protecting the spring flush and accept cosmetic damage on summer flush. Young trees under 3 years need aggressive spinosad protection on every flush.',
  },

  {
    commonName: 'Cabbage worm / Cabbage looper',
    scientificName: 'Pieris rapae (imported cabbage worm) / Trichoplusia ni (cabbage looper)',
    type: 'insect',
    description: 'Green caterpillars that eat holes in brassica leaves. The white butterfly (cabbage moth) fluttering around your kale is laying eggs.',
    identification: ['Green caterpillars on brassica leaves (1–1.5" long)', 'Ragged holes chewed in leaves', 'Dark green frass (droppings) on leaves', 'White butterflies with black spots hovering around beds', 'Tiny yellow eggs on leaf undersides'],
    affectedPlants: ['Kale', 'Broccoli', 'Cauliflower', 'Cabbage', 'Brussels sprouts', 'Collards', 'Kohlrabi'],
    severity: 'serious',
    peakSeason9b: ['fall', 'winter', 'spring'],
    lifecycle: 'Butterfly lays eggs on leaf undersides; larvae feed 2–3 weeks; pupate; adults emerge in 10 days. 3–5 generations/year in 9b.',
    damage: ['Holes in leaves → reduced photosynthesis and marketability', 'Bore into broccoli/cauliflower heads', 'Contaminate harvest with frass', 'Can defoliate young plants'],
    treatments: [
      { name: 'BT (Bacillus thuringiensis var. kurstaki)', type: 'biological', howTo: 'Spray on leaves; caterpillars eat it and stop feeding within hours, die in 2–3 days. Harmless to everything else.', timing: 'When caterpillars are small; reapply after rain', effectiveness: 'high' },
      { name: 'Row cover (floating)', type: 'mechanical', howTo: 'Cover brassica beds with lightweight fabric immediately after transplant. Prevents moth from laying eggs.', timing: 'At planting through harvest', effectiveness: 'high' },
      { name: 'Hand-pick', type: 'mechanical', howTo: 'Check undersides daily; squish eggs and caterpillars.', timing: 'Morning', effectiveness: 'moderate' },
      { name: 'Spinosad', type: 'organic', howTo: 'Effective if BT isn\'t working (rare); spray at dusk to protect bees.', timing: 'Evening', effectiveness: 'high' },
    ],
    prevention: [
      'Interplant with alliums (onion, garlic) — confuses the cabbage moth.',
      'Plant nasturtiums as trap crops — moths lay on nasturtiums first.',
      'Encourage parasitic wasps (Cotesia glomerata) with small-flowered herbs (dill, alyssum).',
      'Rotate brassica beds yearly.',
    ],
    zone9bNotes: 'In 9b you grow brassicas in cool season (Sep–Mar), which is exactly when these pests are active. BT is your single best tool — spray weekly once you see white butterflies. Row cover is even better if you can set it up. They don\'t go away; they\'re a tax on growing brassicas.',
  },

  {
    commonName: 'Slugs and snails',
    type: 'mollusk',
    description: 'Nocturnal feeders that rasp holes in leaves and fruit, leaving silvery slime trails. Thrive in moist, mild 9b conditions.',
    identification: ['Irregular holes in leaves (not along edges like caterpillars)', 'Silvery slime trails on leaves, beds, and paths', 'Missing seedlings overnight', 'Damage worse after rain or watering', 'Found under boards/pots/mulch during the day'],
    affectedPlants: ['Lettuce', 'Strawberry', 'Basil', 'Seedlings of almost everything', 'Hostas', 'Marigold seedlings'],
    severity: 'moderate',
    peakSeason9b: ['winter', 'spring'],
    lifecycle: 'Lay clusters of translucent eggs in moist soil. Juveniles grow slowly. One snail can lay 400+ eggs/year. Active at night and on overcast/rainy days.',
    damage: ['Eat seedlings entirely', 'Rasp holes in mature leaves', 'Damage strawberry fruit', 'Introduce bacterial/fungal pathogens through feeding wounds'],
    treatments: [
      { name: 'Iron phosphate bait (Sluggo)', type: 'organic', howTo: 'Scatter pellets around affected beds. Safe for pets, wildlife, and edibles. Re-apply after rain.', timing: 'Evening, near damage', effectiveness: 'high' },
      { name: 'Copper tape', type: 'mechanical', howTo: 'Ring raised bed tops with copper tape — gives a mild electric shock on contact. Works well on metal beds.', timing: 'Permanent install', effectiveness: 'moderate' },
      { name: 'Beer traps', type: 'mechanical', howTo: 'Bury cups level with soil, fill with cheap beer. Slugs fall in and drown.', timing: 'Evening', effectiveness: 'moderate' },
      { name: 'Hand-pick at night', type: 'mechanical', howTo: 'Go out with a headlamp 1–2 hrs after dark; collect and dispose.', timing: '9–11pm', effectiveness: 'moderate' },
    ],
    prevention: [
      'Water in the morning, not evening — dry soil surface at night deters slugs.',
      'Reduce hiding spots: clear debris, boards, and thick mulch near vulnerable plants.',
      'Encourage predators: ground beetles, toads, garter snakes.',
      'Copper tape around Vego bed rims is a great permanent deterrent.',
      'Start seedlings indoors and transplant when large enough to survive nibbling.',
    ],
    zone9bNotes: 'Mild, moist 9b winters are slug paradise. Worst Dec–Mar during rains. Your white Vego beds are actually helpful — copper tape adheres perfectly to the top rail, creating a permanent barrier. Iron phosphate bait (Sluggo) is the standard; it\'s OMRI-listed and safe around food.',
  },

  {
    commonName: 'Powdery mildew',
    type: 'disease_fungal',
    description: 'White/gray powdery coating on leaf surfaces. Thrives in warm days + cool nights with moderate humidity — classic 9b fall conditions.',
    identification: ['White powdery spots/patches on upper leaf surfaces', 'Starts small, spreads to cover entire leaves', 'Affected leaves yellow and drop', 'Common on squash, cucumber, rose, and grape'],
    affectedPlants: ['Squash', 'Cucumber', 'Melon', 'Rose', 'Grape', 'Zucchini', 'Pea'],
    severity: 'moderate',
    peakSeason9b: ['fall', 'spring'],
    lifecycle: 'Fungal spores spread by wind. Germinate in warm (60–80°F), dry conditions on leaf surfaces (unlike most fungi, does NOT need wet leaves). Multiplies rapidly.',
    damage: ['Reduces photosynthesis → lower yield', 'Weakens plants', 'Cosmetically ugly', 'Rarely kills but shortens productive life of cucurbits'],
    treatments: [
      { name: 'Potassium bicarbonate spray', type: 'organic', howTo: '1 tbsp potassium bicarbonate + 1 tbsp oil + 1 gal water. Spray every 7 days. Changes leaf pH to inhibit fungus.', timing: 'At first sign', effectiveness: 'high' },
      { name: 'Milk spray', type: 'organic', howTo: '40% milk / 60% water. Spray weekly. Seriously — it works (proteins + UV create an antifungal effect).', timing: 'Morning (UV activates)', effectiveness: 'moderate' },
      { name: 'Neem oil', type: 'organic', howTo: 'Preventive spray every 10–14 days. Less effective as a cure.', timing: 'Before infection starts', effectiveness: 'moderate' },
      { name: 'Sulfur spray', type: 'organic', howTo: 'Wettable sulfur applied early in the season. Do NOT use when temps >90°F (burns leaves).', timing: 'Cool weather only', effectiveness: 'high' },
    ],
    prevention: [
      'Good air circulation — don\'t crowd plants.',
      'Water at the base, not overhead (keeps foliage dry, though PM doesn\'t need wet leaves to germinate).',
      'Choose resistant varieties when available (PM-resistant zucchini exists).',
      'Remove and trash affected leaves immediately — don\'t compost.',
      'Prune interior growth for airflow on squash/cucumbers.',
    ],
    zone9bNotes: 'In 9b, powdery mildew arrives like clockwork in Sep–Oct on summer squash and cucumbers. It\'s the signal your cucurbit season is ending. Start preventive sprays in August. Late-season zucchini: accept it, harvest what you can, pull the plant, and sow cool-season crops.',
  },

  {
    commonName: 'Peach leaf curl',
    type: 'disease_fungal',
    scientificName: 'Taphrina deformans',
    description: 'Fungal disease causing dramatic red/pink puckered, curled leaves on peach and nectarine in spring. Preventable but not curable once symptoms appear.',
    identification: ['Thickened, puckered, curled leaves — often red, pink, or yellow', 'Leaves distorted and blistered', 'Appears in early spring as leaves emerge', 'Eventually leaves drop; tree pushes new (healthy) growth'],
    affectedPlants: ['Peach', 'Nectarine', 'Occasionally almond'],
    severity: 'serious',
    peakSeason9b: ['spring'],
    lifecycle: 'Fungal spores overwinter on bark and bud scales. In cool, wet spring weather, spores infect emerging leaves. Once leaves are fully unfurled and temps exceed 80°F, infection stops for the season.',
    damage: ['Defoliation weakens tree', 'Reduced fruit set', 'Repeated years exhaust tree reserves', 'Cosmetically alarming but rarely kills an established tree'],
    treatments: [
      { name: 'Copper fungicide (dormant)', type: 'organic', howTo: 'Spray entire tree (bark, branches, buds) with fixed copper (Bordeaux or copper hydroxide). Two applications: first in Dec after leaf drop, second in Jan before bud swell.', timing: 'DORMANT only — Dec and Jan. Too late once buds open.', effectiveness: 'high' },
      { name: 'Synthetic fungicide (chlorothalonil)', type: 'cultural', howTo: 'Alternative to copper. Same timing.', timing: 'Dormant', effectiveness: 'high' },
      { name: 'No cure once symptoms appear', type: 'cultural', howTo: 'If you missed the spray window, let the tree push through. It will drop infected leaves and grow new ones. Feed lightly and water well to support recovery.', timing: 'Spring', effectiveness: 'low' },
    ],
    prevention: [
      'TWO dormant sprays per year — Dec + Jan. This is the ONLY effective strategy.',
      'Remove and dispose of fallen infected leaves.',
      'Choose resistant varieties if possible (Frost, Indian Free).',
      'A dry winter = less infection; a wet winter = worse. Spray regardless.',
    ],
    zone9bNotes: 'The #1 stone fruit disease in 9b. Every peach/nectarine grower who skips the dormant spray learns this lesson exactly once. Your Babcock peach WILL get it without Dec + Jan copper sprays. Mark those dates. It\'s the single most important maintenance task for stone fruit in SoCal.',
  },
];

// ============================================================
// Helpers
// ============================================================
export function getPest(name: string): PestProfile | undefined {
  return PEST_ENCYCLOPEDIA.find(p => p.commonName.toLowerCase() === name.toLowerCase());
}
export function pestsForPlant(plant: string): PestProfile[] {
  const p = plant.toLowerCase();
  return PEST_ENCYCLOPEDIA.filter(pest => pest.affectedPlants.some(a => a.toLowerCase().includes(p)));
}
export function pestsBySeason(season: Season): PestProfile[] {
  return PEST_ENCYCLOPEDIA.filter(p => p.peakSeason9b.includes(season));
}

// ---- DEMO ----
function demo() {
  console.log(`\n🐛  9B PEST ENCYCLOPEDIA — ${PEST_ENCYCLOPEDIA.length} profiles\n`);
  for (const p of PEST_ENCYCLOPEDIA) {
    console.log(`  ${p.commonName} (${p.type}) — ${p.severity}`);
    console.log(`     Peak 9b: ${p.peakSeason9b.join(', ')}`);
    console.log(`     Targets: ${p.affectedPlants.slice(0, 4).join(', ')}`);
    console.log(`     Best treatment: ${p.treatments[0].name} (${p.treatments[0].effectiveness})`);
    console.log(`     9b note: ${p.zone9bNotes.slice(0, 80)}…\n`);
  }
  console.log(`  🔍 Pests for "strawberry":`);
  pestsForPlant('strawberry').forEach(p => console.log(`     → ${p.commonName}`));
  console.log(`\n  🔍 Summer pests:`);
  pestsBySeason('summer').forEach(p => console.log(`     → ${p.commonName}`));
  console.log('');
}
demo();
