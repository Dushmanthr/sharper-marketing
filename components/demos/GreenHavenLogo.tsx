export default function GreenHavenLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Green Haven Logo"
    >
      <defs>
        <linearGradient id="ghGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3cf8a" />
          <stop offset="50%" stopColor="#c59d5f" />
          <stop offset="100%" stopColor="#9a7432" />
        </linearGradient>
        <linearGradient id="ghGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a3324" />
          <stop offset="100%" stopColor="#0a180f" />
        </linearGradient>
      </defs>

      {/* Outer Heritage Crest Shield */}
      <rect
        x="2.5"
        y="2.5"
        width="43"
        height="43"
        rx="12"
        fill="url(#ghGreen)"
        stroke="url(#ghGold)"
        strokeWidth="1.5"
      />

      {/* Inner delicate filigree border */}
      <rect
        x="5.5"
        y="5.5"
        width="37"
        height="37"
        rx="9.5"
        fill="none"
        stroke="url(#ghGold)"
        strokeWidth="0.75"
        strokeOpacity="0.45"
      />

      {/* Stylized Botanical Haven Leaves */}
      <path
        d="M 11 26 C 9.5 21 12 16 17 14.5 C 16 19 13.5 23 11 26 Z"
        fill="url(#ghGold)"
        opacity="0.85"
      />
      <path
        d="M 37 26 C 38.5 21 36 16 31 14.5 C 32 19 34.5 23 37 26 Z"
        fill="url(#ghGold)"
        opacity="0.85"
      />

      {/* Monogram G */}
      <path
        d="M 22.5 19 C 19.5 19 16.5 21 16.5 24.5 C 16.5 28 19.5 30 22.5 30 C 25 30 26.5 28.5 26.5 26.5 L 22.5 26.5"
        stroke="url(#ghGold)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Monogram H */}
      <path
        d="M 28 19 L 28 30 M 34 19 L 34 30 M 28 24.5 L 34 24.5"
        stroke="url(#ghGold)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Royal / Heritage Pip */}
      <circle cx="24" cy="11.5" r="1.4" fill="url(#ghGold)" />
    </svg>
  );
}

