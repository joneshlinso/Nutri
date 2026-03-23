export default function MacroBar({ label, current, goal, color }) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0 }} />
          <span style={{ fontSize:".8125rem", fontWeight:500, color:"var(--text-secondary)" }}>{label}</span>
        </div>
        <span style={{ fontSize:".8125rem", fontWeight:600, color:"var(--text)" }}>
          {Math.round(current)}g <span style={{ color:"var(--text-muted)", fontWeight:400 }}>/ {goal}g</span>
        </span>
      </div>
      <div className="macro-bar-track">
        <div className="macro-bar-fill" style={{ width:`${pct}%`, background:color }} />
      </div>
    </div>
  );
}
