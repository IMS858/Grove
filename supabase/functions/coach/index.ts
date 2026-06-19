import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { claude } from "../_shared/anthropic.ts";
serve(async (req) => {
  try {
    const { message } = await req.json();
    const answer = await claude({ system: "You are the Grove Coach, a Zone 9b SoCal horticulture expert. Be concise and practical.", user: message });
    return new Response(JSON.stringify({ answer }), { headers: { "Content-Type": "application/json" } });
  } catch (e) { return new Response(JSON.stringify({ error: String(e) }), { status: 500 }); }
});
