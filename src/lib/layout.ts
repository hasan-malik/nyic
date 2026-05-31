// Tiny deterministic force-directed layout for the public Constellation.
// O(n²) is fine at our scale (tens of nodes) and runs once in a useMemo.

export interface Pt {
  x: number;
  y: number;
}
export interface Edge {
  a: string;
  b: string;
  w: number; // 0..1 strength
}

export function forceLayout(
  ids: string[],
  edges: Edge[],
  width: number,
  height: number,
  iterations = 220
): Map<string, Pt> {
  const cx = width / 2;
  const cy = height / 2;
  const pos = new Map<string, Pt>();

  // deterministic seed: spread on a ring so layouts are stable between renders
  ids.forEach((id, i) => {
    const a = (i / Math.max(1, ids.length)) * Math.PI * 2;
    const r = Math.min(width, height) * 0.32;
    pos.set(id, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  });

  const k = Math.sqrt((width * height) / Math.max(1, ids.length)) * 0.55;

  for (let it = 0; it < iterations; it++) {
    const disp = new Map<string, Pt>(ids.map((id) => [id, { x: 0, y: 0 }]));

    // repulsion between every pair
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const p = pos.get(ids[i])!;
        const q = pos.get(ids[j])!;
        let dx = p.x - q.x;
        let dy = p.y - q.y;
        let d = Math.hypot(dx, dy) || 0.01;
        const force = (k * k) / d;
        dx = (dx / d) * force;
        dy = (dy / d) * force;
        disp.get(ids[i])!.x += dx;
        disp.get(ids[i])!.y += dy;
        disp.get(ids[j])!.x -= dx;
        disp.get(ids[j])!.y -= dy;
      }
    }

    // attraction along edges (stronger edge = closer)
    for (const e of edges) {
      const p = pos.get(e.a);
      const q = pos.get(e.b);
      if (!p || !q) continue;
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const d = Math.hypot(dx, dy) || 0.01;
      const force = ((d * d) / k) * (0.4 + e.w);
      const fx = (dx / d) * force;
      const fy = (dy / d) * force;
      disp.get(e.a)!.x -= fx;
      disp.get(e.a)!.y -= fy;
      disp.get(e.b)!.x += fx;
      disp.get(e.b)!.y += fy;
    }

    // apply with cooling + gentle gravity toward center
    const temp = (1 - it / iterations) * (k * 0.5);
    for (const id of ids) {
      const dp = disp.get(id)!;
      const p = pos.get(id)!;
      const len = Math.hypot(dp.x, dp.y) || 0.01;
      p.x += (dp.x / len) * Math.min(len, temp);
      p.y += (dp.y / len) * Math.min(len, temp);
      p.x += (cx - p.x) * 0.012;
      p.y += (cy - p.y) * 0.012;
      // keep inside bounds with padding
      p.x = Math.max(40, Math.min(width - 40, p.x));
      p.y = Math.max(40, Math.min(height - 40, p.y));
    }
  }

  return pos;
}
