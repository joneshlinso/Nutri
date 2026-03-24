import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Apple, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FADE_UP = { 
  hidden: { opacity: 0, y: 30 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } 
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
    <div className="flex items-center justify-center min-h-screen" style={{ position: "relative", overflow: "hidden" }}>
      
      {/* ─── Ambient Spa Lighting ─── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle at top left, rgba(255,255,255,1), transparent 50%), radial-gradient(circle at bottom right, rgba(59, 95, 74, 0.08), transparent 60%)" }} />

      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} 
        className="card" style={{ width: 440, padding: "var(--sp-12)", zIndex: 1, position: "relative", background: "rgba(255,255,255,0.8)" }}>
        
        {/* ─── Luxury Logo ─── */}
        <motion.div variants={FADE_UP} className="flex justify-center mb-10">
          <div style={{ width: 48, height: 48, background: "var(--surface-solid)", border: "1px solid var(--border-dark)", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)" }}>
            <Apple size={24} className="text-text" />
          </div>
        </motion.div>

        <motion.div variants={FADE_UP} className="text-center mb-10">
          <h1 className="t-h2 mb-2">NutriPlanner</h1>
          <p className="t-body">Your digital nutrition concierge.</p>
        </motion.div>

        <motion.form variants={FADE_UP} onSubmit={handleSubmit} className="flex-col gap-5">
          <AnimatePresence mode="popLayout">
            {mode === "signUp" && (
              <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="input-wrap">
                <label className="input-label">Full Name</label>
                <input className="input" placeholder="Alex Chen" required
                  value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </motion.div>
            )}
          </AnimatePresence>
          
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
                style={{ position: "absolute", right: 14, top: 14, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="p-3 t-sm rounded-md" style={{ background: "rgba(155, 122, 117, 0.1)", color: "var(--fat)", border: "1px solid rgba(155, 122, 117, 0.2)" }}>{error}</motion.div>}

          <div style={{ padding: 12, borderRadius: "var(--r-sm)", border: "1px solid var(--border-dark)", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4, background: "var(--surface-solid)" }}>
            <span style={{ fontWeight: 600 }}>Demo Credentials:</span> <span style={{ color: "var(--text)" }}>admin@nutri.com</span> / <span style={{ color: "var(--text)" }}>password</span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full mt-4" disabled={loading}>
            {loading ? "Authenticating..." : mode === "login" ? "Enter Dashboard" : "Create Account"}
          </button>
        </motion.form>

        <motion.p variants={FADE_UP} className="text-center t-sm mt-8">
          {mode === "login" ? "No account? " : "Already registered? "}
          <span className="text-text hover:text-primary transition-colors cursor-pointer" style={{ fontWeight: 500 }} onClick={() => setMode(mode === "login" ? "signUp" : "login")}>
            {mode === "login" ? "Begin here." : "Sign in here."}
          </span>
        </motion.p>

      </motion.div>
    </div>
  );
}
