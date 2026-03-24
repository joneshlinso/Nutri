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
    <div className="card" style={{ padding:"12px 16px", borderRadius:"var(--r-md)" }}>
      <p className="t-xs mb-2">{label}</p>
      {payload.map((p,i) => <p key={i} className="t-sm-med">{p.name}: <span style={{color:"var(--accent-cta)"}}>{p.value}</span></p>)}
    </div>
  );
};

const FADE = (delay=0) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.5, ease:[0.34,1.56,0.64,1], delay} });

export default function Progress() {
  return (
    <main className="page-content">
      <motion.div {...FADE(0)} className="mb-6">
        <h1 className="t-h1">Progress</h1>
        <p className="t-body mt-1">Your health metrics over time.</p>
      </motion.div>

      <motion.div {...FADE(0.05)} className="grid-4 mb-6">
        {STATS.map((s,i) => (
          <div key={i} className="card p-6 text-center card-hover">
            <div style={{ fontSize:28, marginBottom:8 }}>{s.emoji}</div>
            <div className="t-h2">{s.val}</div>
            <div className="t-xs mt-2">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="bento-grid">
        <motion.div {...FADE(0.10)} style={{ gridColumn:"span 8" }}>
          <div className="card p-8" style={{ height:"100%" }}>
            <h3 className="t-h3 mb-6">Weight Trend</h3>
            <div style={{ height:300, marginLeft:-16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="gWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={8}/>
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={["dataMin-1","dataMax+1"]}/>
                  <Tooltip content={<SoftTooltip/>} cursor={{stroke:"var(--bg-alt)",strokeWidth:2}}/>
                  <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="var(--primary)" strokeWidth={3} fill="url(#gWeight)" animationDuration={1200}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div {...FADE(0.15)} style={{ gridColumn:"span 4" }}>
          <div className="card p-8" style={{ height:"100%" }}>
            <h3 className="t-h3 mb-6">Energy Balance</h3>
            <div style={{ height:300, marginLeft:-16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData} barSize={12}>
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={8}/>
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false}/>
                  <Tooltip content={<SoftTooltip/>} cursor={{fill:"var(--bg-alt)"}}/>
                  <Bar dataKey="eaten" name="Consumed" fill="var(--primary)" radius={[6,6,0,0]} animationDuration={1200}/>
                  <Bar dataKey="goal" name="Target" fill="var(--primary-light)" radius={[6,6,0,0]} animationDuration={1200}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
