import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Apple, Eye, EyeOff, Globe } from "lucide-react";

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      
      {/* ─── Left: Immersive Branding ─── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "4rem", justifyContent: "space-between", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Background Gradients & Noise */}
        <div style={{ position: "absolute", top:-200, left:-200, width: "800px", height: "800px", background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)", filter: "blur(100px)", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom:-200, right:-200, width: "600px", height: "600px", background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)", filter: "blur(100px)", zIndex: 0 }} />
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#34D399,#047857)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-glow)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Apple size={24} style={{ color: "#fff" }} />
          </div>
          <div>
            <h2 className="t-h3" style={{ letterSpacing: "-0.02em" }}>NutriPlanner</h2>
            <p className="t-xs text-muted" style={{ fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Pro</p>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={STAGGER} style={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
          <motion.h1 variants={FADE_UP} className="t-display mb-6" style={{ background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.6))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Master your<br/>nutrition with AI.
          </motion.h1>
          <motion.p variants={FADE_UP} className="t-h3 text-muted mb-10" style={{ fontWeight: 400, lineHeight: 1.6 }}>
            Track macros, log meals instantly, and get expert AI coaching tailored specifically to your body and goals.
          </motion.p>
          
          <motion.div variants={FADE_UP} className="flex-col gap-4">
            {["Lightning fast meal logging", "Bento-grid dashboard", "Framer-driven micro-interactions"].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)" }} />
                </div>
                <span className="t-sm-med" style={{ color: "rgba(255,255,255,0.8)" }}>{f}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Right: Pristine Glass Form ─── */}
      <div style={{ width: 560, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", damping: 30, stiffness: 200 }} className="card" style={{ width: 400, padding: "40px", background: "rgba(255,255,255,0.02)", boxShadow: "0 24px 80px rgba(0,0,0,0.8)" }}>
          
          <h2 className="t-h2 mb-2 text-center">{mode === "login" ? "Welcome back" : "Create an account"}</h2>
          <p className="t-sm text-muted text-center mb-8">
            {mode === "login" ? "Enter your credentials to access your dashboard." : "Start your journey to better health today."}
          </p>

          <form onSubmit={handleSubmit} className="flex-col gap-4">
            {mode === "signUp" && (
              <div className="input-wrap">
                <label className="input-label">Full Name</label>
                <input className="input" placeholder="Alex Chen" required
                  value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
            )}
            
            <div className="input-wrap">
              <label className="input-label">Email address</label>
              <input type="email" className="input" placeholder="name@example.com" required
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>

            <div className="input-wrap relative">
              <label className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} className="input" placeholder="••••••••" required
                  value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: 14, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="p-3 t-xs" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--error)", borderRadius: "var(--r-sm)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>{error}</div>}

            {mode === "login" && (
              <div style={{ textAlign: "right", marginTop: -8 }}>
                <span className="text-primary t-xs" style={{ cursor: "pointer", fontWeight: 600 }}>Forgot password?</span>
              </div>
            )}

            <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: 12, borderRadius: 8, border: "1px solid rgba(16, 185, 129, 0.1)", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 8 }}>
              <strong>Demo Mode:</strong> Use <code style={{ color: "var(--primary)" }}>admin@nutri.com</code> / <code style={{ color: "var(--primary)" }}>password</code>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-w-full mt-2" disabled={loading}>
              {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div style={{ position: "relative", textAlign: "center", margin: "32px 0 24px" }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--border)" }} />
            <span style={{ position: "relative", background: "var(--surface)", padding: "0 12px", fontSize: ".75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Or continue with</span>
          </div>

          <button className="btn btn-secondary btn-w-full" style={{ padding: 14 }}>
            <Globe size={18} style={{ opacity: 0.8 }} /> Google
          </button>

          <p className="text-center t-sm text-muted mt-8">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span className="text-primary" style={{ fontWeight: 600, cursor: "pointer" }} onClick={() => setMode(mode === "login" ? "signUp" : "login")}>
              {mode === "login" ? "Sign up" : "Log in"}
            </span>
          </p>

        </motion.div>
      </div>
    </div>
  );
}
