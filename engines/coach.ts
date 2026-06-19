// ============================================================
// engines/coach.ts — the Zone 9B AI Coach's context + prompt layer.
// Assembles garden state + 9b knowledge into a tight prompt, (mock) calls
// the model, and turns the answer into tasks that feed the task engine.
// Swap mockCoach() for the real OpenAI call (blueprint API pattern).
// Run:  node --experimental-strip-types coach.ts
// ============================================================
import { calendarForMonth, inSeasonNow, feedDueThisMonth, type CropCat } from '../data/seed9b.ts';

interface PlantLite { id: string; name: string; cropCat: CropCat; stage: string; }
interface CoachContext {
  zone: string; today: string; month: number;
  weatherNote: string;
  plants: PlantLite[];
}
interface SuggestedTask { title: string; category: string; }
interface CoachAnswer { text: string; suggestedTasks: SuggestedTask[] }

// ---------- 1. Context assembly (the part that makes it 9b-aware) ----------
export function assembleContext(today: string, plants: PlantLite[], weatherNote: string): CoachContext {
  return { zone: '9b', today, month: new Date(today).getUTCMonth() + 1, weatherNote, plants };
}

export function buildPrompt(ctx: CoachContext, question: string): { system: string; user: string } {
  const cal = calendarForMonth(ctx.month).map(c => `- ${c.action}`).join('\n') || '- (no calendar highlights)';
  const seasonal = inSeasonNow(ctx.month).map(v => `${v.commonName}${v.variety ? ` '${v.variety}'` : ''}`).join(', ') || '—';
  const feeds = ctx.plants
    .map(p => feedDueThisMonth(p.cropCat, ctx.month))
    .filter((f): f is NonNullable<typeof f> => !!f)
    .map(f => `- ${f.note}`).join('\n');
  const garden = ctx.plants.map(p => `${p.name} (${p.cropCat}, ${p.stage})`).join('; ') || 'no plants yet';

  return {
    system:
      'You are the 9B GrowOS Coach: a Zone 9b / Southern California horticulture expert. ' +
      'Answer specifically for the user\'s zone, current month, weather, and the exact plants they grow. ' +
      'Be concise and practical. End by proposing concrete tasks. Never recommend restricted chemicals.',
    user:
      `Zone: ${ctx.zone}. Month: ${ctx.month}. Weather: ${ctx.weatherNote}\n` +
      `Garden: ${garden}\n` +
      `This month in 9b:\n${cal}\n` +
      (feeds ? `Feeding due:\n${feeds}\n` : '') +
      `In season to plant now: ${seasonal}\n\n` +
      `Question: "${question}"\n` +
      `Respond as JSON: {"text": "...", "suggestedTasks":[{"title","category"}]}.`,
  };
}

// ---------- 2. Model call (mock; swap for OpenAI) ----------
async function callCoach(prompt: { system: string; user: string }): Promise<string> {
  return mockCoach(prompt.user);
}
function mockCoach(user: string): string {
  const q = user.toLowerCase();
  if (q.includes('citrus') && q.includes('fertil'))
    return JSON.stringify({
      text: 'In 9b, feed citrus three times a year — roughly February, May, and August — with a high-nitrogen citrus food. You\'re in the window now, so feed this week, water it in deeply, and keep mulch pulled back from the trunk.',
      suggestedTasks: [{ title: 'Feed Meyer lemon (citrus food)', category: 'feed' }, { title: 'Deep-water citrus after feeding', category: 'water' }],
    });
  if (q.includes('prune') && (q.includes('peach') || q.includes('stone')))
    return JSON.stringify({
      text: 'Prune peaches in winter dormancy (Dec–Jan in 9b), before bud swell. Open the center, remove crossing/vertical water sprouts, and cut back last year\'s growth by about a third to force fruiting wood. Follow with a dormant copper + oil spray for peach leaf curl.',
      suggestedTasks: [{ title: 'Dormant prune peach tree', category: 'prune' }, { title: 'Apply dormant oil + copper (leaf curl)', category: 'spray' }],
    });
  if (q.includes('after tomato') || q.includes('plant after'))
    return JSON.stringify({
      text: 'After summer tomatoes, rotate to a legume or a light feeder to rebuild the bed — bush beans fix nitrogen, or sow cool-season greens/carrots if it\'s Sept–Oct. Avoid following with peppers or eggplant (same family, shared pests).',
      suggestedTasks: [{ title: 'Sow bush beans or fall greens in Bed 3', category: 'plant' }, { title: 'Top-dress Bed 3 with compost', category: 'soil' }],
    });
  return JSON.stringify({ text: 'Tell me which plant or bed and I\'ll tailor it to your 9b conditions this month.', suggestedTasks: [] });
}

// ---------- 3. Parse + extract tasks ----------
export async function askCoach(ctx: CoachContext, question: string): Promise<CoachAnswer> {
  const prompt = buildPrompt(ctx, question);
  const raw = await callCoach(prompt);
  let parsed: any;
  try { parsed = JSON.parse(raw.replace(/```json|```/g, '').trim()); }
  catch { parsed = { text: raw, suggestedTasks: [] }; }
  return {
    text: String(parsed.text ?? ''),
    suggestedTasks: Array.isArray(parsed.suggestedTasks)
      ? parsed.suggestedTasks.map((t: any) => ({ title: String(t.title), category: String(t.category) })) : [],
  };
}

// ---------------- DEMO ----------------
async function demo() {
  const plants: PlantLite[] = [
    { id: 'pl-5', name: 'Improved Meyer lemon', cropCat: 'citrus', stage: 'vegetative' },
    { id: 'pl-1', name: "'Sungold' tomato", cropCat: 'fruiting_veg', stage: 'fruiting' },
    { id: 'pl-7', name: 'Babcock peach', cropCat: 'stone_fruit', stage: 'fruiting' },
  ];
  const ctx = assembleContext('2026-08-05', plants, '95°F, dry, light wind');

  const questions = [
    'When should I fertilize my citrus?',
    'What should I prune right now on my peach?',
    'What should I plant after tomatoes?',
  ];
  console.log(`\n🤖  ZONE 9B COACH  (month ${ctx.month}, ${ctx.weatherNote})\n`);
  for (const question of questions) {
    const ans = await askCoach(ctx, question);
    console.log(`   Q: ${question}`);
    console.log(`   A: ${ans.text}`);
    if (ans.suggestedTasks.length)
      console.log(`      + tasks: ${ans.suggestedTasks.map(t => `[${t.category}] ${t.title}`).join(' · ')}`);
    console.log('');
  }
}
demo();
