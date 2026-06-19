"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

const G = { bg0:"#0B110E",bg1:"#111A15",f1:"#1B4332",f2:"#2D6A4F",s2:"#74B89A",s3:"#95D5B2",c2:"#FF8C42",t1:"#EDE9E3",t2:"#B8C4B0",t3:"#7A8C78" }

function Leaf({ size = 48 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 100 100"><ellipse cx="40" cy="44" rx="21" ry="30" fill={G.s3} opacity=".88" transform="rotate(-15 40 44)"/><ellipse cx="58" cy="47" rx="17" ry="26" fill={G.f2} opacity=".8" transform="rotate(10 58 47)"/><line x1="50" y1="70" x2="50" y2="90" stroke={G.s3} strokeWidth="2.5" strokeLinecap="round"/></svg>
}

export default function Welcome() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const n = data.user.user_metadata?.name || data.user.email?.split("@")[0] || ""
        setName(n)
      }
    })
  }, [])

  return (
    <div style={{ background: `linear-gradient(160deg,${G.f1} 0%,#081410 55%,${G.bg0} 100%)`, color: G.t1, fontFamily: "-apple-system,Inter,system-ui,sans-serif", minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 32px" }}>
      <div style={{ width: 96, height: 96, borderRadius: 24, background: `linear-gradient(140deg,${G.f1},${G.f2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 32px ${G.f1}88`, marginBottom: 24 }}>
        <Leaf size={56} />
      </div>
      <div style={{ fontSize: 13, color: G.s3, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>✓ Email confirmed</div>
      <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-1px" }}>
        {name ? `Welcome, ${name}!` : "Welcome to Grove!"}
      </h1>
      <p style={{ color: G.t2, fontSize: 15, lineHeight: 1.6, margin: "0 0 32px", maxWidth: 320 }}>
        Your garden is ready. Let's get your beds set up and start growing smarter.
      </p>
      <button onClick={() => router.push("/app")} style={{ background: G.c2, color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", width: "100%", maxWidth: 300, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px ${G.c2}44` }}>
        Enter Grove →
      </button>
      <button onClick={() => router.push("/login")} style={{ background: "none", border: "none", color: G.t3, fontSize: 13, cursor: "pointer", marginTop: 16 }}>
        Go to login instead
      </button>
    </div>
  )
}
