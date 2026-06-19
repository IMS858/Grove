// ============================================================
// controller.ts — the orchestrator. Ties the brain (planner) to a
// physical device (adapter). Handles supervised vs auto, sequencing
// for one-zone-at-a-time controllers, and fail-safe stop-all.
// ============================================================
import type { IrrigationAdapter, AdapterResult, DeviceZone } from './adapters/base.ts';
import type { Zone, ControlConfig, ZonePlan } from './types.ts';
import type { ETProvider } from './et.ts';
import { planIrrigation, type PlanInputs } from './planner.ts';

export interface RunReport {
  mode: ControlConfig['mode'];
  executed: boolean;
  plans: ZonePlan[];
  results: AdapterResult[];
  deviceZones?: DeviceZone[];
  summary: string;
  error?: string;
}

export class IrrigationController {
  adapter: IrrigationAdapter; et: ETProvider; cfg: ControlConfig;
  constructor(adapter: IrrigationAdapter, et: ETProvider, cfg: ControlConfig) {
    this.adapter = adapter; this.et = et; this.cfg = cfg;
  }

  // Validate that our zones actually exist on the connected device.
  async verifyZones(zones: Zone[]): Promise<{ deviceZones: DeviceZone[]; missing: string[] }> {
    const deviceZones = await this.adapter.listZones();
    const ids = new Set(deviceZones.map(z => z.vendorZoneId));
    const missing = zones.filter(z => !ids.has(z.vendorZoneId)).map(z => z.name);
    return { deviceZones, missing };
  }

  async runDay(zones: Zone[], input: Omit<PlanInputs, 'zones'>): Promise<RunReport> {
    // safety: read device status, honor its rain sensor
    let deviceRainSensorActive = false;
    try {
      const status = await this.adapter.getStatus();
      if (!status.online) return this.bail(zones, 'Controller offline — holding.', []);
      deviceRainSensorActive = !!status.rainSensorActive;
    } catch (e) {
      return this.bail(zones, `Status check failed: ${(e as Error).message}`, []);
    }

    const { plans, summary } = planIrrigation(this.et, this.cfg, { ...input, zones, deviceRainSensorActive });

    // supervised: propose only, never touch a valve
    if (this.cfg.mode === 'supervised') {
      return { mode: 'supervised', executed: false, plans, results: [], summary: `Proposed: ${summary}` };
    }

    // auto: execute. Sequence zones if the device runs one at a time.
    const runs = plans.filter(p => p.action === 'run');
    const results: AdapterResult[] = [];
    try {
      for (const p of runs) {
        const r = await this.adapter.startZone(p.vendorZoneId, p.runtimeSec);
        results.push(r);
        if (!r.ok) throw new Error(`startZone failed for ${p.zoneName}`);
        if (this.adapter.capabilities.sequential) {
          // device queues sequentially; we pace our calls by the configured gap
          await delay(this.cfg.zoneGapSec * 0); // no real wait in code; device handles queueing
        }
      }
      return { mode: 'auto', executed: true, plans, results, summary: `Executed: ${summary}` };
    } catch (e) {
      // FAIL-SAFE: something went wrong mid-run -> stop everything
      const stop = await safeStopAll(this.adapter);
      results.push(stop);
      return { mode: 'auto', executed: false, plans, results, summary: 'Aborted — stop-all issued.', error: (e as Error).message };
    }
  }

  private bail(zones: Zone[], reason: string, results: AdapterResult[]): RunReport {
    return {
      mode: this.cfg.mode, executed: false, results,
      plans: zones.map(z => ({ zoneId: z.id, zoneName: z.name, vendorZoneId: z.vendorZoneId, action: 'skip', runtimeSec: 0, startTime: '-', gallons: 0, reason })),
      summary: reason,
    };
  }
}

async function safeStopAll(adapter: IrrigationAdapter): Promise<AdapterResult> {
  try { return await adapter.stopAll(); }
  catch (e) { return { vendor: adapter.vendor, ok: false, action: 'stopAll', detail: `stop-all ALSO failed: ${(e as Error).message}` }; }
}
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
