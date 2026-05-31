import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { formatDuration } from "../lib/analytics";

/** Minimal, branded audio player used on story cards + detail pages. */
export default function AudioPlayer({
  src,
  durationSec,
  compact = false,
}: {
  src: string;
  durationSec: number;
  compact?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(durationSec);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setCurrent(t);
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div
      className={`flex items-center gap-3 ${
        compact ? "" : "rounded-xl bg-mist p-3"
      }`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-white transition-transform hover:scale-105 active:scale-95"
      >
        {playing ? (
          <Pause size={18} fill="white" />
        ) : (
          <Play size={18} fill="white" className="ml-0.5" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <input
          type="range"
          min={0}
          max={duration || durationSec}
          value={current}
          onChange={seek}
          aria-label="Seek"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-300 accent-brand-red"
          style={{
            background: `linear-gradient(to right, #e0492f ${pct}%, #cbd5e1 ${pct}%)`,
          }}
        />
        <div className="mt-1.5 flex justify-between text-xs font-medium tabular-nums text-slate-500">
          <span>{formatDuration(Math.floor(current))}</span>
          <span>{formatDuration(Math.floor(duration || durationSec))}</span>
        </div>
      </div>
    </div>
  );
}
