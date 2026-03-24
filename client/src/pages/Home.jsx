import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Mock Data
const DAILY_GOAL = 1850;
const CONSUMED = 1420;
const MACROS = [
  { label: "Protein", current: 88, goal: 145, color: "var(--protein)" },
  { label: "Carbohydrates", current: 162, goal: 185, color: "var(--carbs)" },
  { label: "Fats", current: 45, goal: 58,  color: "var(--fat)" }
];

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { 
  hidden: { opacity: 0, y: 30 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } 
};

// Clean Luxury Ring
function LuxuryRing({ progress, color, size = 160 }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(26,32,28,0.06)" strokeWidth={strokeWidth} />
      <motion.circle cx={size/2} cy={size/2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
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
    <motion.main className="page-content" initial="hidden" animate="visible" variants={STAGGER}>
      
      {/* ─── Hero Header ─── */}
      <motion.header variants={FADE_UP} className="flex justify-between items-end mb-12">
        <div>
          <h1 className="t-display tracking-tight text-text mb-2">{greeting}, {user?.name?.split(" ")[0] || "User"}</h1>
          <p className="t-h3 text-secondary">Your daily physiological summary.</p>
        </div>
        <div>
          <span className="badge">5 Day Streak</span>
        </div>
      </motion.header>

      <div className="bento-grid">
        
        {/* ─── Core Telemetry ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 8" }}>
          <div className="card p-12 flex items-center justify-between card-hover" style={{ height: "100%" }}>
            <div style={{ flex: 1 }}>
              <h2 className="t-xs mb-8">Daily Intake</h2>
              <div className="flex items-baseline gap-4 mb-8">
                <span className="t-stat text-text">{DAILY_GOAL - CONSUMED}</span>
                <span className="t-body-med text-secondary">kcal remaining</span>
              </div>
              
              <div className="macro-bar-track mb-3">
                <motion.div className="macro-bar-fill"
                  initial={{ width: 0 }} animate={{ width: `${(CONSUMED/DAILY_GOAL)*100}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: "var(--primary)" }} 
                />
              </div>
              
              <div className="flex justify-between t-sm text-secondary">
                <span>{CONSUMED} consumed</span>
                <span>{DAILY_GOAL} target</span>
              </div>
            </div>
            
            <div style={{ width: 180, height: 180, position: "relative", marginLeft: "var(--sp-12)", flexShrink: 0 }}>
              <LuxuryRing progress={CONSUMED/DAILY_GOAL} color="var(--primary)" size={180} />
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span className="t-h2 text-text">{Math.round((CONSUMED/DAILY_GOAL)*100)}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── AI Concierge Preview ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 4" }}>
           <div className="card p-10 h-full flex-col justify-between card-hover" style={{ background: "var(--primary-light)" }}>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Sparkles size={16} className="text-primary" />
                <span className="t-xs text-primary">NutriAI Active</span>
              </div>
              <p className="t-h3" style={{ lineHeight: 1.5 }}>
                You are 57g short on target protein. I suggest adding a lean protein source to your evening meal.
              </p>
            </div>
            <Link to="/ai" className="flex items-center gap-2 t-sm-med text-primary hover:text-text mt-8 transition-colors">
              Open Concierge <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* ─── Macro Distribution ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 6" }}>
          <div className="card p-10 card-hover">
            <h3 className="t-xs mb-8">Macronutrients</h3>
            <div className="flex-col gap-6">
              {MACROS.map((m, i) => (
                <div key={m.label}>
                  <div className="flex justify-between t-sm-med mb-3">
                    <span className="text-text">{m.label}</span>
                    <span className="text-secondary">{m.current} / {m.goal}g</span>
                  </div>
                  <div className="macro-bar-track">
                    <motion.div className="macro-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(m.current/m.goal)*100}%` }}
                      transition={{ duration: 1.2, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Hydration & Timeline ─── */}
        <motion.div variants={FADE_UP} style={{ gridColumn: "span 6", display: "grid", gridTemplateRows: "auto 1fr", gap: "var(--sp-6)" }}>
          
          <div className="card p-8 flex justify-between items-center card-hover">
            <div>
              <div className="t-xs mb-2">Hydration</div>
              <p className="t-h3 text-text">{water} / 8 units</p>
            </div>
            <div className="flex gap-2" style={{ flexWrap: "wrap", width: 140, justifyContent: "flex-end" }}>
              {[...Array(8)].map((_, i) => (
                <button key={i} onClick={() => setWater(i+1)}
                  style={{ 
                    width: 24, height: 28, borderRadius: 6, 
                    background: i < water ? "var(--protein)" : "rgba(26,32,28,0.06)", 
                    border: "none", cursor: "pointer", transition: "all 0.4s var(--ease-spring)" 
                  }}
                />
              ))}
            </div>
          </div>

          <div className="card p-8 card-hover">
            <h3 className="t-xs mb-8">Daily Timeline</h3>
            <div className="flex-col gap-6">
              {[
                { time: "08:30", type: "Breakfast Segment", cal: 420 },
                { time: "13:15", type: "Lunch Segment",     cal: 650 },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="t-sm-med text-secondary" style={{ width: 44 }}>{m.time}</div>
                  <div style={{ flex: 1, borderBottom: "1px dashed var(--border-dark)", display: "flex", justifyContent: "space-between", paddingBottom: 8 }}>
                    <div className="t-body-med text-text">{m.type}</div>
                    <div className="t-sm text-secondary">{m.cal} kcal</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>

      </div>
    </motion.main>
  );
}
