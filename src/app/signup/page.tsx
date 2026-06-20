"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

const G = { bg0:"#0B110E",bg1:"#111A15",bg2:"#172119",ln:"#243328",f1:"#1B4332",f2:"#2D6A4F",f3:"#40916C",s1:"#52796F",s2:"#74B89A",s3:"#95D5B2",s4:"#D8F3DC",c2:"#FF8C42",t1:"#EDE9E3",t2:"#B8C4B0",t3:"#7A8C78",t4:"#4E5E4C",red:"#D95B5B" }

function GroveMark({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={G.s4} /><stop offset="100%" stopColor={G.s2} /></linearGradient>
        <linearGradient id="sg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={G.f3} /><stop offset="100%" stopColor={G.f1} /></linearGradient>
      </defs>
      <ellipse cx="40" cy="44" rx="22" ry="31" fill="url(#sg1)" opacity=".92" transform="rotate(-15 40 44)" />
      <ellipse cx="58" cy="47" rx="18" ry="27" fill="url(#sg2)" opacity=".9" transform="rotate(10 58 47)" />
      <path d="M40 28 Q40 50 40 68" stroke={G.f1} strokeWidth="1" fill="none" opacity=".4" transform="rotate(-15 40 44)" />
      <line x1="50" y1="68" x2="50" y2="92" stroke={G.s3} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Signup() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState("")

  async function signUp() {
    if (!email || !password) { setMsg("Email and password required."); return }
    setLoading(true); setMsg("")
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name }, emailRedirectTo: `${location.origin}/auth/callback` }
    })
    setLoading(false)
    if (error) setMsg(error.message)
    else setSent(true)
  }


  const inp = (nm: string): React.CSSProperties => ({
    background: "rgba(11,17,14,0.6)", color: G.t1,
    border: `1px solid ${focus === nm ? G.s2 : G.ln}`,
    borderRadius: 12, padding: "13px 15px", fontSize: 14, width: "100%", boxSizing: "border-box",
    marginBottom: 11, outline: "none", transition: "border-color .2s, box-shadow .2s",
    boxShadow: focus === nm ? `0 0 0 3px ${G.s2}22` : "none",
  })

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: G.bg0, fontFamily: "-apple-system,Inter,system-ui,sans-serif" }}>
      {/* botanical backdrop */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${G.f1}55 0%, transparent 60%)` }} />
        <svg viewBox="0 0 430 500" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "70%", opacity: 0.5 }}>
          <defs><linearGradient id="folB" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor={G.f1} /><stop offset="100%" stopColor={G.f2} stopOpacity="0" /></linearGradient></defs>
          {[40, 110, 190, 270, 350, 410].map((x, i) => (
            <g key={i} transform={`translate(${x} 500) rotate(${(i % 2 ? 1 : -1) * (8 + i * 2)})`} opacity={0.5 + (i % 3) * 0.15}>
              <path d={`M0 0 Q -30 -120 0 -${230 + (i % 3) * 40} Q 30 -120 0 0 Z`} fill="url(#folB)" />
            </g>
          ))}
        </svg>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${G.bg0}cc 0%, ${G.bg0}44 35%, ${G.bg0}aa 100%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", maxWidth: 440, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 26px" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 84, height: 84, borderRadius: 24, background: `linear-gradient(150deg, ${G.bg2}, ${G.bg1})`, border: `1px solid ${G.ln}`, boxShadow: `0 10px 40px ${G.f1}55, inset 0 1px 0 ${G.s2}22`, marginBottom: 16 }}>
            <GroveMark size={50} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-1px", color: G.t1 }}>Start your garden</h1>
          <p style={{ color: G.s2, fontSize: 13, margin: "6px 0 0", fontWeight: 500 }}>Plan, grow, and harvest with Grove.</p>
        </div>

        {sent ? (
          <div style={{ background: `${G.bg1}d9`, backdropFilter: "blur(20px)", border: `1px solid ${G.s3}33`, borderRadius: 22, padding: "30px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📬</div>
            <div style={{ color: G.s3, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Check your email</div>
            <div style={{ color: G.t2, fontSize: 13, lineHeight: 1.6 }}>We sent a confirmation link to <b style={{ color: G.t1 }}>{email}</b>. Tap it to activate your garden, then come back and log in.</div>
            <button onClick={() => router.push("/login")} style={{ marginTop: 20, background: `linear-gradient(135deg, ${G.f3}, ${G.f2})`, color: G.s4, border: "none", borderRadius: 12, padding: "13px 0", width: "100%", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Back to login</button>
          </div>
        ) : (
          <div style={{ background: `${G.bg1}d9`, backdropFilter: "blur(20px)", border: `1px solid ${G.ln}`, borderRadius: 22, padding: "24px 22px", boxShadow: `0 20px 60px ${G.bg0}cc` }}>
            <input placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} onFocus={() => setFocus("nm")} onBlur={() => setFocus("")} style={inp("nm")} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocus("em")} onBlur={() => setFocus("")} style={inp("em")} />
            <input type="password" placeholder="Password (6+ characters)" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocus("pw")} onBlur={() => setFocus("")} onKeyDown={e => { if (e.key === "Enter") signUp() }} style={inp("pw")} />
            <button onClick={signUp} disabled={loading} style={{ background: `linear-gradient(135deg, ${G.c2}, #e67a30)`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", width: "100%", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1, boxShadow: `0 6px 20px ${G.c2}44`, marginTop: 3 }}>
              {loading ? "Creating…" : "Create Account"}
            </button>
            {msg && <div style={{ color: G.red, fontSize: 12, textAlign: "center", marginTop: 13, lineHeight: 1.4 }}>{msg}</div>}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 22 }}>
          <span style={{ color: G.t3, fontSize: 13 }}>Already have an account? </span>
          <button onClick={() => router.push("/login")} style={{ background: "none", border: "none", color: G.s3, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0 }}>Log in</button>
        </div>
      </div>
    </div>
  )
}
