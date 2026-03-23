import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

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
      <div style={{ background: "var(--surface)", padding: "12px 16px", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", boxShadow: "var(--shadow-md)" }}>
        <p className="t-xs mb-2 text-secondary">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="t-sm-med" style={{ color: "var(--text)" }}>
            {p.name}: <span style={{ color: p.stroke || p.fill || "var(--text-secondary)" }}>{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Progress() {
  return (
    <main className="page-content fade-in">
      <header className="mb-12">
         <h1 className="t-h1 mb-1">Analytics</h1>
         <p className="t-body">Longitudinal data tracking</p>
      </header>

      {/* Stats row */}
      <div className="grid-4 mb-8">
        {[
          { label: "Current Weight", val: "74.8 kg" },
          { label: "Weight Lost",    val: "1.7 kg" },
          { label: "Active Streak",  val: "5 Days" },
          { label: "Avg Hydration",  val: "6.2 L" },
        ].map((s,i) => (
          <div key={i} className="card p-6">
            <span className="t-xs text-secondary block mb-2">{s.label}</span>
            <div className="t-h2 text-text">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="bento-grid">
        {/* Weight Trend */}
        <div style={{ gridColumn: "span 8" }}>
          <div className="card p-8 h-full">
            <h3 className="t-h3 text-text mb-8">Weight Trend</h3>
            <div style={{ height: 320, width: "100%", marginLeft: -20 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="var(--text)" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Calorie Intake Bar Chart */}
        <div style={{ gridColumn: "span 4" }}>
          <div className="card p-8 h-full">
            <h3 className="t-h3 text-text mb-8">Calories</h3>
            <div style={{ height: 320, width: "100%", marginLeft: -10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)' }} />
                  <Bar dataKey="eaten" name="Consumed" fill="var(--text-secondary)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="goal" name="Target" fill="var(--border)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
