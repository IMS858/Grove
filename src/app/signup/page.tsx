"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

const G = { bg0:"#0B110E",bg1:"#111A15",ln:"#243328",f1:"#1B4332",f2:"#2D6A4F",s3:"#95D5B2",c2:"#FF8C42",t1:"#EDE9E3",t2:"#B8C4B0",t3:"#7A8C78",t4:"#4E5E4C",red:"#D95B5B" }

function Leaf({ size = 32 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="40" cy="44" rx="21" ry="30" fill={G.s3} opacity=".88" transform="rotate(-15 40 44)"/><ellipse cx="58" cy="47" rx="17" ry="26" fill={G.f2} opacity=".8" transform="rotate(10 58 47)"/><line x1="50" y1="70" x2="50" y2="90" stroke={G.s3} strokeWidth="2.5" strokeLinecap="round"/></svg>
}

export default function Signup() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const inp: React.CSSProperties = { background: G.bg0, color: G.t1, border: `1px solid ${G.ln}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, width: "100%", boxSizing: "border-box", marginBottom: 10 }

  async function signUp() {
    if (!email || !password) { setMsg("Email and password required."); return }
    setLoading(true); setMsg("")
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name }, emailRedirectTo: `${location.origin}/auth/callback` }
    })
    setLoading(false)
    if (error) setMsg(error.message)
    else setMsg("Check your email to confirm your account.")
  }

  async function signUpGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } })
  }

  return (
    <div style={{ background: G.bg0, color: G.t1, fontFamily: "-apple-system,Inter,system-ui,sans-serif", minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Leaf size={44} /></div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Create your garden</h1>
        <p style={{ color: G.t3, fontSize: 13, marginTop: 4 }}>Free to start. No credit card.</p>
      </div>

      <button onClick={signUpGoogle} style={{ background: "#fff", color: "#1a1a1a", border: "none", borderRadius: 10, padding: "12px 0", width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75z"/></svg>
        Continue with Google
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 16px" }}>
        <div style={{ flex: 1, height: 1, background: G.ln }} /><span style={{ color: G.t4, fontSize: 11 }}>OR</span><div style={{ flex: 1, height: 1, background: G.ln }} />
      </div>

      <input placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} style={inp} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
      <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} style={inp} />

      <button onClick={signUp} disabled={loading} style={{ background: G.c2, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", width: "100%", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
        {loading ? "..." : "Create Account"}
      </button>

      {msg && <div style={{ color: msg.includes("Check") ? G.s3 : G.red, fontSize: 12, textAlign: "center", marginTop: 12 }}>{msg}</div>}

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <span style={{ color: G.t3, fontSize: 13 }}>Have an account? </span>
        <button onClick={() => router.push("/login")} style={{ background: "none", border: "none", color: G.s3, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Log in</button>
      </div>
    </div>
  )
}
