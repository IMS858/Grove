// ============================================================
// adapters/vendors.ts — concrete adapters for the top 5 controllers.
// API shapes modeled from each vendor's public docs; VERIFY endpoints
// against current vendor docs before shipping (they drift).
// ============================================================
import type {
  IrrigationAdapter, AdapterCapabilities, AdapterCredentials, AdapterResult,
  DeviceStatus, DeviceZone, Transport, Vendor,
} from './base.ts';

function res(vendor: Vendor, ok: boolean, action: string, detail: string, raw?: unknown): AdapterResult {
  return { vendor, ok, action, detail, raw };
}

// ---------- 1) Rachio (cloud, API key) ----------
export class RachioAdapter implements IrrigationAdapter {
  readonly vendor: Vendor = 'rachio';
  readonly capabilities: AdapterCapabilities = {
    connType: 'cloud', authType: 'apiKey', sequential: true,
    hasRainSensor: true, maxZones: 16, supportsZoneStop: false,
  };
  base = 'https://api.rach.io/1/public';
  t: Transport; creds: AdapterCredentials;
  constructor(creds: AdapterCredentials, transport: Transport) { this.creds = creds; this.t = transport; }
  private auth() { return { authorization: `Bearer ${this.creds.apiKey ?? ''}` }; }

  async listZones(): Promise<DeviceZone[]> {
    const r = await this.t.request({ method: 'GET', url: `${this.base}/device/${this.creds.deviceId}`, headers: this.auth() });
    const zones = r.json?.zones ?? [];
    return zones.map((z: any) => ({ vendorZoneId: String(z.id ?? z.vendorZoneId), name: z.name ?? `Zone ${z.zoneNumber}`, enabled: z.enabled !== false }));
  }
  async startZone(id: string, seconds: number): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'PUT', url: `${this.base}/zone/start`, headers: this.auth(), body: { id, duration: seconds } });
    return res('rachio', r.status < 300, 'startZone', `zone ${id} for ${seconds}s`, r.json);
  }
  async stopZone(_id: string): Promise<AdapterResult> { return this.stopAll(); } // Rachio stops at device level
  async stopAll(): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'PUT', url: `${this.base}/device/stop_water`, headers: this.auth(), body: { id: this.creds.deviceId } });
    return res('rachio', r.status < 300, 'stopAll', 'device stop_water', r.json);
  }
  async getStatus(): Promise<DeviceStatus> {
    const r = await this.t.request({ method: 'GET', url: `${this.base}/device/${this.creds.deviceId}`, headers: this.auth() });
    return { online: r.json?.status === 'ONLINE' || r.json?.online === true, rainSensorActive: !!r.json?.rainSensorTripped, activeZoneId: r.json?.activeZoneId ?? null };
  }
}

// ---------- 2) Orbit B-hyve (cloud account) ----------
export class BhyveAdapter implements IrrigationAdapter {
  readonly vendor: Vendor = 'bhyve';
  readonly capabilities: AdapterCapabilities = {
    connType: 'cloud', authType: 'cloudAccount', sequential: true,
    hasRainSensor: true, maxZones: 16, supportsZoneStop: true,
  };
  base = 'https://api.orbitbhyve.com/v1';
  t: Transport; creds: AdapterCredentials;
  constructor(creds: AdapterCredentials, transport: Transport) { this.creds = creds; this.t = transport; }
  private auth() { return { 'orbit-session-token': this.creds.token ?? '' }; }

  async listZones(): Promise<DeviceZone[]> {
    const r = await this.t.request({ method: 'GET', url: `${this.base}/devices/${this.creds.deviceId}`, headers: this.auth() });
    const zones = r.json?.zones ?? r.json?.devices?.[0]?.zones ?? [];
    return zones.map((z: any) => ({ vendorZoneId: String(z.station ?? z.vendorZoneId), name: z.name ?? `Station ${z.station}`, enabled: true }));
  }
  async startZone(id: string, seconds: number): Promise<AdapterResult> {
    const body = { event: 'change_mode', device_id: this.creds.deviceId, mode: 'manual', stations: [{ station: Number(id), run_time: Math.max(1, Math.round(seconds / 60)) }] };
    const r = await this.t.request({ method: 'POST', url: `${this.base}/devices/${this.creds.deviceId}/events`, headers: this.auth(), body });
    return res('bhyve', r.status < 300, 'startZone', `station ${id} for ${Math.round(seconds / 60)}min`, r.json);
  }
  async stopZone(_id: string): Promise<AdapterResult> { return this.stopAll(); }
  async stopAll(): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'POST', url: `${this.base}/devices/${this.creds.deviceId}/events`, headers: this.auth(), body: { event: 'change_mode', device_id: this.creds.deviceId, mode: 'auto', stations: [] } });
    return res('bhyve', r.status < 300, 'stopAll', 'mode->auto', r.json);
  }
  async getStatus(): Promise<DeviceStatus> {
    const r = await this.t.request({ method: 'GET', url: `${this.base}/devices/${this.creds.deviceId}`, headers: this.auth() });
    return { online: r.json?.is_connected !== false, rainSensorActive: !!r.json?.rain_delay, activeZoneId: null };
  }
}

// ---------- 3) RainMachine (LOCAL REST, token) ----------
export class RainMachineAdapter implements IrrigationAdapter {
  readonly vendor: Vendor = 'rainmachine';
  readonly capabilities: AdapterCapabilities = {
    connType: 'local', authType: 'localToken', sequential: true,
    hasRainSensor: true, maxZones: 16, supportsZoneStop: true,
  };
  t: Transport; creds: AdapterCredentials;
  constructor(creds: AdapterCredentials, transport: Transport) { this.creds = creds; this.t = transport; }
  private base() { return (this.creds.baseUrl ?? 'https://192.168.1.50:8080').replace(/\/$/, ''); }
  private q() { return `?access_token=${this.creds.token ?? ''}`; }

  async listZones(): Promise<DeviceZone[]> {
    const r = await this.t.request({ method: 'GET', url: `${this.base()}/api/4/zone${this.q()}` });
    const zones = r.json?.zones ?? [];
    return zones.map((z: any) => ({ vendorZoneId: String(z.uid ?? z.vendorZoneId), name: z.name ?? `Zone ${z.uid}`, enabled: z.active !== false }));
  }
  async startZone(id: string, seconds: number): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'POST', url: `${this.base()}/api/4/zone/${id}/start${this.q()}`, body: { time: seconds } });
    return res('rainmachine', r.status < 300, 'startZone', `zone ${id} for ${seconds}s`, r.json);
  }
  async stopZone(id: string): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'POST', url: `${this.base()}/api/4/zone/${id}/stop${this.q()}` });
    return res('rainmachine', r.status < 300, 'stopZone', `zone ${id}`, r.json);
  }
  async stopAll(): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'POST', url: `${this.base()}/api/4/watering/stopall${this.q()}` });
    return res('rainmachine', r.status < 300, 'stopAll', 'stopall', r.json);
  }
  async getStatus(): Promise<DeviceStatus> {
    const r = await this.t.request({ method: 'GET', url: `${this.base()}/api/4/provision/wifi${this.q()}` });
    return { online: r.status < 300, activeZoneId: null };
  }
}

// ---------- 4) OpenSprinkler (LOCAL HTTP, md5 password) ----------
export class OpenSprinklerAdapter implements IrrigationAdapter {
  readonly vendor: Vendor = 'opensprinkler';
  readonly capabilities: AdapterCapabilities = {
    connType: 'local', authType: 'localPassword', sequential: true,
    hasRainSensor: true, maxZones: 8, supportsZoneStop: true,
  };
  t: Transport; creds: AdapterCredentials;
  constructor(creds: AdapterCredentials, transport: Transport) { this.creds = creds; this.t = transport; }
  private base() { return (this.creds.baseUrl ?? 'http://192.168.1.60').replace(/\/$/, ''); }
  private pw() { return this.creds.password ?? ''; } // pass the md5 hash of the device password

  async listZones(): Promise<DeviceZone[]> {
    const r = await this.t.request({ method: 'GET', url: `${this.base()}/jn?pw=${this.pw()}` });
    const names: string[] = r.json?.snames ?? [];
    return names.length
      ? names.map((n, i) => ({ vendorZoneId: String(i), name: n || `S${i + 1}`, enabled: true }))
      : (r.json?.zones ?? []).map((z: any, i: number) => ({ vendorZoneId: String(i), name: z.name ?? `S${i + 1}`, enabled: true }));
  }
  async startZone(id: string, seconds: number): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'GET', url: `${this.base()}/cm?pw=${this.pw()}&sid=${id}&en=1&t=${seconds}` });
    return res('opensprinkler', r.status < 300, 'startZone', `sid ${id} for ${seconds}s`, r.json);
  }
  async stopZone(id: string): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'GET', url: `${this.base()}/cm?pw=${this.pw()}&sid=${id}&en=0` });
    return res('opensprinkler', r.status < 300, 'stopZone', `sid ${id}`, r.json);
  }
  async stopAll(): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'GET', url: `${this.base()}/cv?pw=${this.pw()}&rsn=1` });
    return res('opensprinkler', r.status < 300, 'stopAll', 'reset stations', r.json);
  }
  async getStatus(): Promise<DeviceStatus> {
    const r = await this.t.request({ method: 'GET', url: `${this.base()}/jc?pw=${this.pw()}` });
    return { online: r.status < 300, rainSensorActive: !!r.json?.rs, activeZoneId: null };
  }
}

// ---------- 5) Netro (cloud, API key) ----------
export class NetroAdapter implements IrrigationAdapter {
  readonly vendor: Vendor = 'netro';
  readonly capabilities: AdapterCapabilities = {
    connType: 'cloud', authType: 'apiKey', sequential: false,
    hasRainSensor: true, maxZones: 12, supportsZoneStop: false,
  };
  base = 'https://api.netrohome.com/npa/v1';
  t: Transport; creds: AdapterCredentials;
  constructor(creds: AdapterCredentials, transport: Transport) { this.creds = creds; this.t = transport; }
  private key() { return this.creds.apiKey ?? ''; }

  async listZones(): Promise<DeviceZone[]> {
    const r = await this.t.request({ method: 'GET', url: `${this.base}/info.txt?key=${this.key()}` });
    const zones = r.json?.data?.device?.zones ?? r.json?.zones ?? [];
    return zones.map((z: any) => ({ vendorZoneId: String(z.ith ?? z.vendorZoneId), name: z.name ?? `Zone ${z.ith}`, enabled: z.enabled !== false }));
  }
  async startZone(id: string, seconds: number): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'POST', url: `${this.base}/water.txt`, body: { key: this.key(), zones: [Number(id)], duration: Math.max(1, Math.round(seconds / 60)) } });
    return res('netro', r.status < 300, 'startZone', `zone ${id} for ${Math.round(seconds / 60)}min`, r.json);
  }
  async stopZone(_id: string): Promise<AdapterResult> { return this.stopAll(); }
  async stopAll(): Promise<AdapterResult> {
    const r = await this.t.request({ method: 'POST', url: `${this.base}/stop_water.txt`, body: { key: this.key() } });
    return res('netro', r.status < 300, 'stopAll', 'stop_water', r.json);
  }
  async getStatus(): Promise<DeviceStatus> {
    const r = await this.t.request({ method: 'GET', url: `${this.base}/info.txt?key=${this.key()}` });
    return { online: r.json?.status === 'OK' || r.status < 300, activeZoneId: null };
  }
}
