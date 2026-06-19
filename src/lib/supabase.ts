import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Fallback dummy values during build/prerender (real values come at runtime on the client)
  return createBrowserClient(
    url || "https://placeholder.supabase.co",
    key || "placeholder-anon-key"
  )
}
