import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Apple, Calendar, Target,
  Sparkles, User, LogOut, Plus
} from "lucide-react";

const NAV_LINKS = [
  { path: "/",         label: "Dashboard", icon: LayoutDashboard },
  { path: "/log",      label: "Meal Log",  icon: Apple },
  { path: "/planner",  label: "Planner",   icon: Calendar },
  { path: "/progress", label: "Progress",  icon: Target },
  { path: "/ai",       label: "AI Coach",  icon: Sparkles, isAi: true },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials = user.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  return (
    <aside className="sidebar">
      {/* ─── Logo ─── */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Apple size={24} style={{ color: "#fff" }} />
        </div>
        <div>
          <h2 className="t-h3" style={{ letterSpacing: "-0.02em" }}>NutriPlanner</h2>
          <p className="t-xs text-muted" style={{ fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Pro</p>
        </div>
      </div>

      {/* ─── Quick Add FAB Data ─── */}
      <NavLink to="/log" className="btn btn-primary btn-w-full" style={{ marginBottom: "var(--sp-8)", padding: "14px", justifyContent: "space-between" }}>
        <span>Log Meal</span>
        <Plus size={18} />
      </NavLink>

      {/* ─── Nav ─── */}
      <nav className="flex-col gap-2" style={{ flex: 1 }}>
        <p className="t-xs text-muted mb-2" style={{ paddingLeft: "var(--sp-4)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Main Menu</p>
        {NAV_LINKS.map(({ path, label, icon: Icon, isAi }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Icon size={18} className="nav-icon" style={{ opacity: isAi ? 1 : 0.8, color: isAi ? "var(--primary)" : "inherit" }} />
            <span style={{ fontWeight: isAi ? 600 : 500 }}>{label}</span>
            {isAi && (
              <span className="badge badge-green" style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "2px 6px" }}>Beta</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ─── Profile / Settings ─── */}
      <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "var(--sp-6)" }}>
        <p className="t-xs text-muted mb-3" style={{ paddingLeft: "var(--sp-4)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Preferences</p>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, border: "1px solid rgba(255,255,255,0.05)" }}>
            {initials}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <p className="t-sm-med" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
          </div>
          <User size={16} className="text-muted" />
        </NavLink>
        
        <button onClick={logout} className="nav-item mt-2" style={{ color: "var(--error)" }}>
          <LogOut size={18} style={{ opacity: 0.8 }} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
