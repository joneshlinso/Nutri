import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Apple, Eye, EyeOff, Globe } from "lucide-react";
import TiltCard from "../components/TiltCard";

const STAGGER = { visible: { transition: { staggerChildren: 0.1 } } };
const FADE_UP = { 
  hidden: { opacity: 0, y: 40 }, 
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } } 
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
    <div style={{ display: "flex", minHeight: "100vh", position: "fixed", inset: 0, zIndex: 10 }}>
      
      {/* ─── Left: The Brand Cinematic ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "5rem", justifyContent: "space-between", position: "relative" }}>
        
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="flex items-center gap-3">
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 32px rgba(0,230,118,0.4)" }}>
            <Apple size={28} style={{ color: "#000" }} />
          </div>
          <div>
            <h2 className="t-h2 tracking-tighter text-text">Nutri</h2>
            <p className="t-xs text-primary">Vision OS</p>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={STAGGER} style={{ maxWidth: 540 }}>
          <motion.h1 variants={FADE_UP} className="t-display mb-6" style={{ background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.2) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The definitive nutrition OS.
          </motion.h1>
          <motion.p variants={FADE_UP} className="t-h3 text-secondary mb-12" style={{ fontWeight: 400, lineHeight: 1.5 }}>
            Quantify your nutrition with sub-millimeter precision. AI-driven insights, beautiful tracking, and absolute control.
          </motion.p>
          
          <motion.div variants={FADE_UP} className="flex-col gap-5">
            {[
              "Immersive WebGL interactions", 
              "Real-time metabolic tracking", 
              "Context-aware AI coach"
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--glass-2)", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }} />
                </div>
                <span className="t-body-med text-text">{f}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Right: The Auth Portal ─── */}
      <div style={{ width: 600, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10 }}>
        
        {/* Subtle separator line */}
        <div style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: 1, background: "linear-gradient(to bottom, transparent, var(--glass-border), transparent)" }} />

        <TiltCard style={{ width: 440, padding: "48px 40px", background: "rgba(10,10,12,0.4)" }}>
          <h2 className="t-h2 mb-2 text-center text-text">{mode === "login" ? "Access Portal" : "Initialize Identity"}</h2>
          <p className="t-sm text-muted text-center mb-8">
            {mode === "login" ? "Enter coordinates to sync your dashboard." : "Begin your telemetry sequence."}
          </p>

          <form onSubmit={handleSubmit} className="flex-col gap-5">
            {mode === "signUp" && (
              <div className="input-wrap">
                <label className="input-label">Identified Prefix</label>
                <input className="input" placeholder="Alex Chen" required
                  value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
            )}
            
            <div className="input-wrap">
              <label className="input-label">Transmit Address</label>
              <input type="email" className="input" placeholder="name@domain.com" required
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>

            <div className="input-wrap relative">
              <label className="input-label">Security Key</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} className="input" placeholder="••••••••" required
                  value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 16, top: 16, background: "none", border: "none", color: "var(--text-muted)" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="p-4 t-xs rounded-md" style={{ background: "rgba(255, 23, 68, 0.1)", color: "var(--fat)", border: "1px solid rgba(255, 23, 68, 0.2)" }}>{error}</div>}

            <div style={{ background: "var(--glass-2)", padding: 14, borderRadius: 8, border: "1px solid var(--glass-border)", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4 }}>
              <span className="text-primary font-bold">DEMO BYPASS:</span> <code style={{ color: "#fff", padding: "2px 4px", background: "#000", borderRadius: 4 }}>admin@nutri.com</code> / <code style={{ color: "#fff", padding: "2px 4px", background: "#000", borderRadius: 4 }}>password</code>
            </div>

            <button type="submit" className="btn btn-neon btn-lg btn-w-full mt-4" disabled={loading}>
              {loading ? "Authenticating..." : mode === "login" ? "Initiate Session" : "Create Core"}
            </button>
          </form>

          <div style={{ position: "relative", textAlign: "center", margin: "32px 0 24px" }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--glass-border)" }} />
            <span style={{ position: "relative", background: "transparent", padding: "0 16px", fontSize: ".7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Or continue with</span>
          </div>

          <button className="btn btn-secondary btn-w-full" style={{ padding: 16 }}>
            <Globe size={18} style={{ opacity: 0.8 }} /> External Identity
          </button>

          <p className="text-center t-sm text-secondary mt-8">
            {mode === "login" ? "No identity core found? " : "Core already active? "}
            <span className="text-primary" style={{ fontWeight: 600 }} onClick={() => setMode(mode === "login" ? "signUp" : "login")}>
              {mode === "login" ? "Initialize here" : "Access here"}
            </span>
          </p>
        </TiltCard>
      </div>
    </div>
  );
}
