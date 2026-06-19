"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

const G = { bg0:"#0B110E",bg1:"#111A15",bg2:"#172119",ln:"#243328",f1:"#1B4332",f2:"#2D6A4F",f3:"#40916C",s1:"#52796F",s2:"#74B89A",s3:"#95D5B2",s4:"#D8F3DC",c2:"#FF8C42",t1:"#EDE9E3",t2:"#B8C4B0",t3:"#7A8C78",t4:"#4E5E4C",red:"#D95B5B" }

function GroveMark({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.s4} /><stop offset="100%" stopColor={G.s2} />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={G.f3} /><stop offset="100%" stopColor={G.f1} />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="44" rx="22" ry="31" fill="url(#lg1)" opacity=".92" transform="rotate(-15 40 44)" />
      <ellipse cx="58" cy="47" rx="18" ry="27" fill="url(#lg2)" opacity=".9" transform="rotate(10 58 47)" />
      <path d="M40 28 Q40 50 40 68" stroke={G.f1} strokeWidth="1" fill="none" opacity=".4" transform="rotate(-15 40 44)" />
      <line x1="50" y1="68" x2="50" y2="92" stroke={G.s3} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Login() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState("")

  async function signInPassword() {
    setLoading(true); setMsg("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setMsg(error.message)
    else router.push("/app")
  }


  const inp = (name: string): React.CSSProperties => ({
    background: "rgba(11,17,14,0.6)", color: G.t1,
    border: `1px solid ${focus === name ? G.s2 : G.ln}`,
    borderRadius: 12, padding: "13px 15px", fontSize: 14, width: "100%", boxSizing: "border-box",
    marginBottom: 11, outline: "none", transition: "border-color .2s, box-shadow .2s",
    boxShadow: focus === name ? `0 0 0 3px ${G.s2}22` : "none",
  })

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: G.bg0, fontFamily: "-apple-system,Inter,system-ui,sans-serif" }}>

      {/* ── Layered botanical backdrop ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {/* deep radial glow behind logo */}
        <div style={{ position: "absolute", top: "-15%", left: "50%", transform: "translateX(-50%)", width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(circle, ${G.f1}66 0%, transparent 62%)` }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${G.f2}33 0%, transparent 65%)` }} />

        {/* lush foliage rising from the bottom */}
        <svg viewBox="0 0 430 520" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "78%" }}>
          <defs>
            <linearGradient id="folA" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={G.f2} stopOpacity=".85" /><stop offset="100%" stopColor={G.f3} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="folB" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={G.f1} stopOpacity=".9" /><stop offset="100%" stopColor={G.f2} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* back layer - tall fronds */}
          {[20, 90, 165, 240, 320, 400].map((x, i) => (
            <g key={"b" + i} transform={`translate(${x} 520) rotate(${(i % 2 ? 1 : -1) * (6 + i * 2)})`} opacity={0.45}>
              <path d={`M0 0 Q -34 -140 0 -${280 + (i % 3) * 30} Q 34 -140 0 0 Z`} fill="url(#folB)" />
            </g>
          ))}
          {/* front layer - defined monstera-ish & broad leaves */}
          {[
            { x: 35, y: 520, r: -18, s: 1.1 }, { x: 130, y: 520, r: 12, s: 0.9 },
            { x: 215, y: 520, r: -8, s: 1.25 }, { x: 300, y: 520, r: 16, s: 0.95 }, { x: 395, y: 520, r: -14, s: 1.05 },
          ].map((l, i) => (
            <g key={"f" + i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`} opacity={0.6}>
              {/* broad leaf */}
              <path d="M0 0 C -40 -60 -42 -150 0 -210 C 42 -150 40 -60 0 0 Z" fill="url(#folA)" />
              <path d="M0 -18 L0 -195" stroke={G.f3} strokeWidth="2.5" fill="none" opacity=".55" />
              {[-1, 1].map((dir) => [50, 90, 130, 165].map((yy, j) => (
                <path key={dir + "-" + j} d={`M0 -${yy} Q ${dir * 22} -${yy + 12} ${dir * 30} -${yy + 8}`} stroke={G.f3} strokeWidth="1.5" fill="none" opacity=".4" />
              )))}
            </g>
          ))}
        </svg>

        {/* floating accent leaves */}
        {[{ x: "10%", y: "14%", s: 30, r: -25, o: .4 }, { x: "84%", y: "10%", s: 38, r: 30, o: .34 }, { x: "90%", y: "58%", s: 24, r: 65, o: .28 }, { x: "6%", y: "50%", s: 34, r: -55, o: .3 }, { x: "78%", y: "78%", s: 20, r: 110, o: .22 }].map((l, i) => (
          <svg key={i} width={l.s} height={l.s} viewBox="0 0 100 100" style={{ position: "absolute", left: l.x, top: l.y, opacity: l.o, transform: `rotate(${l.r}deg)` }}>
            <path d="M50 6 C 18 28 16 72 50 94 C 84 72 82 28 50 6 Z" fill={G.s3} />
            <path d="M50 16 L50 86" stroke={G.f1} strokeWidth="2.2" fill="none" opacity=".5" />
            {[34, 50, 66].map((y, j) => <path key={j} d={`M50 ${y} Q 66 ${y - 6} 72 ${y - 2}`} stroke={G.f1} strokeWidth="1.3" fill="none" opacity=".4" />)}
          </svg>
        ))}

        {/* depth gradient */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${G.bg0}bb 0%, ${G.bg0}33 32%, ${G.bg0}99 100%)` }} />
      </div>

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", maxWidth: 440, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 26px" }}>

        {/* Logo + wordmark */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 92, height: 92, borderRadius: 26, background: `linear-gradient(150deg, ${G.bg2}, ${G.bg1})`, border: `1px solid ${G.ln}`, boxShadow: `0 10px 40px ${G.f1}55, inset 0 1px 0 ${G.s2}22`, marginBottom: 18 }}>
            <GroveMark size={56} />
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, margin: 0, letterSpacing: "-1.5px", color: G.t1 }}>grove</h1>
          <p style={{ color: G.s2, fontSize: 13, margin: "6px 0 0", fontWeight: 500, letterSpacing: ".3px" }}>Your garden, running.</p>
        </div>

        {/* Glass card */}
        <div style={{ background: `${G.bg1}d9`, backdropFilter: "blur(20px)", border: `1px solid ${G.ln}`, borderRadius: 22, padding: "24px 22px", boxShadow: `0 20px 60px ${G.bg0}cc` }}>

          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocus("email")} onBlur={() => setFocus("")} style={inp("email")} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocus("pw")} onBlur={() => setFocus("")} onKeyDown={e => { if (e.key === "Enter") signInPassword() }} style={inp("pw")} />

          <button onClick={signInPassword} disabled={loading} style={{ background: `linear-gradient(135deg, ${G.f3}, ${G.f2})`, color: G.s4, border: "none", borderRadius: 12, padding: "14px 0", width: "100%", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1, boxShadow: `0 6px 20px ${G.f1}66`, letterSpacing: ".3px", marginTop: 3 }}>
            {loading ? "Signing in…" : "Log In"}
          </button>

          {msg && <div style={{ color: G.red, fontSize: 12, textAlign: "center", marginTop: 13, lineHeight: 1.4 }}>{msg}</div>}
        </div>

        {/* Sign up */}
        <div style={{ textAlign: "center", marginTop: 22 }}>
          <span style={{ color: G.t3, fontSize: 13 }}>New to Grove? </span>
          <button onClick={() => router.push("/signup")} style={{ background: "none", border: "none", color: G.s3, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0 }}>Create an account</button>
        </div>
      </div>
    </div>
  )
}
