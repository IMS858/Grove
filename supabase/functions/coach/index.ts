import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";
import { claudeStream } from "../_shared/anthropic.ts";

serve(async (req) => {
  try {
    const { message, user_id } = await req.json();
    const now = new Date();
    const month = now.getMonth() + 1;

    const { data: profile } = await supabaseAdmin
      .from("profiles").select("zone").eq("id", user_id).single();
    const { data: plants } = await supabaseAdmin
      .from("plants").select("name, stage")
      .eq("user_id", user_id).eq("is_archived", false).limit(20);
    const { data: weather } = await supabaseAdmin
      .from("weather_data").select("temp_f, condition")
      .order("observed_at", { ascending: false }).limit(1);

    const ctx = `Zone: ${profile?.zone ?? "9b"}. Month: ${month}. ` +
      `Weather: ${weather?.[0]?.temp_f ?? "?"}F ${weather?.[0]?.condition ?? ""}. ` +
      `Plants: ${plants?.map((p: any) => `${p.name} (${p.stage})`).join(", ") ?? "none"}.`;

    const stream = await claudeStream({
      system: "You are the Grove Coach: a Zone 9b SoCal horticulture expert. " +
        "Answer for the user's zone, month, weather, and specific plants. Be concise and practical. " +
        "End with concrete suggested tasks.",
      user: `${ctx}\n\nQuestion: "${message}"`,
    });

    return new Response(stream.body, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
});
