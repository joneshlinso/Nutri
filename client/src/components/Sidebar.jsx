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
      <div className="flex items-center gap-3 mb-8 px-2">
        <div style={{ width: 36, height: 36, borderRadius: 12, background: "var(--accent-cta)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Apple size={20} color="#FFF" />
        </div>
        <h2 className="t-h3" style={{ color: "var(--text)", fontWeight: 700 }}>NutriPlanner</h2>
      </div>

      {/* ─── Log CTA ─── */}
      <NavLink to="/log" className="btn btn-cta btn-w-full mb-8 fade-up" style={{ justifyContent: "center", gap: 8 }}>
        <Plus size={18} />
        Log Meal
      </NavLink>

      {/* ─── Nav Items ─── */}
      <nav className="flex-col gap-2" style={{ flex: 1 }}>
        {NAV_LINKS.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ─── Profile ─── */}
      <div style={{ borderTop: "none", paddingTop: "var(--sp-5)" }}>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--accent-cta)" }}>
            {initials}
          </div>
          <span className="t-sm-med" style={{ flex: 1 }}>{user.name?.split(" ")[0]}</span>
        </NavLink>
        <button onClick={logout} className="nav-item mt-2" style={{ color: "var(--text-muted)" }}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
