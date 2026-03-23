import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Leaf, Eye, EyeOff, Globe } from "lucide-react";

export default function Login() {
  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      mode === "login"
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "linear-gradient(135deg,#E8F5E9,#C8E6C9)"
    }}>
      {/* Left hero panel */}
      <div className="flex-col items-center" style={{
        display:"flex", justifyContent:"center", padding:"48px",
        background: "linear-gradient(160deg,var(--primary-dark),var(--primary))",
      }}>
        <div style={{ color:"#fff", maxWidth:380 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="sidebar-logo-icon" style={{ width:52,height:52,fontSize:26 }}>🥗</div>
            <span className="t-h2" style={{color:"#fff"}}>NutriPlanner</span>
          </div>
          <h1 className="t-display mb-4" style={{ color:"#fff", lineHeight:1.15 }}>
            Eat smart.<br />Live well.
          </h1>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"1.0625rem", lineHeight:1.7 }}>
            Track every meal, hit your macros, and get AI-powered suggestions tailored just for you.
          </p>
          <div className="flex-col" style={{ display:"flex", gap:16, marginTop:40 }}>
            {["Log meals in under 30 seconds","AI meal recommendations","Track macros & calories"].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div style={{ width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <span style={{ color:"#fff",fontSize:12 }}>✓</span>
                </div>
                <span style={{ color:"rgba(255,255,255,0.85)",fontSize:".9375rem" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-col items-center" style={{ display:"flex", justifyContent:"center", padding:"48px 64px" }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          <h2 className="t-h2 mb-2">{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="text-muted t-sm mb-6">{mode === "login" ? "Sign in to continue" : "Start your nutrition journey"}</p>

          {error && (
            <div style={{ background:"rgba(232,84,84,.1)", border:"1.5px solid var(--error)", borderRadius:"var(--r-md)", padding:"10px 14px", marginBottom:16, color:"var(--error)", fontSize:".875rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {mode === "signup" && (
              <div className="input-wrap">
                <label className="input-label">Full Name</label>
                <input className="input" placeholder="Alex Chen" value={form.name} onChange={set("name")} required />
              </div>
            )}
            <div className="input-wrap">
              <label className="input-label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
            </div>
            <div className="input-wrap">
              <label className="input-label">Password</label>
              <div style={{ position:"relative" }}>
                <input className="input" type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={form.password} onChange={set("password")} required style={{ paddingRight:44 }} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {mode === "login" && (
              <div style={{ textAlign:"right", marginTop:-8 }}>
                <span className="text-primary t-xs" style={{ cursor:"pointer", fontWeight:600 }}>Forgot password?</span>
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-lg btn-w-full" disabled={loading} style={{ marginTop:4 }}>
              {loading ? <span style={{ width:18,height:18,border:"2.5px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite" }} /> : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 mt-4">
            <div style={{ flex:1, height:1, background:"var(--border)" }} />
            <span className="t-xs text-muted">or continue with</span>
            <div style={{ flex:1, height:1, background:"var(--border)" }} />
          </div>

          <button className="btn btn-secondary btn-w-full mt-4" style={{ height:48 }}>
            <Globe size={18} /> Continue with Google
          </button>

          <p className="text-center t-sm text-muted mt-6">
            {mode === "login" ? "No account? " : "Already have one? "}
            <span className="text-primary" style={{ fontWeight:600, cursor:"pointer" }}
              onClick={() => setMode(m => m === "login" ? "signup" : "login")}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
