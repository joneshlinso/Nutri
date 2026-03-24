import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

// Mock Data
const weightData = [
  { date: "Oct 1", weight: 76.5 }, { date: "Oct 5", weight: 76.2 },
  { date: "Oct 10", weight: 75.8 }, { date: "Oct 15", weight: 75.4 },
  { date: "Oct 20", weight: 75.1 }, { date: "Oct 24", weight: 74.8 },
];
const calorieData = [
  { day: "M", eaten: 1800, goal: 1850 }, { day: "T", eaten: 1950, goal: 1850 },
  { day: "W", eaten: 1750, goal: 1850 }, { day: "T", eaten: 1820, goal: 1850 },
  { day: "F", eaten: 2100, goal: 1850 }, { day: "S", eaten: 1600, goal: 1850 },
  { day: "S", eaten: 1840, goal: 1850 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "var(--surface-solid)", padding: "16px 20px", border: "1px solid var(--border)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)" }}>
        <p className="t-xs mb-3 text-secondary">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="t-sm-med text-text">
            {p.name}: <span style={{ color: "var(--text-secondary)", marginLeft: 8 }}>{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition:{ duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };

export default function Progress() {
  return (
    <motion.main className="page-content" initial="hidden" animate="visible" variants={STAGGER}>
      <motion.header variants={FADE_UP} className="mb-12">
         <h1 className="t-display tracking-tight text-text mb-2">Analytics</h1>
         <p className="t-h3 text-secondary">Longitudinal data visualization.</p>
      </motion.header>

      {/* Stats row */}
      <motion.div variants={FADE_UP} className="grid-4 mb-8">
        {[
          { label: "Current Density", val: "74.8 kg" },
          { label: "Delta Shift",    val: "-1.7 kg" },
          { label: "Active Streak",  val: "5 Days" },
          { label: "Water Avg",  val: "6.2 L" },
        ].map((s,i) => (
          <div key={i} className="card p-10 card-hover text-center">
            <span className="t-xs block mb-4">{s.label}</span>
            <div className="t-h1 text-text">{s.val}</div>
          </div>
        ))}
      </motion.div>

      <div className="bento-grid">
        {/* Weight Trend */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 8" }}>
          <div className="card p-10 h-full card-hover">
            <h3 className="t-xs mb-10">Weight Trajectory</h3>
            <div style={{ height: 360, width: "100%", marginLeft: -20 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--text)" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="var(--text)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-dark)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="weight" name="Density (kg)" stroke="var(--text)" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" animationDuration={1500} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Calorie Intake Bar Chart */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 4" }}>
          <div className="card p-10 h-full card-hover">
            <h3 className="t-xs mb-10">Energy Balance</h3>
            <div style={{ height: 360, width: "100%", marginLeft: -10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,32,28,0.03)' }} />
                  <Bar dataKey="eaten" name="Consumed" fill="var(--text)" radius={[4, 4, 0, 0]} animationDuration={1500} animationEasing="ease-out" />
                  <Bar dataKey="goal" name="Target" fill="rgba(26,32,28,0.08)" radius={[4, 4, 0, 0]} animationDuration={1500} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
