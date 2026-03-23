import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { motion } from "framer-motion";
import { TrendingDown, Flame, Droplet, Star } from "lucide-react";

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
const macroData = [
  { day: "M", p: 130, c: 190, f: 50 }, { day: "T", p: 145, c: 210, f: 65 },
  { day: "W", p: 120, c: 170, f: 45 }, { day: "T", p: 140, c: 185, f: 55 },
  { day: "F", p: 110, c: 250, f: 80 }, { day: "S", p: 150, c: 150, f: 40 },
  { day: "S", p: 142, c: 180, f: 58 },
];

const STAGGER = { visible: { transition: { staggerChildren: 0.05 } } };
const FADE_UP = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "var(--surface)", backdropFilter: "blur(12px)", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", boxShadow: "var(--shadow-md)" }}>
        <p className="t-xs text-muted mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="t-sm-med" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Progress() {
  return (
    <motion.main className="page-content" initial="hidden" animate="visible" variants={STAGGER}>
      <motion.h1 variants={FADE_UP} className="t-h1 mb-8">Your <span className="grad-text">Progress</span></motion.h1>

      {/* Stats row */}
      <motion.div variants={FADE_UP} className="grid-4 mb-6">
        {[
          { label: "Current Weight", val: "74.8 kg", icon: <TrendingDown size={18}/>, color: "var(--primary)" },
          { label: "Weight Lost",    val: "1.7 kg",  icon: <Star size={18}/>,         color: "var(--protein)" },
          { label: "Streak",         val: "5 Days",  icon: <Flame size={18}/>,        color: "var(--carbs)" },
          { label: "Avg Water",      val: "6.2 L",   icon: <Droplet size={18}/>,      color: "var(--info)" },
        ].map((s,i) => (
          <div key={i} className="card p-6" style={{ background: i===0?"linear-gradient(135deg, rgba(16,185,129,0.1), transparent)":"var(--surface)", borderColor: i===0?"rgba(16,185,129,0.3)":"var(--border)" }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ padding:6, borderRadius:8, background:`${s.color}20`, color:s.color }}>{s.icon}</div>
              <span className="t-xs text-muted" style={{ fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</span>
            </div>
            <div className="t-h1">{s.val}</div>
          </div>
        ))}
      </motion.div>

      <div className="bento-grid">
        {/* Weight Trend */}
        <motion.div variants={FADE_UP} className="card p-6" style={{ gridColumn: "span 8" }}>
          <h3 className="t-h3 mb-6">Weight Trend</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#weightGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Calorie Intake Bar Chart */}
        <motion.div variants={FADE_UP} className="card p-6" style={{ gridColumn: "span 4" }}>
          <h3 className="t-h3 mb-6">Calorie Intake</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="eaten" name="Eaten (kcal)" fill="rgba(16,185,129,0.8)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="goal" name="Goal" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
