import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, CalendarDays, BarChart2,
  Sparkles, User, Leaf, LogOut, Plus
} from "lucide-react";

const NAV = [
  { to: "/",         icon: LayoutDashboard, label: "Dashboard"  },
  { to: "/planner",  icon: CalendarDays,    label: "Meal Plan"  },
  { to: "/progress", icon: BarChart2,       label: "Progress"   },
  { to: "/ai",       icon: Sparkles,        label: "AI Coach",  badge: "AI" },
  { to: "/profile",  icon: User,            label: "Profile"    },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()
    : "U";

  return (
    <aside className="sidebar" style={{ width: 260 }}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🥗</div>
        <div>
          <div className="t-h3" style={{ lineHeight: 1.2 }}>NutriPlanner</div>
          <div className="t-xs text-muted">AI Nutrition Coach</div>
        </div>
      </div>

      {/* Quick add */}
      <button
        className="btn btn-primary btn-w-full mb-6"
        onClick={() => navigate("/log")}
        style={{ borderRadius: "var(--r-md)" }}
      >
        <Plus size={16} /> Log a Meal
      </button>

      {/* Navigation */}
      <nav className="flex-col gap-1" style={{ display: "flex" }}>
        {NAV.map(({ to, icon: Icon, label, badge }) => (
          <NavLink key={to} to={to} end={to === "/"}>
            {({ isActive }) => (
              <div className={`nav-item ${isActive ? "active" : ""}`}>
                <span className="nav-icon"><Icon size={18} /></span>
                {label}
                {badge && <span className="nav-badge">{badge}</span>}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User footer */}
      <div
        className="flex items-center gap-3 p-4"
        style={{ borderTop: "1px solid var(--border)", marginTop: "auto" }}
      >
        <div className="avatar" style={{ width: 38, height: 38, fontSize: 14 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-sm-med" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.name || "User"}
          </div>
          <div className="t-xs text-muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.email}
          </div>
        </div>
        <button className="btn-icon" onClick={logout} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
