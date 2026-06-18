import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";
import { claude } from "../_shared/anthropic.ts";

serve(async (req) => {
  try {
    const { photo_paths, plant_id, symptom_text } = await req.json();

    // Get signed URLs and download as base64
    const images = await Promise.all(
      (photo_paths || []).map(async (path: string) => {
        const { data } = await supabaseAdmin.storage
          .from("plant-photos").download(path);
        if (!data) return null;
        const buf = await data.arrayBuffer();
        return { type: "image/jpeg", data: btoa(String.fromCharCode(...new Uint8Array(buf))) };
      })
    );

    let plantCtx = "";
    if (plant_id) {
      const { data: plant } = await supabaseAdmin
        .from("plants").select("name, species, stage, sun_req, water_req")
        .eq("id", plant_id).single();
      if (plant) plantCtx = `Plant: ${plant.name} (${plant.species}), stage ${plant.stage}, ${plant.sun_req}.`;
    }

    const raw = await claude({
      system: "You are a horticulture diagnostician for USDA Zone 9b raised-bed gardens. " +
        "Distinguish nutrient deficiencies (N,P,K,Ca,Mg), heat/water stress, fungal/bacterial disease, and pest damage. " +
        "Respond ONLY with JSON: {likelyProblem, confidence(0-1), severity(low|moderate|high|critical), " +
        "priority(low|medium|high|urgent), causes[], actions[{step,detail}], alternatives[]}.",
      user: `${plantCtx}\nSymptom: "${symptom_text || "(see photo)"}"\nAnalyze the attached photo(s).`,
      images: images.filter(Boolean),
    });

    const result = JSON.parse(raw.replace(/```json|```/g, "").trim());

    const { data: diag } = await supabaseAdmin.from("ai_diagnoses").insert({
      plant_id, source: "ai_photo",
      likely_problem: result.likelyProblem, confidence: result.confidence,
      severity: result.severity, priority: result.priority,
      causes: result.causes, actions: result.actions,
      raw_result: result, model: "claude-sonnet-4-6",
    }).select().single();

    return new Response(JSON.stringify({ diagnosis_id: diag?.id, ...result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
});
