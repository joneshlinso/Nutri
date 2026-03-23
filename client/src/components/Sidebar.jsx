import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Apple, Calendar, Target, Sparkles, User, LogOut, Plus } from "lucide-react";

const NAV_LINKS = [
  { path: "/",         label: "Dashboard", icon: LayoutDashboard },
  { path: "/log",      label: "Diet Log",  icon: Apple },
  { path: "/planner",  label: "Planner",   icon: Calendar },
  { path: "/progress", label: "Analytics", icon: Target },
  { path: "/ai",       label: "AI Coach",  icon: Sparkles },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials = user.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "U";

  return (
    <aside className="sidebar">
      {/* ─── Quiet Logo ─── */}
      <div className="flex items-center gap-2 mb-8 px-1">
        <Apple size={20} className="text-text" />
        <h2 className="t-h3" style={{ letterSpacing: "-0.02em" }}>NutriPlanner</h2>
      </div>

      {/* ─── Quiet Add Button ─── */}
      <NavLink to="/log" className="btn btn-primary w-full" style={{ marginBottom: "var(--sp-8)", justifyContent: "space-between" }}>
        <span>Log Entry</span>
        <Plus size={16} />
      </NavLink>

      {/* ─── Nav Links ─── */}
      <nav className="flex-col gap-1" style={{ flex: 1 }}>
        <p className="t-xs mb-2 px-3 text-muted">Pages</p>
        {NAV_LINKS.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Icon size={16} className="nav-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ─── Minimal Profile Footer ─── */}
      <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "var(--sp-6)" }}>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} style={{ padding: "8px 12px" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "var(--text)" }}>
            {initials}
          </div>
          <p className="t-sm-med truncate" style={{ flex: 1, color: "var(--text)" }}>{user.name}</p>
        </NavLink>
        
        <button onClick={logout} className="nav-item mt-1 text-muted hover:text-text">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
