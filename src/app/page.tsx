"use client"
import { useRouter } from "next/navigation"

const G = {
  bg0:"#0B110E",bg1:"#111A15",ln:"#243328",f1:"#1B4332",f2:"#2D6A4F",f3:"#40916C",
  s2:"#74B89A",s3:"#95D5B2",c2:"#FF8C42",t1:"#EDE9E3",t2:"#B8C4B0",t3:"#7A8C78",t4:"#4E5E4C",
}

function Leaf({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="40" cy="44" rx="21" ry="30" fill={G.s3} opacity=".88" transform="rotate(-15 40 44)"/>
      <ellipse cx="58" cy="47" rx="17" ry="26" fill={G.f2} opacity=".8" transform="rotate(10 58 47)"/>
      <line x1="50" y1="70" x2="50" y2="90" stroke={G.s3} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function Landing() {
  const router = useRouter()
  const font = "-apple-system,Inter,system-ui,sans-serif"

  const features = [
    { i: "🎯", t: "Daily Health Score", d: "One number tells you exactly where your garden stands." },
    { i: "✅", t: "Reactive Tasks", d: "Weather-aware to-dos that change when conditions change." },
    { i: "📷", t: "AI Diagnostics", d: "Snap a sick leaf, get the problem and the fix." },
    { i: "🤖", t: "Zone 9b Coach", d: "A garden expert that knows your plants and your climate." },
    { i: "🌱", t: "43-Plant Library", d: "Health, medicinal, and culinary uses for everything you grow." },
    { i: "💧", t: "Smart Irrigation", d: "Connect Rachio, B-hyve, and more. Water by the weather." },
  ]

  return (
    <div style={{ background: G.bg0, color: G.t1, fontFamily: font, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg,${G.f1} 0%,#081410 55%,${G.bg0} 100%)`, padding: "60px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: 88, height: 88, borderRadius: 22, background: `linear-gradient(140deg,${G.f1},${G.f2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 32px ${G.f1}88` }}>
            <Leaf size={52} />
          </div>
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 800, margin: "8px 0 4px", letterSpacing: "-1px" }}>grove</h1>
        <p style={{ color: G.s2, fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Your garden, running.</p>
        <p style={{ color: G.t2, fontSize: 15, lineHeight: 1.6, margin: "24px auto 0", maxWidth: 320 }}>
          The garden operating system that tells you exactly what to do every day — and learns from every harvest.
        </p>
        <button onClick={() => router.push("/signup")} style={{ background: G.c2, color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", width: "100%", maxWidth: 320, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 28, boxShadow: `0 4px 20px ${G.c2}44` }}>
          Get Started — Free
        </button>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => router.push("/login")} style={{ background: "none", border: "none", color: G.t3, fontSize: 13, cursor: "pointer" }}>
            Already have an account? <span style={{ color: G.s3, fontWeight: 600 }}>Log in</span>
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "32px 24px" }}>
        <div style={{ color: G.t3, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>What Grove does</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 14, background: G.bg1, borderRadius: 14, border: `1px solid ${G.ln}` }}>
              <span style={{ fontSize: 22 }}>{f.i}</span>
              <div>
                <div style={{ color: G.t1, fontSize: 14, fontWeight: 600 }}>{f.t}</div>
                <div style={{ color: G.t3, fontSize: 12, lineHeight: 1.5, marginTop: 2 }}>{f.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: "16px 24px 48px", textAlign: "center" }}>
        <div style={{ background: G.f2 + "10", border: `1px solid ${G.f2}33`, borderRadius: 16, padding: 24 }}>
          <div style={{ color: G.t1, fontSize: 17, fontWeight: 700 }}>Start growing smarter</div>
          <div style={{ color: G.t3, fontSize: 13, marginTop: 4 }}>Free to start. No credit card.</div>
          <button onClick={() => router.push("/signup")} style={{ background: G.s3, color: G.bg0, border: "none", borderRadius: 12, padding: "13px 0", width: "100%", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
            Create Your Garden
          </button>
        </div>
        <div style={{ color: G.t4, fontSize: 11, marginTop: 24 }}>🌱 Grove · Zone 9b · Southern California</div>
      </div>
    </div>
  )
}
