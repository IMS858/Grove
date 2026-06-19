"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function Index() {
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      router.replace(data.session ? "/app" : "/login")
    }).catch(() => router.replace("/login"))
  }, [router])

  // Brief branded splash while we decide where to send them
  return (
    <div style={{ background: "#0B110E", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="56" height="56" viewBox="0 0 100 100" style={{ opacity: 0.9 }}>
        <ellipse cx="40" cy="44" rx="21" ry="30" fill="#95D5B2" opacity=".88" transform="rotate(-15 40 44)" />
        <ellipse cx="58" cy="47" rx="17" ry="26" fill="#2D6A4F" opacity=".8" transform="rotate(10 58 47)" />
        <line x1="50" y1="70" x2="50" y2="90" stroke="#95D5B2" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
