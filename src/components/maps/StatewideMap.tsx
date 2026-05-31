import { useMemo } from "react";
import type { Story } from "../../lib/types";
import { statePlaceOf } from "../../lib/geo";
import StoryGeoMap, { type MapPoint } from "./StoryGeoMap";

// One color per NY region so the statewide spread reads at a glance.
const REGION_COLOR: Record<string, string> = {
  "New York City": "#34d399",
  "Long Island": "#38bdf8",
  "Hudson Valley": "#818cf8",
  "Capital Region": "#f0b429",
  "Central NY": "#fb7185",
  "Southern Tier": "#f472b6",
  "Finger Lakes": "#a78bfa",
  "Western NY": "#fbbf24",
  "North Country": "#22d3ee",
};

export default function StatewideMap({ stories }: { stories: Story[] }) {
  const points = useMemo<MapPoint[]>(() => {
    const grouped = new Map<string, { place: NonNullable<ReturnType<typeof statePlaceOf>>; list: Story[] }>();
    for (const s of stories) {
      const place = statePlaceOf(s.location);
      if (!place) continue;
      const entry = grouped.get(place.key);
      if (entry) entry.list.push(s);
      else grouped.set(place.key, { place, list: [s] });
    }
    return [...grouped.values()].map(({ place, list }) => ({
      key: place.key,
      label: place.label,
      sub: place.region,
      lat: place.coord[0],
      lng: place.coord[1],
      count: list.length,
      color: REGION_COLOR[place.region] ?? "#34d399",
      stories: list,
    }));
  }, [stories]);

  return (
    <StoryGeoMap
      points={points}
      center={[42.6, -75.6]}
      zoom={7}
      minZoom={6}
      emptyTitle="Tap a place"
      emptyHint="NYIC is a statewide coalition. From Buffalo to Long Island, tap any glowing point to hear who chose New York there."
    />
  );
}
