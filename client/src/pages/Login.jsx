import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Apple, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Authentication failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg)" }}>
      <div style={{ width: 400, padding: "var(--sp-12) var(--sp-8)" }}>
        
        {/* ─── Quiet Logo ─── */}
        <div className="flex justify-center mb-8">
          <div style={{ width: 40, height: 40, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Apple size={20} className="text-text" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="t-h1 mb-2">NutriPlanner</h1>
          <p className="t-body">{mode === "login" ? "Sign in to your account" : "Create your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-4">
          {mode === "signUp" && (
            <div className="input-wrap">
              <label className="input-label">Name</label>
              <input className="input" placeholder="Alex Chen" required
                value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
          )}
          
          <div className="input-wrap">
            <label className="input-label">Email</label>
            <input type="email" className="input" placeholder="name@domain.com" required
              value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>

          <div className="input-wrap relative">
            <label className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} className="input" placeholder="••••••••" required
                value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 12, top: 10, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="p-3 t-sm rounded-md" style={{ background: "transparent", color: "var(--fat)", border: "1px solid var(--fat)", opacity: 0.9 }}>{error}</div>}

          <div style={{ padding: 12, borderRadius: "var(--r-sm)", border: "1px solid var(--border)", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4 }}>
            <span>Demo: </span> <span style={{ color: "var(--text)" }}>admin@nutri.com</span> / <span style={{ color: "var(--text)" }}>password</span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full mt-2" disabled={loading}>
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Continue"}
          </button>
        </form>

        <p className="text-center t-sm mt-8">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span className="text-text hover:text-primary transition-colors cursor-pointer" onClick={() => setMode(mode === "login" ? "signUp" : "login")}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>

      </div>
    </div>
  );
}
