import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bell, ChevronDown, Plus, Droplets, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const DAILY_GOAL = 1850;
const CONSUMED = 3143;
const BURNED = 650;
const NET_OVER = CONSUMED - DAILY_GOAL; // over by this amount

const MACROS = [
  { label: "Carbs",   current: 271, goal: 359, color: "#E8784A" },
  { label: "Protein", current: 202, goal: 143, color: "#4A8FD8" },
  { label: "Fat",     current: 169, goal: 359, color: "#D4A030" },
];

const FADE = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: d },
});

export default function Home() {
  const { user } = useAuth();
  const [water, setWater] = useState(5);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

  return (
    <main className="page-content" style={{ maxWidth: 680, margin: "0 auto" }}>

      {/* ─── Header ─── */}
      <motion.div {...FADE(0)} className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {/* User avatar */}
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "var(--primary-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "var(--text)",
            boxShadow: "var(--shadow-outer)"
          }}>
            {user?.name?.[0] || "A"}
          </div>
          <div>
            <p className="t-xs">Hi, {user?.name?.split(" ")[0] || "there"}</p>
            <p className="t-sm-med">Welcome Back</p>
          </div>
        </div>
        <button style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "#FFFFFF", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow-outer)"
        }}>
          <Bell size={20} color="var(--text)" />
        </button>
      </motion.div>

      {/* ─── Hero Nutrition Card ─── */}
      <motion.div {...FADE(0.06)} style={{
        background: "#FFFFFF", borderRadius: 28, padding: "28px 24px 24px",
        boxShadow: "var(--shadow-outer)", marginBottom: 16, position: "relative", overflow: "hidden"
      }}>
        {/* Soft decorative blob top-right */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: "50%", background: "var(--primary-light)", opacity: 0.3, zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="t-h2 mb-5">Today's Nutrition<br />Overview</h2>

          {/* Search bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "var(--bg)", borderRadius: 100,
            padding: "0 16px 0 20px", height: 52,
            boxShadow: "var(--shadow-inset)", marginBottom: 24
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              style={{ flex: 1, border: "none", background: "none", fontSize: ".9375rem", color: "var(--text)", outline: "none" }}
              placeholder="Search Recipes.."
            />
            <div style={{ width: 1, height: 20, background: "var(--bg-alt)" }} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/></svg>
          </div>

          {/* Stats */}
          <p className="t-body mb-1">Eaten {CONSUMED.toLocaleString()}</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "clamp(4rem,10vw,6.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--text)" }}>
              {NET_OVER}
            </span>
            <span className="t-h2 text-secondary">kcal over</span>
          </div>
          <p className="t-body mb-5">Burned {BURNED}</p>

          {/* Progress bar */}
          <div style={{ height: 10, borderRadius: 100, background: "var(--bg-alt)", overflow: "hidden", marginBottom: 6 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
              style={{ height: "100%", borderRadius: 100, background: "linear-gradient(90deg, var(--primary), #4B872B)" }}
            />
          </div>

          {/* See Stats */}
          <Link to="/progress" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, color: "var(--text-secondary)", fontSize: ".875rem", fontWeight: 500 }}>
            See Stats <ChevronDown size={14} />
          </Link>
        </div>
      </motion.div>

      {/* ─── Macro Trio (Exact Yazio pill layout) ─── */}
      <motion.div {...FADE(0.12)} style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16
      }}>
        {MACROS.map((m, i) => (
          <div key={m.label} style={{
            background: "#FFFFFF", borderRadius: 20, padding: "16px 18px",
            boxShadow: "var(--shadow-outer)"
          }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: ".8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>{m.label}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>{m.current}</span>
              <span style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>/{m.goal}g</span>
            </div>
            {/* Colored progress bar */}
            <div style={{ height: 5, borderRadius: 100, background: "var(--bg-alt)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((m.current / m.goal) * 100, 100)}%` }}
                transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 + i * 0.08 }}
                style={{ height: "100%", borderRadius: 100, background: m.color }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* ─── Today's Recipes CTA ─── */}
      <motion.div {...FADE(0.18)}>
        <Link to="/log" style={{ textDecoration: "none" }}>
          <div style={{
            background: "var(--primary-light)", borderRadius: 24, padding: "20px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "none", marginBottom: 16
          }}>
            <div>
              <p className="t-xs mb-1">Explore</p>
              <p className="t-h3">Today's Nutritious<br/>Meal Ideas</p>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: "50%", background: "#FFFFFF",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "var(--shadow-outer)", flexShrink: 0
            }}>
              <ArrowRight size={22} color="var(--text)" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* ─── Hydration ─── */}
      <motion.div {...FADE(0.22)} style={{
        background: "#FFFFFF", borderRadius: 24, padding: "20px 24px",
        boxShadow: "var(--shadow-outer)"
      }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Droplets size={20} style={{ color: "var(--protein)" }} />
            <span className="t-h3">Hydration</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>{water}<span className="t-body"> / 8</span></span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[...Array(8)].map((_, i) => (
            <motion.button key={i} whileTap={{ scale: 0.82 }} onClick={() => setWater(i + 1)}
              style={{
                width: 38, height: 44, borderRadius: 12, border: "none", cursor: "pointer",
                background: i < water ? "#4A8FD8" : "var(--bg-alt)",
                boxShadow: i < water ? "none" : "var(--shadow-inset)",
                transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }}
            />
          ))}
        </div>
      </motion.div>

    </main>
  );
}
