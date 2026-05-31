type LogoProps = {
  /** Color of the wordmark + mark. Use "white" inside dark sections. */
  variant?: "dark" | "white";
  className?: string;
};

/**
 * NYIC logo: a pinwheel of four rounded "petal" leaves followed by the
 * NYIC wordmark. Approximation of the New York Immigration Coalition mark.
 */
export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const color = variant === "white" ? "#ffffff" : "#0f172a";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* four petals rotated around the center */}
        {[0, 90, 180, 270].map((deg) => (
          <path
            key={deg}
            d="M24 24 C24 14, 31 9, 38 12 C41 19, 34 24, 24 24 Z"
            fill={color}
            transform={`rotate(${deg} 24 24)`}
          />
        ))}
        {/* inner accent dots in brand red */}
        {[45, 135, 225, 315].map((deg) => (
          <circle
            key={deg}
            cx="24"
            cy="13.5"
            r="2.6"
            fill="#e0492f"
            transform={`rotate(${deg} 24 24)`}
          />
        ))}
      </svg>
      <span
        className="text-2xl font-extrabold tracking-tight"
        style={{ color }}
      >
        NYIC
      </span>
    </div>
  );
}
