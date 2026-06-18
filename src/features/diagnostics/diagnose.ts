// ============================================================
// diagnose.ts — 9B GrowOS AI diagnostics pipeline
// photo(s) + garden context -> structured diagnosis -> tasks
// that feed straight back into taskEngine. Closes the loop.
//
// Run:  node --experimental-strip-types diagnose.ts
// ============================================================

type Severity = 'low' | 'moderate' | 'high' | 'critical';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface PlantContext {
  id: string; name: string; crop: string; stage: string;
  bedColor?: string; sun?: string;
  recent?: { lastFeed?: string; lastWater?: string; soilMix?: string };
}
interface DiagnoseInput {
  photoPaths: string[];        // Supabase Storage paths
  plant?: PlantContext;
  symptomText?: string;
}
interface Action { step: string; detail: string; }
interface Diagnosis {
  likelyProblem: string;
  confidence: number;          // 0..1
  severity: Severity;
  priority: Priority;
  causes: string[];
  actions: Action[];
  alternatives?: string[];     // populated when confidence is low
  model: string;
}
// Same shape the task engine consumes, so diagnoses become tasks.
interface Task {
  title: string; category: 'pest' | 'feed' | 'water' | 'ph' | 'observe' | 'soil';
  priority: Priority; targetId: string; targetName: string;
  due: string; estMinutes: number; source: 'ai'; sourceRef: string; why: string;
}

// ---------- 1. Prompt (the horticulturist-tuned, 9b-aware part) ----------
function buildPrompt(input: DiagnoseInput): { system: string; user: string } {
  const p = input.plant;
  const ctx = p
    ? `Plant: ${p.name} (${p.crop}, stage ${p.stage}). ` +
      `Bed: ${p.bedColor ?? 'unknown'} raised metal, ${p.sun ?? 'unknown'} exposure. ` +
      `Soil mix: ${p.recent?.soilMix ?? 'raised-bed blend'}. ` +
      `Last fed ${p.recent?.lastFeed ?? 'unknown'}, last watered ${p.recent?.lastWater ?? 'unknown'}.`
    : 'No plant context provided.';
  return {
    system:
      'You are a horticulture diagnostician specializing in USDA Zone 9b / Southern California ' +
      'raised-bed gardens. Distinguish nutrient deficiencies (N,P,K,Ca,Mg), heat/water stress, ' +
      'fungal/bacterial disease, and pest damage. Account for fast-draining raised metal beds and ' +
      'intense summer heat. Respond ONLY with JSON matching the schema. If unsure, lower confidence ' +
      'and list alternatives rather than guessing. Never recommend restricted/illegal chemicals.',
    user:
      `${ctx}\nGardener note: "${input.symptomText ?? '(none)'}"\n` +
      `Analyze the ${input.photoPaths.length} attached photo(s). Return JSON: ` +
      `{likelyProblem, confidence(0-1), severity(low|moderate|high|critical), ` +
      `priority(low|medium|high|urgent), causes[], actions[{step,detail}], alternatives[]}.`,
  };
}

// ---------- 2. Model call ----------
// PROD: POST to OpenAI Vision (see blueprint API pattern). Here we stub it so
// the pipeline runs offline. Swap `mockVision` for the real fetch.
async function callVision(prompt: { system: string; user: string }, photoPaths: string[]): Promise<string> {
  // return await realOpenAIVision(prompt, photoPaths);  // <- production
  return mockVision(prompt, photoPaths);
}

function mockVision(prompt: { system: string; user: string }, _paths: string[]): string {
  // Simulate the model keying off the gardener's note for the demo.
  const note = prompt.user.toLowerCase();
  if (note.includes('yellow') && note.includes('vein')) {
    return JSON.stringify({
      likelyProblem: 'Magnesium deficiency',
      confidence: 0.74, severity: 'moderate', priority: 'high',
      causes: ['Leaching in fast-draining raised mix', 'Heavy fruiting demand', 'Summer heat + frequent watering'],
      actions: [
        { step: 'Foliar Epsom salt', detail: '1 tbsp/gal, spray leaves early AM, repeat in 10 days' },
        { step: 'Recheck in 7 days', detail: 'Look for new growth greening; older leaves stay marked' },
        { step: 'Ease off watering frequency', detail: 'Let top inch dry to reduce further leaching' },
      ],
      alternatives: [],
    });
  }
  if (note.includes('web') || note.includes('speckl') || note.includes('mite')) {
    return JSON.stringify({
      likelyProblem: 'Spider mites', confidence: 0.81, severity: 'high', priority: 'high',
      causes: ['Hot, dry conditions', 'Dusty foliage'],
      actions: [
        { step: 'Strong water spray to undersides', detail: 'Knock down population, repeat every 2–3 days' },
        { step: 'Insecticidal soap or horticultural oil', detail: 'Cover leaf undersides, avoid midday heat' },
      ],
      alternatives: [],
    });
  }
  // Ambiguous -> low confidence with alternatives (tests the reframe path)
  return JSON.stringify({
    likelyProblem: 'Early heat stress', confidence: 0.41, severity: 'low', priority: 'medium',
    causes: ['Recent high temps', 'Possible underwatering'],
    actions: [{ step: 'Deep water + observe', detail: 'Check again at dusk after a deep soak' }],
    alternatives: ['Nitrogen deficiency', 'Transplant shock'],
  });
}

// ---------- 3. Parse + validate + low-confidence reframe ----------
function parseDiagnosis(raw: string, model: string): Diagnosis {
  let d: any;
  try { d = JSON.parse(raw.replace(/```json|```/g, '').trim()); }
  catch { throw new Error('Model did not return valid JSON'); }

  const sev: Severity[] = ['low', 'moderate', 'high', 'critical'];
  const pri: Priority[] = ['low', 'medium', 'high', 'urgent'];
  const diag: Diagnosis = {
    likelyProblem: String(d.likelyProblem ?? 'Unclear'),
    confidence: Math.max(0, Math.min(1, Number(d.confidence ?? 0))),
    severity: sev.includes(d.severity) ? d.severity : 'low',
    priority: pri.includes(d.priority) ? d.priority : 'medium',
    causes: Array.isArray(d.causes) ? d.causes.slice(0, 5).map(String) : [],
    actions: Array.isArray(d.actions) ? d.actions.slice(0, 5).map((a: any) => ({ step: String(a.step), detail: String(a.detail) })) : [],
    alternatives: Array.isArray(d.alternatives) ? d.alternatives.map(String) : [],
    model,
  };
  // Never assert false certainty.
  if (diag.confidence < 0.5) {
    diag.likelyProblem = `Not certain — most likely ${diag.likelyProblem}`;
    diag.priority = diag.priority === 'urgent' ? 'high' : diag.priority;
  }
  return diag;
}

// ---------- 4. Diagnosis -> tasks (feeds back into taskEngine) ----------
function diagnosisToTasks(diag: Diagnosis, diagnosisId: string, plant?: PlantContext, today = isoToday()): Task[] {
  if (!plant) return [];
  const cat: Task['category'] =
    /deficien|magnes|nitro|phosph|potass|calc/i.test(diag.likelyProblem) ? 'feed'
    : /mite|aphid|pest|whitefly|scale|miner/i.test(diag.likelyProblem) ? 'pest'
    : /fungal|mildew|rot|blight/i.test(diag.likelyProblem) ? 'observe'
    : /heat|water|drought/i.test(diag.likelyProblem) ? 'water' : 'observe';

  return diag.actions.map((a, i) => ({
    title: `${a.step} — ${plant.name}`,
    category: cat,
    priority: i === 0 ? diag.priority : 'medium',
    targetId: plant.id, targetName: plant.name,
    due: today, estMinutes: 6, source: 'ai', sourceRef: diagnosisId,
    why: `From diagnosis: ${diag.likelyProblem} (${Math.round(diag.confidence * 100)}%). ${a.detail}`,
  }));
}

function isoToday() { return new Date().toISOString().slice(0, 10); }

// ---------- Orchestrator ----------
export async function diagnose(input: DiagnoseInput): Promise<{ diagnosis: Diagnosis; tasks: Task[] }> {
  const prompt = buildPrompt(input);
  const raw = await callVision(prompt, input.photoPaths);
  const diagnosis = parseDiagnosis(raw, 'mock-vision-1');
  const diagnosisId = 'diag-' + Math.random().toString(36).slice(2, 8);
  // PROD: insert into ai_diagnoses here.
  const tasks = diagnosisToTasks(diagnosis, diagnosisId, input.plant);
  return { diagnosis, tasks };
}

// ============================================================
// DEMO
// ============================================================
async function demo() {
  const cases: DiagnoseInput[] = [
    {
      photoPaths: ['uid/pl-1/leaf1.jpg'],
      symptomText: 'older leaves yellowing between the veins, veins stay green',
      plant: { id: 'pl-1', name: "'Sungold' tomato", crop: 'fruiting_veg', stage: 'fruiting',
               bedColor: 'pearl_white', sun: 'full_sun', recent: { soilMix: 'raised-bed blend', lastFeed: '2026-05-01' } },
    },
    {
      photoPaths: ['uid/pl-4/leaf2.jpg'],
      symptomText: 'fine webbing and speckled leaves on the strawberries',
      plant: { id: 'pl-4', name: 'Albion strawberry', crop: 'berry', stage: 'fruiting', sun: 'full_sun' },
    },
    {
      photoPaths: ['uid/pl-3/leaf3.jpg'],
      symptomText: 'leaves look a bit off, not sure',
      plant: { id: 'pl-3', name: 'Romaine lettuce', crop: 'leafy', stage: 'vegetative', sun: 'part_shade' },
    },
  ];

  for (const c of cases) {
    const { diagnosis: d, tasks } = await diagnose(c);
    const bar = '▓'.repeat(Math.round(d.confidence * 10)) + '░'.repeat(10 - Math.round(d.confidence * 10));
    console.log(`\n📷  ${c.plant!.name}  —  note: "${c.symptomText}"`);
    console.log(`    → ${d.likelyProblem}`);
    console.log(`    confidence ${bar} ${Math.round(d.confidence * 100)}%   severity ${d.severity}   priority ${d.priority}`);
    if (d.alternatives?.length) console.log(`    also possible: ${d.alternatives.join(', ')}`);
    console.log(`    causes: ${d.causes.join('; ')}`);
    console.log(`    → generated ${tasks.length} task(s):`);
    tasks.forEach(t => console.log(`        • [${t.priority}] ${t.title}`));
  }
  console.log('');
}
demo();
