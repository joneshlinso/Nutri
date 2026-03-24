import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Apple, Calendar, Target, Sparkles, User, LogOut, Plus } from "lucide-react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { path: "/",         label: "Overview",  icon: LayoutDashboard },
  { path: "/log",      label: "Diet Log",  icon: Apple },
  { path: "/planner",  label: "Planner",   icon: Calendar },
  { path: "/progress", label: "Analytics", icon: Target },
  { path: "/ai",       label: "AI Concierge", icon: Sparkles },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials = user.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  return (
    <motion.aside 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="sidebar"
    >
      <div style={{ position: "sticky", top: "var(--sp-8)", display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
        
        {/* ─── Luxury Logo ─── */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <Apple size={22} className="text-text" />
          <h2 className="t-h3" style={{ letterSpacing: "0.02em" }}>NutriPlanner</h2>
        </div>

        {/* ─── Primary Action ─── */}
        <NavLink to="/log" className="btn btn-primary w-full" style={{ marginBottom: "var(--sp-12)", justifyContent: "space-between", padding: "16px 20px" }}>
          <span>Add Entry</span>
          <Plus size={16} style={{ opacity: 0.6 }} />
        </NavLink>

        {/* ─── Nav Links ─── */}
        <nav className="flex-col gap-2" style={{ flex: 1 }}>
          <p className="t-xs mb-4 px-4 text-muted">Core</p>
          {NAV_LINKS.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              {({ isActive }) => (
                <>
                  <Icon size={18} className="nav-icon" style={{ strokeWidth: isActive ? 2.5 : 2 }} />
                  <span style={{ fontWeight: isActive ? 500 : 400 }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ─── Profile Footer ─── */}
        <div style={{ marginTop: "auto" }}>
          <p className="t-xs mb-4 px-4 text-muted">Account</p>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} style={{ padding: "12px 16px" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "var(--text)" }}>
              {initials}
            </div>
            <p className="t-sm-med truncate" style={{ flex: 1, color: "var(--text)" }}>{user.name}</p>
          </NavLink>
          
          <button onClick={logout} className="nav-item mt-2 text-muted hover:text-text">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
        
      </div>
    </motion.aside>
  );
}
