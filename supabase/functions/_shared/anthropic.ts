const API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

export async function claude(opts: {
  system: string; user: string; maxTokens?: number;
  images?: { type: string; data: string }[];
}) {
  const content: any[] = [];
  if (opts.images) {
    for (const img of opts.images) {
      content.push({ type: "image", source: { type: "base64", media_type: img.type, data: img.data } });
    }
  }
  content.push({ type: "text", text: opts.user });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: opts.maxTokens ?? 1024,
      system: opts.system,
      messages: [{ role: "user", content }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text;
}

export async function claudeStream(opts: {
  system: string; user: string; maxTokens?: number;
}) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: opts.maxTokens ?? 1024,
      stream: true,
      system: opts.system,
      messages: [{ role: "user", content: opts.user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic stream ${res.status}`);
  return res;
}
