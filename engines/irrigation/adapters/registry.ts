// ============================================================
// adapters/registry.ts — the "click your controller and boom" layer.
// `CONTROLLER_CATALOG` drives the picker UI; `createAdapter` wires the
// chosen vendor to credentials + transport. Add a vendor here and it's
// instantly selectable everywhere — the brain never changes.
// ============================================================
import type { Vendor, AdapterCredentials, Transport, IrrigationAdapter } from './base.ts';
import { FetchTransport } from './base.ts';
import { RachioAdapter, BhyveAdapter, RainMachineAdapter, OpenSprinklerAdapter, NetroAdapter } from './vendors.ts';

export interface CredField { key: keyof AdapterCredentials; label: string; secret?: boolean; placeholder?: string; }
export interface CatalogEntry {
  vendor: Vendor; label: string; connType: 'cloud' | 'local'; setupHint: string; fields: CredField[];
}

export const CONTROLLER_CATALOG: CatalogEntry[] = [
  {
    vendor: 'rachio', label: 'Rachio', connType: 'cloud',
    setupHint: 'Get your API key in the Rachio app → Account → API. Then we auto-detect your zones.',
    fields: [
      { key: 'apiKey', label: 'API Key', secret: true, placeholder: 'rachio-xxxx' },
      { key: 'deviceId', label: 'Device ID', placeholder: 'auto-detected after key' },
    ],
  },
  {
    vendor: 'bhyve', label: 'Orbit B-hyve', connType: 'cloud',
    setupHint: 'Sign in with your B-hyve account; we hold a session token, never your password.',
    fields: [
      { key: 'email', label: 'B-hyve Email' },
      { key: 'token', label: 'Session Token', secret: true },
      { key: 'deviceId', label: 'Device ID', placeholder: 'auto-detected' },
    ],
  },
  {
    vendor: 'rainmachine', label: 'RainMachine', connType: 'local',
    setupHint: 'Local network device — enter its IP. Pairing returns an access token. Works without internet.',
    fields: [
      { key: 'baseUrl', label: 'Device URL', placeholder: 'https://192.168.1.50:8080' },
      { key: 'token', label: 'Access Token', secret: true },
    ],
  },
  {
    vendor: 'opensprinkler', label: 'OpenSprinkler', connType: 'local',
    setupHint: 'Open-source local controller. Enter its IP and the md5 hash of your device password.',
    fields: [
      { key: 'baseUrl', label: 'Device URL', placeholder: 'http://192.168.1.60' },
      { key: 'password', label: 'Password (md5)', secret: true },
    ],
  },
  {
    vendor: 'netro', label: 'Netro (Whisperer/Sprite)', connType: 'cloud',
    setupHint: 'Grab the device key from the Netro app → Settings → API. Solar-powered, cloud-controlled.',
    fields: [{ key: 'apiKey', label: 'Device Key', secret: true }],
  },
];

// Factory: pick a vendor, hand it creds + (optional) transport, get a working brain.
export function createAdapter(
  vendor: Vendor, creds: AdapterCredentials, transport: Transport = new FetchTransport(),
): IrrigationAdapter {
  switch (vendor) {
    case 'rachio':        return new RachioAdapter(creds, transport);
    case 'bhyve':         return new BhyveAdapter(creds, transport);
    case 'rainmachine':   return new RainMachineAdapter(creds, transport);
    case 'opensprinkler': return new OpenSprinklerAdapter(creds, transport);
    case 'netro':         return new NetroAdapter(creds, transport);
    default: throw new Error(`Unknown controller: ${vendor}`);
  }
}
