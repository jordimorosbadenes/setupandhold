/// <reference types="node" />
// Auto-generates /puzzle/pieces-manifest.json at build time.
// Lists every .svg file in public/img/background-svg-pieces/ so that
// studio.html can load them dynamically — just drop new SVGs in the
// folder and they'll appear automatically with no code changes needed.
import type { APIRoute } from 'astro';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export const GET: APIRoute = async () => {
  try {
    const dir = join(process.cwd(), 'public/img/background-svg-pieces');
    const files = (await readdir(dir)).filter(f => f.toLowerCase().endsWith('.svg'));
    files.sort(); // stable ordering
    return new Response(JSON.stringify(files), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response('[]', {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Force static prerender (no server needed).
export const prerender = true;
