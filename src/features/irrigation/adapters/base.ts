// ============================================================
// adapters/base.ts — the universal contract every controller implements.
// Write the brain once; each vendor is just an adapter behind this interface.
// ============================================================

export type Vendor = 'rachio' | 'bhyve' | 'rainmachine' | 'opensprinkler' | 'netro';
export type ConnType = 'cloud' | 'local';
export type AuthType = 'apiKey' | 'cloudAccount' | 'localToken' | 'localPassword';

export interface DeviceZone { vendorZoneId: string; name: string; enabled: boolean; }
export interface DeviceStatus { online: boolean; rainSensorActive?: boolean; activeZoneId?: string | null; }
export interface AdapterResult { ok: boolean; vendor: Vendor; action: string; detail: string; raw?: unknown; }

export interface AdapterCapabilities {
  connType: ConnType;
  authType: AuthType;
  sequential: boolean;        // device runs one zone at a time
  hasRainSensor: boolean;
  maxZones: number;
  supportsZoneStop: boolean;  // can stop a single zone (vs whole device)
}

export interface AdapterCredentials {
  apiKey?: string;
  token?: string;             // session/access token (cloud account or local)
  baseUrl?: string;           // local devices: http://192.168.x.x
  deviceId?: string;
  password?: string;          // OpenSprinkler md5 / RainMachine pwd
  email?: string;
}

// Transport is injected so the same adapter runs against real HTTP or a mock.
export interface HttpRequest { method: string; url: string; headers?: Record<string, string>; body?: unknown; }
export interface HttpResponse { status: number; json: any; }
export interface Transport { request(req: HttpRequest): Promise<HttpResponse>; }

export interface IrrigationAdapter {
  readonly vendor: Vendor;
  readonly capabilities: AdapterCapabilities;
  listZones(): Promise<DeviceZone[]>;
  startZone(vendorZoneId: string, seconds: number): Promise<AdapterResult>;
  stopZone(vendorZoneId: string): Promise<AdapterResult>;
  stopAll(): Promise<AdapterResult>;
  getStatus(): Promise<DeviceStatus>;
}

// ---- Real transport (production): thin wrapper over fetch ----
export class FetchTransport implements Transport {
  async request(req: HttpRequest): Promise<HttpResponse> {
    const res = await fetch(req.url, {
      method: req.method,
      headers: { 'content-type': 'application/json', ...(req.headers ?? {}) },
      body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
    });
    let json: any = null;
    try { json = await res.json(); } catch { /* some endpoints return text */ }
    return { status: res.status, json };
  }
}

// ---- Mock transport (tests/demo): logs calls, returns canned data, can fail ----
export class MockTransport implements Transport {
  log: HttpRequest[] = [];
  failOn: (req: HttpRequest) => boolean;
  zones: DeviceZone[];
  constructor(opts?: { failOn?: (req: HttpRequest) => boolean; zones?: DeviceZone[] }) {
    this.failOn = opts?.failOn ?? (() => false);
    this.zones = opts?.zones ?? [
      { vendorZoneId: '1', name: 'Front drip', enabled: true },
      { vendorZoneId: '2', name: 'Back drip', enabled: true },
    ];
  }
  async request(req: HttpRequest): Promise<HttpResponse> {
    this.log.push(req);
    if (this.failOn(req)) return { status: 500, json: { error: 'simulated device fault' } };
    if (/zone|station|info|jn|device/i.test(req.url) && req.method === 'GET')
      return { status: 200, json: { zones: this.zones, online: true, rainSensorActive: false } };
    return { status: 200, json: { ok: true } };
  }
}
