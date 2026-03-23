import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import { TrendingDown, Flame, Droplet, Star } from "lucide-react";
import TiltCard from "../components/TiltCard";

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

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", padding: "16px", border: "1px solid var(--glass-border)", borderRadius: "var(--r-md)", boxShadow: "var(--shadow-neon)" }}>
        <p className="t-xs mb-3">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="t-h3" style={{ color: p.color || "var(--primary)" }}>
            {p.name}: <span className="text-text">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Progress() {
  return (
    <motion.main initial="hidden" animate="visible" variants={STAGGER}>
      <motion.header variants={FADE_UP} className="mb-10 pt-4">
         <h1 className="t-display tracking-tighter text-text">Telemetry <span className="grad-text-primary">Logs</span></h1>
      </motion.header>

      {/* Stats row */}
      <motion.div variants={FADE_UP} className="grid-4 mb-8">
        {[
          { label: "Current Mass", val: "74.8 kg", icon: <TrendingDown size={18}/>, color: "var(--primary)" },
          { label: "Mass Shed",    val: "1.7 kg",  icon: <Star size={18}/>,         color: "var(--protein)" },
          { label: "Sequence Run", val: "5 Days",  icon: <Flame size={18}/>,        color: "var(--carbs)" },
          { label: "Avg Intake",      val: "6.2 L",   icon: <Droplet size={18}/>,      color: "var(--fat)" },
        ].map((s,i) => (
          <TiltCard key={i} className="p-8" style={{ background: i===0?"rgba(0,230,118,0.05)":"var(--glass-2)", borderColor: i===0?"rgba(0,230,118,0.3)":"var(--glass-border)" }}>
            <div className="flex items-center gap-4 mb-4">
              <div style={{ padding:10, borderRadius:12, background:`${s.color}20`, color:s.color, boxShadow: `0 0 16px ${s.color}40` }}>{s.icon}</div>
              <span className="t-xs">{s.label}</span>
            </div>
            <div className="t-stat text-text">{s.val}</div>
          </TiltCard>
        ))}
      </motion.div>

      <div className="bento-grid">
        {/* Weight Trend */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 8" }}>
          <TiltCard className="p-8 h-full relative" style={{ background: "rgba(0,0,0,0.6)" }}>
            <h3 className="t-h3 text-text mb-8">Mass Trajectory</h3>
            <div style={{ height: 340, width: "100%", marginLeft: -10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--glass-border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="weight" name="Mass (kg)" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#weightGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>
        </motion.div>

        {/* Calorie Intake Bar Chart */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 4" }}>
          <TiltCard className="p-8 h-full" style={{ background: "rgba(0,0,0,0.6)" }}>
            <h3 className="t-h3 text-text mb-8">Metabolic Intake</h3>
            <div style={{ height: 340, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="eaten" name="Intake (kcal)" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="goal" name="Target" fill="var(--glass-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </motion.main>
  );
}
