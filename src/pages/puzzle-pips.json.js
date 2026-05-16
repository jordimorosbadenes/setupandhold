// Astro static endpoint — fetched at BUILD TIME (Node.js, no CORS)
// Outputs /puzzle-pips.json with today's NYT Pips puzzle data.
// GitHub Actions runs this daily (cron) to keep it fresh.

export async function GET() {
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  try {
    const resp = await fetch(`https://www.nytimes.com/svc/pips/v1/${dateStr}.json`);
    if (!resp.ok) throw new Error(`NYT returned ${resp.status}`);
    const data = await resp.json();
    return new Response(JSON.stringify({ date: dateStr, ...data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    // Return a structured error so the client can fall back gracefully
    return new Response(JSON.stringify({ date: dateStr, error: String(e) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
