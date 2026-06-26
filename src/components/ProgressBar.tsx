"use client";

export function ProgressBar({
  value,
  className = "",
  tone = "accent",
}: {
  value: number; // 0..1
  className?: string;
  tone?: "accent" | "gold" | "danger";
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const bar =
    tone === "gold"
      ? "bg-gradient-to-r from-gold/80 to-gold"
      : tone === "danger"
      ? "bg-gradient-to-r from-danger/80 to-danger"
      : "bg-gradient-to-r from-accent-600 to-accent";
  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full bg-ink-700 ring-1 ring-inset ring-slate-200 ${className}`}
    >
      <div
        className={`h-full rounded-full ${bar} transition-all duration-700 ease-out`}
        style={{ width: `${pct}%`, boxShadow: pct > 0 ? "0 0 10px rgba(13,139,224,0.4)" : "none" }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  children,
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  const gid = `ring-grad-${size}`;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a6fb3" />
            <stop offset="100%" stopColor="#0d8be0" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#dde8f3" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-all duration-700 ease-out"
          style={{ filter: pct > 0 ? "drop-shadow(0 0 5px rgba(13,139,224,0.45))" : "none" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
