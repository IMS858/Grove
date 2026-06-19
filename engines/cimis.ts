// ============================================================
// engines/cimis.ts — pulls real reference ET (ET0) from California's
// free CIMIS network and parses it into the { date: inches } map that
// irrigation/et.ts -> CimisET consumes. Makes auto-watering accurate.
//
// Get a free appKey at https://cimis.water.ca.gov (Account → App Keys).
// Find your nearest station by lat/lon on the CIMIS station map.
//
// Run:  node --experimental-strip-types cimis.ts   (parses a sample payload)
// ============================================================

const CIMIS_BASE = 'http://et.water.ca.gov/api/data';

export interface CimisArgs {
  appKey: string;
  stationId: string;   // e.g. '173' (find your nearest on the CIMIS map)
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
}

export function buildCimisUrl(a: CimisArgs): string {
  const q = new URLSearchParams({
    appKey: a.appKey, targets: a.stationId,
    startDate: a.startDate, endDate: a.endDate,
    dataItems: 'day-asce-eto', unitOfMeasure: 'E', // 'E' = English (inches)
  });
  return `${CIMIS_BASE}?${q.toString()}`;
}

// Parse the CIMIS response into { 'YYYY-MM-DD': inchesPerDay }.
export function parseCimisET0(json: any): Record<string, number> {
  const out: Record<string, number> = {};
  const providers = json?.Data?.Providers ?? [];
  for (const p of providers) {
    for (const rec of p?.Records ?? []) {
      const date: string | undefined = rec?.Date;
      const raw = rec?.DayAsceEto?.Value;
      const val = raw == null || raw === '' ? null : Number(raw);
      if (date && val != null && !Number.isNaN(val)) out[date] = val;
    }
  }
  return out;
}

// Production fetch (swap in real fetch via globalThis.fetch).
export async function fetchCimisET0(a: CimisArgs): Promise<Record<string, number>> {
  const res = await fetch(buildCimisUrl(a));
  if (!res.ok) throw new Error(`CIMIS ${res.status}`);
  return parseCimisET0(await res.json());
}

// ---------------- DEMO (offline: parse a realistic sample) ----------------
function demo() {
  const sample = {
    Data: { Providers: [{
      Name: 'cimis', Type: 'station',
      Records: [
        { Date: '2026-07-13', Station: '173', DayAsceEto: { Value: '0.29', Unit: 'in', Qc: '' } },
        { Date: '2026-07-14', Station: '173', DayAsceEto: { Value: '0.31', Unit: 'in', Qc: '' } },
        { Date: '2026-07-15', Station: '173', DayAsceEto: { Value: '0.34', Unit: 'in', Qc: '' } },
        { Date: '2026-07-16', Station: '173', DayAsceEto: { Value: '', Unit: 'in', Qc: 'M' } }, // missing -> skipped
      ],
    }] },
  };

  console.log(`\n🌡️  CIMIS ET0 (parsed)\n`);
  console.log(`   URL: ${buildCimisUrl({ appKey: 'YOUR-KEY', stationId: '173', startDate: '2026-07-13', endDate: '2026-07-16' })}\n`);
  const byDate = parseCimisET0(sample);
  for (const [d, v] of Object.entries(byDate)) console.log(`   ${d}: ${v}"/day`);
  console.log(`\n   → feed this map to irrigation/et.ts:  new CimisET(byDate)`);
  console.log(`   → planner then uses real station ET instead of the heuristic.\n`);
}
demo();
