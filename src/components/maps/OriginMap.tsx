import { useMemo } from "react";
import type { Story } from "../../lib/types";
import { COUNTRY_COORDS, NYC_COORD } from "../../lib/geo";
import StoryGeoMap, { type MapPoint } from "./StoryGeoMap";

export default function OriginMap({ stories }: { stories: Story[] }) {
  const points = useMemo<MapPoint[]>(() => {
    const byCountry = new Map<string, Story[]>();
    for (const s of stories) {
      if (!COUNTRY_COORDS[s.origin]) continue;
      const arr = byCountry.get(s.origin);
      if (arr) arr.push(s);
      else byCountry.set(s.origin, [s]);
    }
    return [...byCountry.entries()].map(([country, list]) => {
      const [lat, lng] = COUNTRY_COORDS[country];
      return {
        key: country,
        label: country,
        sub: "→ New York",
        lat,
        lng,
        count: list.length,
        color: "#34d399",
        stories: list,
      };
    });
  }, [stories]);

  return (
    <StoryGeoMap
      points={points}
      center={[28, -25]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      hub={{ lat: NYC_COORD[0], lng: NYC_COORD[1], label: "New York" }}
      emptyTitle="Every thread leads here"
      emptyHint={`${points.length}+ countries, one city. Tap a glowing point to hear the voices who carried it to New York.`}
    />
  );
}
