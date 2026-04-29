import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import api from "../api/axiosInstance";
import WellnessBloom from "../components/WellnessBloom";

const SoftTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#FFF", padding: "12px 16px", borderRadius: 2, border: "1px solid rgba(184,146,74,.2)", boxShadow: "0 4px 20px rgba(26,22,18,.08)" }}>
      <p style={{ fontSize: "0.6rem", letterSpacing: "0.02em",  color: "var(--ink-60)", marginBottom: 8 }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--ink)" }}>{p.name}: <span style={{color:"var(--gold)"}}>{p.value}</span></p>)}
    </div>
  );
};

const FADE = (delay=0) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.5, ease:[0.34,1.56,0.64,1], delay} });

export default function Progress() {
  const [data, setData] = useState({
    weightTrend: [],
    calorieData: [],
    stats: { currentWeight: "--", weightLost: "0.0 kg", avgWater: "0.0 L" }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get("/logs/progress");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const statsList = [
    { label: "Current Weight", val: data.stats.currentWeight, emoji: "⚖️" },
    { label: "Weight Lost", val: data.stats.weightLost, emoji: "📉" },
    { label: "Streak", val: "5 Days", emoji: "🔥" }, // Still hardcoded as streak logic isn't in backend yet
    { label: "Avg Hydration", val: data.stats.avgWater, emoji: "💧" },
  ];

  const logWeight = async (e) => {
    e.preventDefault();
    const val = e.target.weight.value;
    if (!val) return;
    try {
      await api.patch("/logs/weight", { weight: parseFloat(val) });
      const res = await api.get("/logs/progress");
      setData(res.data);
      e.target.reset();
    } catch (err) {
      console.error("Failed to log weight", err);
    }
  };

  if (loading) return <div className="page-content">Loading progress...</div>;

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1>Progress</h1>
          <p>Your health metrics over time.</p>
        </div>
        <motion.form {...FADE(0.1)} onSubmit={logWeight} style={{ display: "flex", gap: 8, background: "var(--card-bg)", padding: "8px 12px", border: "var(--border)", borderRadius: 2 }}>
          <input name="weight" type="number" step="0.1" placeholder="Log weight (kg)" style={{ border: "none", outline: "none", fontSize: "0.85rem", width: 120 }} />
          <button type="submit" className="cta-btn" style={{ height: 36, padding: "0 16px" }}>Save</button>
        </motion.form>
      </div>


      <motion.div {...FADE(0.05)} className="card" style={{ display: "flex", justifyContent: "space-between", padding: "32px 40px", marginBottom: 24 }}>
        {statsList.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < statsList.length - 1 ? "1px solid var(--ink-10)" : "none" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.emoji}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, color: "var(--ink)", lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.02em", color: "var(--ink-60)", marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 20 }}>
        
        {/* Wellness Bloom Data Art */}
        <motion.div {...FADE(0.08)} style={{ gridColumn: "span 4" }}>
          <div className="card" style={{ padding: 32, height: "100%", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>Wellness Aura</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--ink-60)", marginBottom: 24, fontStyle: "italic" }}>Your habits, visualized.</p>
            <div style={{ flex: 1, minHeight: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <WellnessBloom stats={data.stats} />
            </div>
          </div>
        </motion.div>

        <motion.div {...FADE(0.10)} style={{ gridColumn: "span 4" }}>
          <div className="card" style={{ padding: 32, height: "100%" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 24 }}>Weight Trend</h3>
            <div style={{ height: 250, marginLeft: -16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weightTrend}>
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
            <div style={{ height: 250, marginLeft: -16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.calorieData} barSize={8}>
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
