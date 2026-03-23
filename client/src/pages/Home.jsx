import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, useAnimation } from "framer-motion";
import TiltCard from "../components/TiltCard";
import { Flame, Droplet, Sparkles, ChevronRight, Apple, Play, Plus } from "lucide-react";

// Mock Data
const DAILY_GOAL = 1850;
const CONSUMED = 1420;
const MACROS = [
  { label: "Protein", current: 88, goal: 145, color: "var(--protein)" },
  { label: "Carbs",   current: 162, goal: 185, color: "var(--carbs)" },
  { label: "Fat",     current: 45, goal: 58,  color: "var(--fat)" }
];

const STAGGER = { visible: { transition: { staggerChildren: 0.08 } } };
const FADE_UP = { 
  hidden: { opacity: 0, y: 30, scale: 0.98 }, 
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } } 
};

// Custom Liquid SVG Arc Component
function LiquidArc({ progress, color, size = 160 }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {/* Background Track */}
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      {/* Liquid Fill */}
      <motion.circle cx={size/2} cy={size/2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
        style={{ filter: `drop-shadow(0 0 12px ${color})` }}
      />
    </svg>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good evening");
  const [water, setWater] = useState(5);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
  }, []);

  return (
    <motion.main initial="hidden" animate="visible" variants={STAGGER}>
      
      {/* ─── Hero Header ─── */}
      <motion.header variants={FADE_UP} className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="t-display tracking-tighter mix-blend-plus-lighter">
            {greeting}, <span className="grad-text">{user?.name?.split(" ")[0] || "User"}</span>.
          </h1>
          <p className="t-h3 text-muted mt-2">Here is your physiological telemetry.</p>
        </div>
        <div className="flex gap-4">
          <span className="badge badge-orange"><Flame size={14} /> 5 Day Streak</span>
          <Link to="/log" className="btn btn-primary btn-sm rounded-pill">
            <Plus size={16} /> Quick Log
          </Link>
        </div>
      </motion.header>

      <div className="bento-grid">
        
        {/* ─── Core Telemetry (TiltCard) ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 8" }}>
          <TiltCard className="p-10" style={{ display: "flex", alignItems: "center", gap: "var(--sp-12)", background: "rgba(0,0,0,0.6)", borderColor: "rgba(0, 230, 118, 0.3)" }}>
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="t-xs text-primary">Live Intake Tracking</span>
              </div>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="t-stat text-text">{DAILY_GOAL - CONSUMED}</span>
                <span className="t-h3 text-muted">kcal available</span>
              </div>
              
              <div className="macro-bar-track mb-3">
                <div className="macro-bar-fill" style={{ width: `${(CONSUMED/DAILY_GOAL)*100}%`, background: "var(--primary)" }} />
              </div>
              
              <div className="flex justify-between t-sm text-secondary">
                <span>{CONSUMED} metabolized</span>
                <span>{DAILY_GOAL} target</span>
              </div>
            </div>
            
            <div style={{ position:"relative", width: 160, height: 160, flexShrink: 0 }}>
               <LiquidArc progress={CONSUMED/DAILY_GOAL} color="var(--primary)" size={160} />
               <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                 <motion.div animate={{ opacity:[0.5,1,0.5], scale:[0.95,1.05,0.95] }} transition={{ duration: 2, repeat: Infinity }}>
                   <Flame size={40} className="text-primary" style={{ filter: "drop-shadow(0 0 16px rgba(0,230,118,0.8))" }} />
                 </motion.div>
               </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* ─── AI Assistant Card ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 4" }}>
           <TiltCard className="p-8 h-full flex-col justify-between" style={{ background: "rgba(16, 185, 129, 0.05)", borderColor: "rgba(16, 185, 129, 0.15)" }}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 12px var(--primary)", animation: "pulse 2s infinite" }} />
                <span className="t-xs text-primary">NutriAI Active</span>
              </div>
              <p className="t-h3" style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
                You're <span className="text-primary">57g short</span> on protein. A sequence of <em>grilled chicken</em> is recommended for dinner.
              </p>
            </div>
            <Link to="/ai" className="btn btn-secondary btn-w-full mt-8">
              Open Analysis <ChevronRight size={16} />
            </Link>
          </TiltCard>
        </motion.div>

        {/* ─── Macro Distribution ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 6" }}>
          <TiltCard className="p-8">
            <h3 className="t-h3 mb-8">Macronutrients</h3>
            <div className="flex-col gap-6">
              {MACROS.map((m, i) => (
                <div key={m.label}>
                  <div className="flex justify-between t-sm-med mb-2 text-secondary">
                    <span>{m.label}</span>
                    <span style={{ color: m.color }}>{m.current} / {m.goal}g</span>
                  </div>
                  <div className="macro-bar-track">
                    <motion.div className="macro-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(m.current/m.goal)*100}%` }}
                      transition={{ duration: 1.2, delay: 0.1 * i, ease: [0.19, 1, 0.22, 1] }}
                      style={{ background: m.color, color: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </motion.div>

        {/* ─── Hydration ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 6", display: "grid", gridTemplateRows: "auto 1fr", gap: "var(--sp-6)" }}>
          <TiltCard className="p-6 flex justify-between items-center" style={{ background: "rgba(41, 121, 255, 0.05)", borderColor: "rgba(41, 121, 255, 0.15)" }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Droplet size={18} className="text-protein" />
                <span className="t-h3 text-text">Hydration</span>
              </div>
              <p className="t-sm text-muted">{water} of 8 glasses logged</p>
            </div>
            <div className="flex gap-2" style={{ flexWrap: "wrap", width: 160, justifyContent: "flex-end" }}>
              {[...Array(8)].map((_, i) => (
                <motion.button key={i} onClick={() => setWater(i+1)}
                  whileTap={{ scale: 0.8 }}
                  initial={false}
                  animate={{ 
                    background: i < water ? "var(--protein)" : "rgba(255,255,255,0.05)",
                    boxShadow: i < water ? "0 0 20px rgba(41, 121, 255, 0.6)" : "none",
                    scale: i < water ? 1.05 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ width: 32, height: 36, borderRadius: 10, border: "none" }}
                />
              ))}
            </div>
          </TiltCard>

          {/* ─── Timeline ─── */}
          <TiltCard className="p-6">
            <h3 className="t-h3 mb-6">Today's Sequence</h3>
            <div className="flex-col gap-5">
              {[
                { time: "08:30", type: "Breakfast", cal: 420, icon: <Apple size={16} /> },
                { time: "13:15", type: "Lunch",     cal: 650, icon: <Play size={16} style={{transform:"rotate(-90deg)"}} /> },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4 group hover:bg-glass-1 p-2 -ml-2 rounded-lg cursor-pointer transition-all">
                  <div className="t-xs text-muted" style={{ width: 40 }}>{m.time}</div>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--glass-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>
                    {m.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="t-sm-med text-text">{m.type}</div>
                    <div className="t-xs text-muted mt-1">{m.cal} kcal</div>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </motion.div>

      </div>
    </motion.main>
  );
}
