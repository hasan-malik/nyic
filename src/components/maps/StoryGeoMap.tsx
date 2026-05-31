import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, MapPin } from "lucide-react";
import type { Story } from "../../lib/types";
import AudioPlayer from "../AudioPlayer";

export type MapPoint = {
  key: string;
  label: string;
  sub?: string;
  lat: number;
  lng: number;
  count: number;
  color: string;
  stories: Story[];
};

type Props = {
  points: MapPoint[];
  center: [number, number];
  zoom: number;
  minZoom?: number;
  worldCopyJump?: boolean;
  /** If set, draws curved arcs from every point to this hub (e.g. New York). */
  hub?: { lat: number; lng: number; label: string };
  emptyTitle: string;
  emptyHint: string;
  unit?: string; // e.g. "voices"
  height?: number;
};

// CARTO dark basemap — free, open-source raster tiles (Leaflet · OpenStreetMap · CARTO).
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

/** Glowing halo marker (Matter-Lab style): blurred halo + crisp ringed core. */
function glowIcon(color: string, count: number, max: number, selected: boolean) {
  const r = 7 + Math.round((count / max) * 16) + (selected ? 4 : 0);
  const halo = r * 1.9;
  const total = halo * 2;
  return L.divIcon({
    className: "",
    iconSize: [total, total],
    iconAnchor: [halo, halo],
    html: `
      <div style="position:relative;width:${total}px;height:${total}px;pointer-events:none;">
        <div style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:${selected ? 0.5 : 0.32};filter:blur(${r * 0.7}px);"></div>
        <div style="position:absolute;left:${halo - r}px;top:${halo - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:9999px;background:${color};box-shadow:0 0 0 2px rgba(255,255,255,${selected ? 0.95 : 0.8}) inset;pointer-events:auto;cursor:pointer;"></div>
      </div>`,
  });
}

// Quadratic-bezier arc (sampled) between two lat/lng points, bowed outward.
function arcPath(
  from: [number, number],
  to: [number, number]
): [number, number][] {
  const [y1, x1] = from;
  const [y2, x2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // perpendicular offset for the bow
  const off = dist * 0.18;
  const len = dist || 1;
  const ox = mx + (-dy / len) * off;
  const oy = my + (dx / len) * off;
  const pts: [number, number][] = [];
  for (let t = 0; t <= 1.0001; t += 1 / 24) {
    const a = 1 - t;
    const lat = a * a * y1 + 2 * a * t * oy + t * t * y2;
    const lng = a * a * x1 + 2 * a * t * ox + t * t * x2;
    pts.push([lat, lng]);
  }
  return pts;
}

export default function StoryGeoMap({
  points,
  center,
  zoom,
  minZoom = 2,
  worldCopyJump = false,
  hub,
  emptyTitle,
  emptyHint,
  unit = "voices",
  height = 560,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const max = useMemo(
    () => Math.max(1, ...points.map((p) => p.count)),
    [points]
  );
  const active = points.find((p) => p.key === selected) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div
        className="overflow-hidden rounded-2xl border border-white/10"
        style={{ height }}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={minZoom}
          worldCopyJump={worldCopyJump}
          scrollWheelZoom
          className="h-full w-full"
          style={{ background: "#0a1330" }}
          attributionControl
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTR} subdomains="abcd" />

          {/* arcs to the hub */}
          {hub &&
            points.map((p) => {
              const sel = p.key === selected;
              return (
                <Polyline
                  key={`arc-${p.key}`}
                  positions={arcPath([p.lat, p.lng], [hub.lat, hub.lng])}
                  pathOptions={{
                    color: sel ? "#fbbf24" : "#f0b429",
                    weight: sel ? 2.2 : 0.8,
                    opacity: sel ? 0.9 : selected ? 0.12 : 0.28,
                  }}
                />
              );
            })}

          {/* origin / region markers */}
          {points.map((p) => (
            <Marker
              key={p.key}
              position={[p.lat, p.lng]}
              icon={glowIcon(p.color, p.count, max, p.key === selected)}
              eventHandlers={{
                click: () => setSelected((cur) => (cur === p.key ? null : p.key)),
              }}
            />
          ))}

          {/* hub marker */}
          {hub && (
            <Marker
              position={[hub.lat, hub.lng]}
              icon={glowIcon("#e0492f", max, max, false)}
            />
          )}
        </MapContainer>
      </div>

      {/* side panel */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        {!active ? (
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center text-white/60">
            <MapPin size={28} className="mb-3 text-brand-gold" />
            <p className="font-semibold text-white">{emptyTitle}</p>
            <p className="mt-1 text-sm">{emptyHint}</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-extrabold text-white">{active.label}</h3>
            <p className="mb-4 text-sm text-white/60">
              {active.count.toLocaleString()} {unit}
              {active.sub ? ` · ${active.sub}` : ""}
            </p>
            <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
              {active.stories.length === 0 && (
                <p className="text-sm text-white/50">
                  No published stories here yet — a gap worth filling.
                </p>
              )}
              {active.stories.slice(0, 8).map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl bg-white/95 p-4 text-slate-900"
                >
                  <p className="font-bold leading-snug text-navy">
                    "{s.pullQuote}"
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {s.narratorDisplay} · {s.location} · from {s.origin}
                  </p>
                  <div className="mt-2">
                    <AudioPlayer
                      src={s.audioUrl}
                      durationSec={s.durationSec}
                      compact
                    />
                  </div>
                  <Link
                    to={`/stories/${s.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline"
                  >
                    Full story <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
