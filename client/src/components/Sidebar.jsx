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
      <NavLink to="/log" style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: "8px",
        marginBottom: 48, 
        width: '100%', 
        padding: "12px", 
        border: "1px solid var(--ink-30)", 
        borderRadius: "4px", 
        background: "transparent", 
        color: "var(--ink)", 
        textDecoration: "none", 
        fontSize: "0.85rem", 
        fontWeight: 500,
        transition: "var(--transition-slow)" 
      }} onMouseOver={e => { e.currentTarget.style.background = "var(--ink-10)"; }} onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}>
        <Plus size={16} strokeWidth={1.25} />
        Log Meal
      </NavLink>

      {/* ─── Nav Items ─── */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {NAV_LINKS.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} style={{ padding: "10px 12px", transition: "var(--transition-slow)" }}>
            <Icon size={20} strokeWidth={1.25} />
            <span style={{ fontWeight: 400, letterSpacing: "0.02em" }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ─── Profile ─── */}
      <div style={{ marginTop: 'auto', paddingTop: 32, borderTop: '1px solid var(--ink-10)' }}>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} style={{ marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: '0.65rem', fontWeight: 500, color: "var(--cream)", letterSpacing: "0.05em" }}>
            {initials}
          </div>
          <span style={{ flex: 1, fontWeight: 400, letterSpacing: "0.02em" }}>{user.name?.split(" ")[0]}</span>
        </NavLink>
        <button onClick={logout} className="nav-item" style={{ background: "transparent", border: "none", width: "100%", textAlign: "left", cursor: "pointer", color: "var(--ink-60)", transition: "var(--transition-slow)" }} onMouseOver={e => e.currentTarget.style.color = "var(--ink)"} onMouseOut={e => e.currentTarget.style.color = "var(--ink-60)"}>
          <LogOut size={18} strokeWidth={1.25} />
          <span style={{ fontWeight: 400, letterSpacing: "0.02em" }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
