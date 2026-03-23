import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Apple, Play } from "lucide-react";

// Mock Data
const DAILY_GOAL = 1850;
const CONSUMED = 1420;
const MACROS = [
  { label: "Protein", current: 88, goal: 145, color: "var(--protein)" },
  { label: "Carbs",   current: 162, goal: 185, color: "var(--carbs)" },
  { label: "Fat",     current: 45, goal: 58,  color: "var(--fat)" }
];

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
    <main className="page-content fade-in">
      
      {/* ─── Hero Header ─── */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="t-display mb-1">{greeting}, {user?.name?.split(" ")[0] || "User"}</h1>
          <p className="t-body">Your daily summary</p>
        </div>
        <div>
          <span className="t-sm-med text-text mr-4">5 Day Streak</span>
        </div>
      </header>

      <div className="bento-grid">
        
        {/* ─── Core Telemetry ─── */}
        <div style={{ gridColumn: "span 8" }}>
          <div className="card p-8 flex items-center justify-between" style={{ height: "100%" }}>
            <div style={{ flex: 1 }}>
              <h2 className="t-h3 mb-6">Daily Intake</h2>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="t-stat">{DAILY_GOAL - CONSUMED}</span>
                <span className="t-body">kcal available</span>
              </div>
              
              <div className="macro-bar-track mb-2">
                <div className="macro-bar-fill" style={{ width: `${(CONSUMED/DAILY_GOAL)*100}%`, background: "var(--primary)" }} />
              </div>
              
              <div className="flex justify-between t-sm">
                <span>{CONSUMED} consumed</span>
                <span>{DAILY_GOAL} goal</span>
              </div>
            </div>
            
            {/* Flat Minimal Circle */}
            <div style={{ width: 140, height: 140, position: "relative", marginLeft: "var(--sp-8)" }}>
              <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="4" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="4" strokeDasharray="282.7" strokeDashoffset={282.7 - (CONSUMED/DAILY_GOAL)*282.7} transition="stroke-dashoffset 0.6s ease" />
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span className="t-h3">{Math.round((CONSUMED/DAILY_GOAL)*100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── AI Insight ─── */}
        <div style={{ gridColumn: "span 4" }}>
           <div className="card p-8 h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)" }} />
                <span className="t-xs">Insight</span>
              </div>
              <p className="t-body-med mb-6">
                You are 57g short on protein currently. I suggest adding a lean protein source like chicken breast or a protein shake to your next meal.
              </p>
            </div>
            <Link to="/ai" className="t-sm-med text-primary hover:text-text transition-colors">
              Ask AI &rarr;
            </Link>
          </div>
        </div>

        {/* ─── Macro Distribution ─── */}
        <div style={{ gridColumn: "span 6" }}>
          <div className="card p-8">
            <h3 className="t-h3 mb-6">Macronutrients</h3>
            <div className="flex-col gap-5">
              {MACROS.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between t-sm mb-2">
                    <span className="text-text">{m.label}</span>
                    <span className="text-secondary">{m.current} / {m.goal}g</span>
                  </div>
                  <div className="macro-bar-track">
                    <div className="macro-bar-fill" style={{ width: `${(m.current/m.goal)*100}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Hydration & Timeline ─── */}
        <div style={{ gridColumn: "span 6", display: "grid", gridTemplateRows: "auto 1fr", gap: "var(--sp-6)" }}>
          
          <div className="card p-6 flex justify-between items-center">
            <div>
              <div className="t-h3 mb-1">Hydration</div>
              <p className="t-sm">{water} / 8 glasses</p>
            </div>
            <div className="flex gap-2" style={{ flexWrap: "wrap", width: 140, justifyContent: "flex-end" }}>
              {[...Array(8)].map((_, i) => (
                <button key={i} onClick={() => setWater(i+1)}
                  style={{ 
                    width: 24, height: 24, borderRadius: 4, 
                    background: i < water ? "var(--protein)" : "var(--border)", 
                    border: "none", cursor: "pointer", transition: "background 0.2s ease" 
                  }}
                />
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="t-h3 mb-6">Timeline</h3>
            <div className="flex-col gap-4">
              {[
                { time: "08:30", type: "Breakfast", cal: 420 },
                { time: "13:15", type: "Lunch",     cal: 650 },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="t-sm text-secondary" style={{ width: 44 }}>{m.time}</div>
                  <div style={{ width: 1, height: 20, background: "var(--border)" }} />
                  <div style={{ flex: 1 }}>
                    <div className="t-body-med">{m.type}</div>
                  </div>
                  <div className="t-sm text-secondary">{m.cal} kcal</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
