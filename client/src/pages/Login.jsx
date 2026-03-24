import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Apple } from "lucide-react";
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
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:"var(--sp-5)" }}>
      
      <motion.div
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.55, ease:[0.34, 1.56, 0.64, 1] }}
        className="card" style={{ width:"100%", maxWidth:400, padding:"var(--sp-10)" }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div style={{ width:64, height:64, borderRadius:20, background:"var(--accent-cta)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto var(--sp-5)" }}>
            <Apple size={32} color="#FFF" />
          </div>
          <h1 className="t-h1">{mode === "login" ? "Welcome back" : "Join NutriPlanner"}</h1>
          <p className="t-body mt-2">{mode === "login" ? "Track calories, eat smarter." : "Your health journey starts here."}</p>
        </div>

        <form onSubmit={submit} className="flex-col gap-4">
          {mode === "signUp" && (
            <div className="input-wrap">
              <label className="input-label">Name</label>
              <input className="input" placeholder="Alex Chen" required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            </div>
          )}
          <div className="input-wrap">
            <label className="input-label">Email</label>
            <input type="email" className="input" placeholder="you@email.com" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
          </div>
          <div className="input-wrap">
            <label className="input-label">Password</label>
            <div style={{ position:"relative" }}>
              <input type={show?"text":"password"} className="input" placeholder="••••••••" required value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} style={{ paddingRight:48 }} />
              <button type="button" onClick={()=>setShow(!show)} style={{ position:"absolute", right:14, top:14, background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer" }}>
                {show ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding:"12px 16px", borderRadius:"var(--r-md)", background:"rgba(220,76,76,0.08)", color:"#C04040", fontSize:".85rem", fontWeight:500 }}>
              {error}
            </div>
          )}

          {/* Demo hint */}
          <div className="card-inset" style={{ padding:"12px 16px", borderRadius:"var(--r-md)", fontSize:".8rem" }}>
            <span className="text-muted">Demo: </span>
            <span className="t-sm-med">admin@nutri.com</span>
            <span className="text-muted"> / </span>
            <span className="t-sm-med">password</span>
          </div>

          <button type="submit" className="btn btn-cta btn-lg btn-w-full mt-2" disabled={loading}>
            {loading ? "Signing in..." : mode==="login" ? "Start Your Journey" : "Create Account"}
          </button>
        </form>

        <p className="text-center t-sm mt-6">
          {mode==="login" ? "No account? " : "Already have one? "}
          <span className="text-primary" style={{ cursor:"pointer", fontWeight:600 }} onClick={()=>setMode(mode==="login"?"signUp":"login")}>
            {mode==="login" ? "Sign up free" : "Sign in"}
          </span>
        </p>

      </motion.div>
    </div>
  );
}
