import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

export default function Home() {
  const { user } = useAuth();
  const [log, setLog] = useState(null);
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 70 });
  const [greeting, setGreeting] = useState("Good morning");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");

    const fetchData = async () => {
      try {
        const [logRes, goalsRes] = await Promise.all([
          api.get('/logs/day'),
          api.get('/goals')
        ]);
        setLog(logRes.data);
        setGoals(goalsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWaterClick = async (count) => {
    try {
      const res = await api.patch('/logs/water', { waterCups: count });
      setLog(prev => ({ ...prev, waterCups: res.data.waterCups }));
    } catch (err) {
      console.error("Error updating water:", err);
    }
  };

  const consumed = log?.meals?.reduce((sum, m) => sum + (m.calories || 0), 0) || 0;
  const remaining = Math.max(0, goals.calories - consumed);
  const pPct = Math.min(100, Math.round((consumed / goals.calories) * 100)) || 0;
  
  const totalP = log?.meals?.reduce((sum, m) => sum + (m.protein || 0), 0) || 0;
  const totalC = log?.meals?.reduce((sum, m) => sum + (m.carbs || 0), 0) || 0;
  const totalF = log?.meals?.reduce((sum, m) => sum + (m.fat || 0), 0) || 0;

  if (loading) return <div className="shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--ink-60)' }}>Curating your wellness journal...</div>;

  return (
    <div className="shell">
      

<div className="shell">

  {/* Header */}
  <header>
    <div className="brand">
      <span className="brand-name">Nutrire</span>
      <span className="brand-sub">Daily Wellness Journal</span>
    </div>
    <div className="header-right">
      <div className="greeting-block">
        <div className="greeting-eyebrow">{greeting}</div>
        <div className="greeting-name">Welcome back, {user?.name?.split(" ")[0] || "there"}</div>
      </div>
      <button className="icon-btn" title="Notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
      </button>

    </div>
  </header>

  {/* Row 1: Stats + Ring */}
  <div className="grid-row1">

    {/* Daily Overview */}
    <div className="card" style={{ '--i': '0', display: 'flex', justifyContent: 'space-between', padding: '32px 40px', alignItems: 'center' }}>
      <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid var(--ink-10)' }}>
        <div className="stat-eyebrow" style={{ color: 'var(--sage)' }}>Remaining</div>
        <div className="stat-value">{remaining.toLocaleString()}</div>
        <div className="stat-unit">kcal today</div>
      </div>
      <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid var(--ink-10)' }}>
        <div className="stat-eyebrow" style={{ color: 'var(--slate)' }}>Consumed</div>
        <div className="stat-value">{consumed.toLocaleString()}</div>
        <div className="stat-unit">kcal today</div>
      </div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div className="stat-eyebrow" style={{ color: 'var(--rust)' }}>Burned</div>
        <div className="stat-value">280</div>
        <div className="stat-unit">kcal today</div>
      </div>
    </div>

    {/* Calorie Ring (spans rows) */}
    <div className="card ring-card" style={{ '--i': '1', gridColumn: '2', gridRow: '1 / 3' }}>
      <div className="ring-eyebrow">Daily Target</div>
      <div className="ring-wrap">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* decorative outer rings */}
          <circle cx="90" cy="90" r="85" fill="none" stroke="rgba(248,244,238,.06)" strokeWidth="1"/>
          <circle cx="90" cy="90" r="78" fill="none" stroke="rgba(184,146,74,.12)" strokeWidth="1"/>
          {/* track */}
          <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(248,244,238,.1)" strokeWidth="8"
            transform="rotate(-90 90 90)"/>
          {/* fill */}
            <circle cx="90" cy="90" r="70" fill="none" stroke="url(#ringGrad)" strokeWidth="8"
            strokeLinecap="butt"
            className="ring-arc"
            style={{ '--offset': `calc(439.8 - 439.8 * ${pPct / 100})` }}
            transform="rotate(-90 90 90)"/>
          {/* gold tick marks */}
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B8924A"/>
              <stop offset="100%" stopColor="#6B8C6B"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="ring-center">
          <div className="ring-pct">{pPct}%</div>
          <div className="ring-of">of goal</div>
        </div>
      </div>
      <div className="divider"></div>
      <div style={{ textAlign: 'center' }}>
        <div className="ring-goal">{goals.calories.toLocaleString()} kcal</div>
        <div className="ring-goal-label">Daily Goal</div>
      </div>
    </div>

    {/* Progress Card */}
    <div className="card progress-card" style={{ '--i': '2', gridColumn: '1' }}>
      <div className="card-heading">
        <div>
          <div className="card-title">Macronutrient Progress</div>
        </div>
        <div className="card-meta">{consumed.toLocaleString()} / {goals.calories.toLocaleString()} kcal</div>
      </div>

      {/* Main bar */}
      <div className="main-bar-track">
        <div className="main-bar-fill" style={{ '--w': `${pPct}%` }}></div>
      </div>

      {/* Macros */}
      <div className="macros-grid">
        {/* Carbs */}
        <div>
          <div className="macro-label">
            <span className="macro-name">🌾  Carbohydrates</span>
            <span className="macro-vals">{Math.round(totalC)} / {goals.carbs}g</span>
          </div>
          <div className="macro-track">
            <div className="macro-fill" style={{ background: 'var(--rust)', '--w': `${Math.min(100, (totalC / goals.carbs) * 100)}%`, animationDelay: '.5s' }}></div>
          </div>
        </div>
        {/* Protein */}
        <div>
          <div className="macro-label">
            <span className="macro-name">💪  Protein</span>
            <span className="macro-vals">{Math.round(totalP)} / {goals.protein}g</span>
          </div>
          <div className="macro-track">
            <div className="macro-fill" style={{ background: 'var(--slate)', '--w': `${Math.min(100, (totalP / goals.protein) * 100)}%`, animationDelay: '.58s' }}></div>
          </div>
        </div>
        {/* Fat */}
        <div>
          <div className="macro-label">
            <span className="macro-name">🥑  Fat</span>
            <span className="macro-vals">{Math.round(totalF)} / {goals.fat}g</span>
          </div>
          <div className="macro-track">
            <div className="macro-fill" style={{ background: 'var(--gold)', '--w': `${Math.min(100, (totalF / goals.fat) * 100)}%`, animationDelay: '.66s' }}></div>
          </div>
        </div>
      </div>
    </div>

  </div>

  {/* Row 2: Meals + Hydration */}
  <div className="grid-row2">

    {/* Meals */}
    <div className="card meals-card">
      <div className="card-heading">
        <div className="card-title">Today's Meals</div>
        <Link className="add-link" to="/log">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Entry
        </Link>
      </div>
      <div className="meals-list">
        {log?.meals?.length > 0 ? (
          log.meals.map((meal, idx) => (
            <div key={meal._id || idx} className="meal-row" style={{ animationDelay: `${0.35 + idx * 0.07}s` }}>
              <div className="meal-icon">{meal.emoji || '🍽️'}</div>
              <div className="meal-info">
                <div className="meal-name">{meal.type}</div>
                <div className="meal-foods">{meal.name}</div>
              </div>
              <div><span className="meal-cal">{meal.calories}</span><span className="meal-cal-unit">kcal</span></div>
            </div>
          ))
        ) : (
          <div className="meal-row" style={{ color: 'var(--ink-30)', justifyContent: 'center', padding: '32px' }}>
            No entries for today yet.
          </div>
        )}
      </div>
    </div>

    {/* Hydration */}
    <div className="card hydration-card">
      <div className="card-heading" style={{ marginBottom: '0' }}>
        <div className="card-title">Hydration</div>
        <div className="card-meta" id="waterCount">{log?.waterCups || 0} / 8 cups</div>
      </div>

      <div className="water-grid" id="waterGrid">
        {[...Array(8)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleWaterClick(i + 1)}
            className={`water-cup ${(log?.waterCups || 0) > i ? 'filled' : ''}`}
            style={{ animationDelay: `${0.4 + i * 0.04}s` }}
          />
        ))}
      </div>

      <div className="hydration-goal">
        <span className="hydration-goal-text" id="hydroGoalText">
          {8 - (log?.waterCups || 0) > 0 
            ? <>🎯 &nbsp;<strong>{8 - (log?.waterCups || 0)} more cup{8 - (log?.waterCups || 0) > 1 ? 's' : ''}</strong> to reach your goal</>
            : <>✨ &nbsp;<strong>Goal reached!</strong> Beautifully done.</>
          }
        </span>
      </div>
    </div>

  </div>

  {/* Section rule */}
  <div className="section-rule">
    <div className="section-rule-line"></div>
    <div className="section-rule-text">Weekly Snapshot</div>
    <div className="section-rule-line"></div>
  </div>

  {/* Row 3: Accent stats */}
  <div className="grid-row3">
    <div className="card accent-card" style={{ '--i': '0' }}>
      <div className="accent-val">6</div>
      <div className="accent-label">Day Streak</div>
    </div>
    <div className="card accent-card" style={{ '--i': '1' }}>
      <div className="accent-val">12,340</div>
      <div className="accent-label">Steps Today</div>
    </div>
    <div className="card accent-card" style={{ '--i': '2' }}>
      <div className="accent-val">7.4h</div>
      <div className="accent-label">Sleep Last Night</div>
    </div>
    <div className="card accent-card" style={{ '--i': '3', borderTopColor: 'var(--sage)' }}>
      <div className="accent-val">92</div>
      <div className="accent-label">Wellness Score</div>
    </div>
  </div>

  {/* Footer */}
  <footer>
    <div className="footer-brand">Nutrire — Est. 2025</div>
    <div className="footer-note">Tuesday, March 24  ·  All data is private</div>
  </footer>

</div>
    </div>
  );
}
