import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

const weightData = [
  { date:"Oct 1",weight:76.5 },{ date:"Oct 5",weight:76.2 },
  { date:"Oct 10",weight:75.8 },{ date:"Oct 15",weight:75.4 },
  { date:"Oct 20",weight:75.1 },{ date:"Oct 24",weight:74.8 },
];
const calorieData = [
  { day:"M",eaten:1800,goal:1850 },{ day:"T",eaten:1950,goal:1850 },
  { day:"W",eaten:1750,goal:1850 },{ day:"T",eaten:1820,goal:1850 },
  { day:"F",eaten:2100,goal:1850 },{ day:"S",eaten:1600,goal:1850 },
  { day:"S",eaten:1840,goal:1850 },
];

const STATS = [
  { label:"Current Weight", val:"74.8 kg", emoji:"⚖️" },
  { label:"Weight Lost",    val:"−1.7 kg", emoji:"📉" },
  { label:"Streak",         val:"5 Days",  emoji:"🔥" },
  { label:"Avg Water",      val:"6.2 L",   emoji:"💧" },
];

const SoftTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#FFF", padding: "12px 16px", borderRadius: 2, border: "1px solid rgba(184,146,74,.2)", boxShadow: "0 4px 20px rgba(26,22,18,.08)" }}>
      <p style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", marginBottom: 8 }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--ink)" }}>{p.name}: <span style={{color:"var(--gold)"}}>{p.value}</span></p>)}
    </div>
  );
};

const FADE = (delay=0) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.5, ease:[0.34,1.56,0.64,1], delay} });

export default function Progress() {
  return (
    <main className="page-content">
      <motion.div {...FADE(0)} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", fontWeight: 300, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1 }}>Progress</h1>
        <p style={{ fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--ink-60)", textTransform: "uppercase", marginTop: 8 }}>Your health metrics over time.</p>
      </motion.div>

      <motion.div {...FADE(0.05)} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
        {STATS.map((s,i) => (
          <div key={i} className="card" style={{ padding: "28px 24px", textAlign: "center", animationDelay: `${i * 80}ms` }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>{s.emoji}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 20 }}>
        <motion.div {...FADE(0.10)} style={{ gridColumn: "span 8" }}>
          <div className="card" style={{ padding: 32, height: "100%" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 24 }}>Weight Trend</h3>
            <div style={{ height: 300, marginLeft: -16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="gWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="var(--gold)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--ink-30)" fontSize={12} tickLine={false} axisLine={false} dy={8} tick={{fill: "var(--ink-60)"}}/>
                  <YAxis stroke="var(--ink-30)" fontSize={12} tickLine={false} axisLine={false} domain={["dataMin-1","dataMax+1"]} tick={{fill: "var(--ink-60)"}}/>
                  <Tooltip content={<SoftTooltip/>} cursor={{stroke:"var(--ink-10)",strokeWidth:2}}/>
                  <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="var(--gold)" strokeWidth={3} fill="url(#gWeight)" animationDuration={1200}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div {...FADE(0.15)} style={{ gridColumn: "span 4" }}>
          <div className="card" style={{ padding: 32, height: "100%" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 24 }}>Energy Balance</h3>
            <div style={{ height: 300, marginLeft: -16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData} barSize={8}>
                  <XAxis dataKey="day" stroke="var(--ink-30)" fontSize={12} tickLine={false} axisLine={false} dy={8} tick={{fill: "var(--ink-60)"}}/>
                  <YAxis stroke="var(--ink-30)" fontSize={12} tickLine={false} axisLine={false} tick={{fill: "var(--ink-60)"}}/>
                  <Tooltip content={<SoftTooltip/>} cursor={{fill:"var(--ink-10)"}}/>
                  <Bar dataKey="eaten" name="Consumed" fill="var(--slate)" radius={[2,2,0,0]} animationDuration={1200}/>
                  <Bar dataKey="goal" name="Target" fill="var(--cream-dark)" radius={[2,2,0,0]} animationDuration={1200}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
