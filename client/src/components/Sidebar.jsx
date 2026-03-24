import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Apple, Calendar, Target, Sparkles, User, LogOut, Plus } from "lucide-react";

const NAV_LINKS = [
  { path: "/",         label: "Home",      icon: LayoutDashboard },
  { path: "/log",      label: "Diet Log",  icon: Apple },
  { path: "/planner",  label: "Planner",   icon: Calendar },
  { path: "/progress", label: "Progress",  icon: Target },
  { path: "/ai",       label: "AI Coach",  icon: Sparkles },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <aside className="sidebar">
      {/* ─── Logo ─── */}
      <div className="brand" style={{ marginBottom: 48, marginTop: 16 }}>
        <span className="brand-name">Nutrire</span>
        <span className="brand-sub">Daily Wellness Journal</span>
      </div>

      {/* ─── Log CTA ─── */}
      <NavLink to="/log" className="cta-btn" style={{ justifyContent: "center", marginBottom: 32, width: '100%' }}>
        <Plus size={14} />
        Log Meal
      </NavLink>

      {/* ─── Nav Items ─── */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_LINKS.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ─── Profile ─── */}
      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--ink-10)' }}>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: '0.6rem', fontWeight: 600, color: "var(--cream)" }}>
            {initials}
          </div>
          <span style={{ flex: 1 }}>{user.name?.split(" ")[0]}</span>
        </NavLink>
        <button onClick={logout} className="nav-item">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
