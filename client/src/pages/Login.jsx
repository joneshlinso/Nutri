import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError("");
    try {
      mode === "login"
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Check credentials.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      
      <motion.div
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.55, ease:[0.34, 1.56, 0.64, 1] }}
        style={{ width: "100%", maxWidth: 440, background: "#FFFFFF", border: "1px solid rgba(184,146,74,.2)", borderRadius: 2, padding: 48, boxShadow: "0 8px 60px rgba(26,22,18,.05)" }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 2, background: "var(--cream-dark)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: "1px solid rgba(184,146,74,.2)" }}>
            <Sparkles size={24} style={{ color: "var(--ink)" }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 300, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1, marginBottom: 8 }}>
            {mode === "login" ? "Welcome Back" : "Join Nutrire"}
          </h1>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)" }}>
            {mode === "login" ? "Daily Wellness Journal" : "Elevate your health journey."}
          </p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {mode === "signUp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", fontWeight: 600 }}>Name</label>
              <input style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", outline: "none" }} placeholder="Alexandra Chen" required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", fontWeight: 600 }}>Email</label>
            <input type="email" style={{ padding: "14px 16px", background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", outline: "none" }} placeholder="alexandra@nutrire.test" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ink-60)", fontWeight: 600 }}>Password</label>
            <div style={{ position:"relative" }}>
              <input type={show?"text":"password"} style={{ width: "100%", padding: "14px 16px", paddingRight: 48, background: "var(--cream)", border: "1px solid var(--ink-10)", borderRadius: 2, fontSize: "0.95rem", fontFamily: "'Montserrat', sans-serif", color: "var(--ink)", outline: "none" }} placeholder="••••••••" required value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
              <button type="button" onClick={()=>setShow(!show)} style={{ position:"absolute", right:14, top:14, background:"none", border:"none", color:"var(--ink-60)", cursor:"pointer" }}>
                {show ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "12px 16px", borderRadius: 2, background: "rgba(196,98,58,.08)", color: "var(--rust)", fontSize: "0.85rem", fontWeight: 500, border: "1px solid rgba(196,98,58,.2)" }}>
              {error}
            </div>
          )}

          {/* Demo hint */}
          <div style={{ padding: "16px", borderRadius: 2, background: "var(--cream-dark)", fontSize: "0.8rem", textAlign: "center", border: "1px solid rgba(184,146,74,.2)" }}>
            <span style={{ color: "var(--ink-60)" }}>Demo credentials: </span>
            <span style={{ color: "var(--ink)", fontWeight: 500, fontFamily: "monospace" }}>admin@nutri.com</span>
            <span style={{ color: "var(--ink-60)" }}> / </span>
            <span style={{ color: "var(--ink)", fontWeight: 500, fontFamily: "monospace" }}>password</span>
          </div>

          <button type="submit" disabled={loading} className="cta-btn" style={{ marginTop: 8, padding: "16px", width: "100%", justifyContent: "center", fontSize: "0.8rem" }}>
            {loading ? "Authenticating..." : mode==="login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.85rem", marginTop: 32, color: "var(--ink-60)" }}>
          {mode==="login" ? "Don't have an account? " : "Already a member? "}
          <span style={{ color: "var(--gold)", cursor: "pointer", fontWeight: 600, borderBottom: "1px solid transparent", transition: "all 0.2s" }} onClick={(e)=>{ setMode(mode==="login"?"signUp":"login"); e.target.style.borderBottomColor = "var(--gold)"; }} onMouseOut={e=>e.target.style.borderBottomColor="transparent"}>
            {mode==="login" ? "Request Access" : "Sign In"}
          </span>
        </p>

      </motion.div>
    </div>
  );
}
