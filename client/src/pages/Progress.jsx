import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Flame, Award, CalendarCheck } from "lucide-react";

const WEIGHT_DATA = [
  {day:"Jan 1", w:82},{day:"Jan 8", w:81.2},{day:"Jan 15",w:80.6},{day:"Jan 22",w:79.8},
  {day:"Feb 1", w:79.1},{day:"Feb 8", w:78.5},{day:"Feb 15",w:77.9},{day:"Feb 22",w:77.2},
  {day:"Mar 1", w:76.8},{day:"Mar 8", w:76.1},{day:"Mar 15",w:75.5},{day:"Mar 23",w:74.9},
];

const CAL_DATA = [
  {day:"Mon",cal:1720,goal:1850},{day:"Tue",cal:1920,goal:1850},{day:"Wed",cal:1650,goal:1850},
  {day:"Thu",cal:1830,goal:1850},{day:"Fri",cal:1780,goal:1850},{day:"Sat",cal:2100,goal:1850},
  {day:"Sun",cal:1420,goal:1850},
];

const MACRO_CONSISTENCY = [
  { day:"Mon", protein:88, carbs:162, fat:41 },
  { day:"Tue", protein:120,carbs:200, fat:58 },
  { day:"Wed", protein:95, carbs:145, fat:35 },
  { day:"Thu", protein:110,carbs:180, fat:50 },
  { day:"Fri", protein:105,carbs:170, fat:44 },
  { day:"Sat", protein:75, carbs:220, fat:65 },
  { day:"Sun", protein:88, carbs:130, fat:38 },
];

const BADGES = [
  { icon:"🔥",title:"5-Day Streak",  earned:true  },
  { icon:"💪",title:"Protein Goal",  earned:true  },
  { icon:"💧",title:"Hydration Pro", earned:true  },
  { icon:"🥗",title:"7-Day Logger",  earned:false },
  { icon:"⚖️",title:"-5kg Lost",     earned:false },
  { icon:"🏆",title:"30-Day Streak", earned:false },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3" style={{ minWidth:130, fontSize:".8125rem" }}>
      <p style={{ fontWeight:600, marginBottom:6 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ color:p.color, fontWeight:500 }}>
          {p.name}: {p.value}{p.name==="Weight"?"kg":" kcal"}
        </div>
      ))}
    </div>
  );
};

export default function Progress() {
  return (
    <main className="page-content" style={{ background:"var(--bg)", minHeight:"100vh" }}>
      <h1 className="t-h1 mb-1">Progress</h1>
      <p className="t-sm text-muted mb-6">Track your journey over time</p>

      {/* ─── Summary Cards ─── */}
      <div className="grid-4 mb-6">
        {[
          { icon:TrendingUp, label:"Weight Lost",   value:"-7.1 kg", change:"-0.6 kg this week", up:true,  color:"var(--primary)" },
          { icon:Flame,      label:"Avg Calories",  value:"1,774",   change:"vs 1,850 goal",     up:false, color:"var(--carbs)" },
          { icon:CalendarCheck,label:"Days Logged", value:"47",      change:"All time",           up:true,  color:"var(--protein)" },
          { icon:Award,      label:"Streak",        value:"5 days",  change:"Personal best: 12", up:true,  color:"var(--warning)" },
        ].map(({ icon:Icon, label, value, change, up, color }) => (
          <div key={label} className="card stat-card fade-up">
            <div className="flex items-center justify-between mb-3">
              <span className="t-xs text-muted" style={{ textTransform:"uppercase", letterSpacing:".05em" }}>{label}</span>
              <div style={{ width:32,height:32,borderRadius:"var(--r-sm)",background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className={`stat-change ${up?"up":"down"}`}>{up?"↑":"↓"} {change}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-6" style={{ gap:"var(--sp-4)" }}>
        {/* ─── Weight Graph ─── */}
        <div className="card p-6 fade-up">
          <h2 className="t-h3 mb-1">Weight Trend</h2>
          <p className="t-xs text-muted mb-4">Last 12 weeks</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={WEIGHT_DATA} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize:10, fill:"var(--text-muted)" }} tickLine={false} interval={2} />
                <YAxis domain={["dataMin - 1","dataMax + 1"]} tick={{ fontSize:10, fill:"var(--text-muted)" }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="w" name="Weight"
                  stroke="var(--primary)" strokeWidth={2.5}
                  fill="url(#wg)" dot={{ fill:"var(--primary)", r:3 }} activeDot={{ r:5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ─── Calorie Trend ─── */}
        <div className="card p-6 fade-up">
          <h2 className="t-h3 mb-1">Calorie Trend</h2>
          <p className="t-xs text-muted mb-4">This week vs goal</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CAL_DATA} margin={{ top:5, right:5, bottom:0, left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize:10, fill:"var(--text-muted)" }} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:"var(--text-muted)" }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cal" name="Calories" fill="var(--primary)" radius={[6,6,0,0]} opacity={0.85} />
                <Bar dataKey="goal" name="Goal" fill="var(--border)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Macro Consistency ─── */}
      <div className="card p-6 mb-6 fade-up">
        <h2 className="t-h3 mb-1">Macro Consistency</h2>
        <p className="t-xs text-muted mb-4">Daily breakdown this week</p>
        <div className="chart-wrap" style={{ height:220 }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MACRO_CONSISTENCY} margin={{ top:5, right:5, bottom:0, left:-20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize:10, fill:"var(--text-muted)" }} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:"var(--text-muted)" }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="protein" name="Protein" stackId="a" fill="var(--protein)" radius={[0,0,0,0]} />
              <Bar dataKey="carbs"   name="Carbs"   stackId="a" fill="var(--carbs)" />
              <Bar dataKey="fat"     name="Fat"      stackId="a" fill="var(--fat)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Achievements ─── */}
      <div className="card p-6 fade-up">
        <h2 className="t-h3 mb-4">Achievements</h2>
        <div style={{ display:"flex", gap:"var(--sp-4)", flexWrap:"wrap" }}>
          {BADGES.map(b => (
            <div key={b.title} style={{ textAlign:"center", opacity: b.earned ? 1 : 0.35, width:80 }}>
              <div style={{ fontSize:36, marginBottom:6, filter: b.earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
              <div className="t-xs text-muted" style={{ lineHeight:1.3 }}>{b.title}</div>
              {b.earned && <div style={{ width:8,height:8,borderRadius:"50%",background:"var(--primary)",margin:"6px auto 0" }} />}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
