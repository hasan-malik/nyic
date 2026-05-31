import { useMemo } from "react";
import type { Story } from "../../lib/types";
import { BOROUGH_COORD, BOROUGHS, NYC_COORD, boroughOf } from "../../lib/geo";
import StoryGeoMap, { type MapPoint } from "./StoryGeoMap";

const BOROUGH_COLOR: Record<string, string> = {
  Manhattan: "#f0b429",
  Brooklyn: "#818cf8",
  Queens: "#34d399",
  "The Bronx": "#fb7185",
  "Staten Island": "#38bdf8",
};

export default function BoroughMap({ stories }: { stories: Story[] }) {
  const points = useMemo<MapPoint[]>(() => {
    const byBorough = new Map<string, Story[]>();
    for (const s of stories) {
      const b = boroughOf(s.location);
      if (!b) continue;
      (byBorough.get(b) ?? byBorough.set(b, []).get(b)!).push(s);
    }
    return BOROUGHS.map((b) => {
      const list = byBorough.get(b) ?? [];
      const [lat, lng] = BOROUGH_COORD[b];
      return {
        key: b,
        label: b,
        sub: "New York City",
        lat,
        lng,
        count: list.length,
        color: BOROUGH_COLOR[b],
        stories: list,
      };
    });
  }, [stories]);

  return (
    <StoryGeoMap
      points={points}
      center={NYC_COORD}
      zoom={11}
      minZoom={9}
      emptyTitle="Tap a borough"
      emptyHint="Every neighborhood holds a voice. Tap a glowing borough to hear who chose New York there."
    />
  );
}
