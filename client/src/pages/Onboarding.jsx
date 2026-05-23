import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Target, ArrowRight } from "lucide-react";
import api from "../api/axiosInstance";

const GOALS = ["Lose Weight", "Gain Muscle", "Maintenance", "Better Health"];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    goal: "Maintenance",
    calories: "2000",
    protein: "150",
    carbs: "250",
    fat: "70"
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setLoading(true);
    try {
      await api.put('/goals', {
        goal: form.goal,
        calories: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fat: Number(form.fat)
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to save onboarding goals", err);
      // Failsafe: still navigate to dashboard so user isn't stuck
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) setStep(2);
    else submit();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ width: "100%", maxWidth: 640, background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 64, boxShadow: "var(--shadow-deep)", position: "relative", overflow: "hidden" }}
      >
        {/* Subtle decorative orb */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: "var(--aura-orb-1)", filter: "blur(80px)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--cream-dark)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
            <Sparkles size={18} strokeWidth={1.25} style={{ color: "var(--ink)" }} />
          </div>
          <div>
            <p className="text-micro-caps" style={{ letterSpacing: "0.15em", color: "var(--ink-50)" }}>Welcome to Nutrire</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em", marginTop: 4 }}>Let's tailor your journey.</h1>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 24 }}>What is your primary focus?</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
                {GOALS.map(g => (
                  <button
                    key={g}
                    onClick={() => setForm(f => ({ ...f, goal: g }))}
                    style={{
                      padding: "24px 20px",
                      background: form.goal === g ? "var(--ink)" : "var(--cream)",
                      color: form.goal === g ? "var(--cream)" : "var(--ink)",
                      border: form.goal === g ? "1px solid var(--ink)" : "1px solid var(--border)",
                      borderRadius: 4,
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                      fontFamily: "'Montserrat', sans-serif",
                      cursor: "pointer",
                      transition: "var(--transition-slow)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    {g}
                    {form.goal === g && <Target size={16} strokeWidth={1.25} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>Set your macro targets.</h2>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-60)", marginBottom: 32 }}>These form the basis of your daily planner. You can always refine these later.</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 48 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label className="text-micro-caps">Daily Calories</label>
                  <input type="number" style={{ width: "100%", padding: "16px 20px", background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 4, fontSize: "1.4rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)", outline: "none", transition: "border 0.3s" }} value={form.calories} onChange={set("calories")} />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label className="text-micro-caps">Protein (g)</label>
                    <input type="number" style={{ width: "100%", padding: "16px", background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 4, fontSize: "1.2rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)", outline: "none" }} value={form.protein} onChange={set("protein")} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label className="text-micro-caps">Carbs (g)</label>
                    <input type="number" style={{ width: "100%", padding: "16px", background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 4, fontSize: "1.2rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)", outline: "none" }} value={form.carbs} onChange={set("carbs")} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label className="text-micro-caps">Fat (g)</label>
                    <input type="number" style={{ width: "100%", padding: "16px", background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 4, fontSize: "1.2rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--ink)", outline: "none" }} value={form.fat} onChange={set("fat")} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 32 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: step === 1 ? "var(--ink)" : "var(--ink-10)", transition: "all 0.3s" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: step === 2 ? "var(--ink)" : "var(--ink-10)", transition: "all 0.3s" }} />
          </div>
          
          <button 
            onClick={nextStep} 
            disabled={loading}
            style={{ 
              display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", 
              background: "var(--ink)", color: "var(--cream)", border: "none", borderRadius: 4, 
              fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.02em", cursor: "pointer", 
              transition: "var(--transition-slow)", opacity: loading ? 0.7 : 1 
            }}
          >
            {step === 1 ? "Continue" : (loading ? "Saving..." : "Complete Setup")}
            {step === 1 && <ArrowRight size={16} strokeWidth={1.25} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
