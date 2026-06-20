import { NextResponse } from "next/server"

// Universal irrigation proxy. Supports Rachio, Netro, and OpenSprinkler.
// Each provider's credential stays server-side per request.

// ---- RACHIO (cloud, Bearer token) ----
const RACHIO = "https://api.rach.io/1/public"
async function rachio(path: string, token: string, method = "GET", body?: any) {
  const res = await fetch(RACHIO + path, {
    method,
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const t = await res.text(); let d: any = null
  try { d = t ? JSON.parse(t) : null } catch { d = { raw: t } }
  return { ok: res.ok, status: res.status, data: d }
}

// ---- NETRO (cloud, key) ----
const NETRO = "https://api.netrohome.com/npa/v1"
async function netroGet(path: string) {
  const res = await fetch(NETRO + path)
  const d = await res.json().catch(() => null)
  return { ok: res.ok && d?.status === "OK", data: d }
}
async function netroPost(path: string, body: any) {
  const res = await fetch(NETRO + path, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const d = await res.json().catch(() => null)
  return { ok: res.ok && d?.status === "OK", data: d }
}

// ---- OPENSPRINKLER (local network, password) ----
// host like "192.168.1.50" or "192.168.1.50:8080"
async function osGet(host: string, path: string) {
  const url = (host.startsWith("http") ? host : "http://" + host) + path
  const res = await fetch(url)
  const d = await res.json().catch(() => null)
  return { ok: res.ok, data: d }
}

export async function POST(request: Request) {
  try {
    const b = await request.json()
    const provider = b.provider

    // ============ RACHIO ============
    if (provider === "rachio") {
      const token = b.token
      if (!token) return NextResponse.json({ error: "Missing Rachio API key" }, { status: 400 })
      if (b.action === "connect") {
        const who = await rachio("/person/info", token)
        if (!who.ok) return NextResponse.json({ error: "Invalid Rachio key" }, { status: 401 })
        const person = await rachio("/person/" + who.data.id, token)
        if (!person.ok) return NextResponse.json({ error: "Couldn't load account" }, { status: 400 })
        const devices = (person.data.devices || []).map((d: any) => ({
          id: d.id, name: d.name || "Controller",
          zones: (d.zones || []).filter((z: any) => z.enabled).sort((a: any, b: any) => a.zoneNumber - b.zoneNumber)
            .map((z: any) => ({ id: z.id, num: z.zoneNumber, name: z.name || ("Zone " + z.zoneNumber) })),
        }))
        return NextResponse.json({ ok: true, devices })
      }
      if (b.action === "start") {
        const r = await rachio("/zone/start", token, "PUT", { id: b.zoneId, duration: Math.max(60, Math.min(10800, b.duration || 600)) })
        return NextResponse.json({ ok: r.ok })
      }
      if (b.action === "stop") {
        const r = await rachio("/device/stop_water", token, "PUT", { id: b.deviceId })
        return NextResponse.json({ ok: r.ok })
      }
    }

    // ============ NETRO ============
    if (provider === "netro") {
      const key = b.token
      if (!key) return NextResponse.json({ error: "Missing Netro serial/key" }, { status: 400 })
      if (b.action === "connect") {
        const info = await netroGet("/info.json?key=" + encodeURIComponent(key))
        if (!info.ok) return NextResponse.json({ error: "Invalid Netro serial" }, { status: 401 })
        const dev = info.data.data?.device || {}
        const zones = (dev.zones || []).filter((z: any) => z.enabled).map((z: any) => ({
          id: z.ith, num: z.ith, name: z.name || ("Zone " + z.ith),
        }))
        return NextResponse.json({ ok: true, devices: [{ id: dev.serial || key, name: dev.name || "Netro Controller", zones }] })
      }
      if (b.action === "start") {
        // Netro water: duration in minutes, zones array
        const r = await netroPost("/water.json", { key, duration: Math.max(1, Math.min(180, Math.round((b.duration || 600) / 60))), zones: [b.zoneId] })
        return NextResponse.json({ ok: r.ok })
      }
      if (b.action === "stop") {
        const r = await netroPost("/stop_water.json", { key })
        return NextResponse.json({ ok: r.ok })
      }
    }

    // ============ OPENSPRINKLER ============
    if (provider === "opensprinkler") {
      const host = b.host, pw = b.token // pw = md5 hash or device password depending on firmware
      if (!host || !pw) return NextResponse.json({ error: "Missing host or password" }, { status: 400 })
      if (b.action === "connect") {
        // /jc = controller status, /jn = station names
        const jn = await osGet(host, "/jn?pw=" + encodeURIComponent(pw))
        if (!jn.ok || !jn.data) return NextResponse.json({ error: "Couldn't reach controller. Check IP + password (must be same network)." }, { status: 400 })
        const names = jn.data.snames || []
        const ignore = jn.data.ignore_rain || []
        const zones = names.map((nm: string, i: number) => ({ id: i, num: i + 1, name: nm || ("Station " + (i + 1)) }))
          .filter((_: any, i: number) => !(jn.data.masop && jn.data.masop[i])) // hide master stations
        return NextResponse.json({ ok: true, devices: [{ id: host, name: "OpenSprinkler", zones }] })
      }
      if (b.action === "start") {
        // /cm?pw=..&sid=ZONE&en=1&t=SECONDS
        const r = await osGet(host, "/cm?pw=" + encodeURIComponent(pw) + "&sid=" + b.zoneId + "&en=1&t=" + Math.max(60, Math.min(10800, b.duration || 600)))
        return NextResponse.json({ ok: r.ok && r.data?.result === 1 })
      }
      if (b.action === "stop") {
        // en=0 on all: use /cv?pw=..&rsn=1 (reset/stop all)
        const r = await osGet(host, "/cv?pw=" + encodeURIComponent(pw) + "&rsn=1")
        return NextResponse.json({ ok: r.ok && r.data?.result === 1 })
      }
    }

    return NextResponse.json({ error: "Unknown provider or action" }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
