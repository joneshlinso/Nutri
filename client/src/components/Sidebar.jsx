import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LayoutDashboard, Apple, Calendar, Target, Sparkles, User, LogOut, Plus } from "lucide-react";

const NAV_LINKS = [
  { path: "/",         label: "Dashboard", icon: LayoutDashboard },
  { path: "/log",      label: "Diet Log",  icon: Apple },
  { path: "/planner",  label: "Planner",   icon: Calendar },
  { path: "/progress", label: "Analytics", icon: Target },
  { path: "/ai",       label: "AI Coach",  icon: Sparkles, isAi: true },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials = user.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  return (
    <motion.aside 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sidebar"
    >
      <div style={{ position: "sticky", top: "var(--sp-6)", display: "flex", flexDirection: "column", height: "calc(100vh - 48px)" }}>
        
        {/* ─── Web3 Stripe Logo Lockup ─── */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div style={{ width:40,height:40,borderRadius:12,background:"var(--primary)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(0,230,118,0.4)" }}>
            <Apple size={22} style={{ color: "#000" }} />
          </div>
          <div>
            <h2 className="t-h3" style={{ letterSpacing: "-0.02em", color: "#fff" }}>Nutri</h2>
            <p className="t-xs" style={{ color: "var(--primary)" }}>Vision OS</p>
          </div>
        </div>

        {/* ─── Premium Hover Pill Quick Add ─── */}
        <NavLink to="/log" className="btn btn-neon btn-w-full" style={{ marginBottom: "var(--sp-8)", padding: "16px", justifyContent: "space-between" }}>
          <span>Log Meal</span>
          <Plus size={18} />
        </NavLink>

        {/* ─── Nav Links ─── */}
        <nav className="flex-col gap-2" style={{ flex: 1 }}>
          <p className="t-xs mb-3" style={{ paddingLeft: "var(--sp-4)" }}>Main</p>
          {NAV_LINKS.map(({ path, label, icon: Icon, isAi }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              {({ isActive }) => (
                <>
                  {/* Subtle active indicator bar */}
                  {isActive && <motion.div layoutId="nav-indicator" style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:"var(--text)" }} />}
                  <Icon size={18} className="nav-icon" style={{ opacity: isAi ? 1 : 0.8, color: isAi ? "var(--primary)" : "inherit" }} />
                  <span style={{ fontWeight: isActive ? 600 : 500 }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ─── Profile / Settings Footer ─── */}
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--glass-border)", paddingTop: "var(--sp-6)" }}>
          <p className="t-xs mb-3" style={{ paddingLeft: "var(--sp-4)" }}>System</p>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--glass-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, border: "1px solid var(--glass-highlight)", color: "var(--text)" }}>
              {initials}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <p className="t-sm" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text)" }}>{user.name}</p>
            </div>
          </NavLink>
          
          <button onClick={logout} className="nav-item mt-2" style={{ color: "var(--fat)" }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
