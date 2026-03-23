// SVG-based animated macro ring
export default function MacroRing({ label, current, goal, color, unit = "g", size = 96 }) {
  const pct = Math.min(current / goal, 1);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const gap  = circ - dash;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <svg width={size} height={size} viewBox="0 0 88 88" style={{ overflow:"visible" }}>
        {/* Track */}
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeOpacity="0.12" strokeWidth="8" />
        {/* Fill */}
        <circle
          cx="44" cy="44" r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          strokeDashoffset={circ / 4}
          style={{ transition:"stroke-dasharray .9s cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* Label */}
        <text x="44" y="39" textAnchor="middle" style={{ fontFamily:"Inter,sans-serif", fontSize:14, fontWeight:700, fill:"var(--text)" }}>
          {Math.round(current)}
        </text>
        <text x="44" y="53" textAnchor="middle" style={{ fontFamily:"Inter,sans-serif", fontSize:10, fontWeight:500, fill:"var(--text-muted)" }}>
          {unit}
        </text>
      </svg>
      <div style={{ fontSize:".8125rem", fontWeight:500, color:"var(--text-secondary)", textAlign:"center" }}>
        {label}
        <div style={{ fontSize:".75rem", color:"var(--text-muted)" }}>/ {goal}{unit}</div>
      </div>
    </div>
  );
}
