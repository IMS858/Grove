import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";
import { claude } from "../_shared/anthropic.ts";
serve(async (req) => {
  try {
    const { photo_paths, plant_id, symptom_text } = await req.json();
    const raw = await claude({ system: "You are a Zone 9b plant diagnostician. Respond ONLY JSON: {likelyProblem, confidence(0-1), severity, causes[], actions[{step,detail}]}.", user: "Symptom: " + (symptom_text || "see photo") });
    const result = JSON.parse(raw.replace(/```json|```/g, "").trim());
    await supabaseAdmin.from("ai_diagnoses").insert({ plant_id, likely_problem: result.likelyProblem, confidence: result.confidence, severity: result.severity, causes: result.causes, actions: result.actions, model: "claude-sonnet-4-6" });
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (e) { return new Response(JSON.stringify({ error: String(e) }), { status: 500 }); }
});
