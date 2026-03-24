import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [water, setWater] = useState(5);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

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
      <Link to="/log" className="cta-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Log Meal
      </Link>
    </div>
  </header>

  {/* Row 1: Stats + Ring */}
  <div className="grid-row1">

    {/* Remaining */}
    <div className="card stat-card remaining" style={{ '--i': '0' }}>
      <div className="stat-icon-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      </div>
      <div className="stat-eyebrow">Remaining</div>
      <div className="stat-value">710</div>
      <div className="stat-unit">kcal today</div>
    </div>

    {/* Consumed */}
    <div className="card stat-card consumed" style={{ '--i': '1' }}>
      <div className="stat-icon-wrap" style={{ borderColor: 'rgba(74,96,128,.3)', color: 'var(--slate)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2z"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <div className="stat-eyebrow">Consumed</div>
      <div className="stat-value">1,420</div>
      <div className="stat-unit">kcal today</div>
    </div>

    {/* Burned */}
    <div className="card stat-card burned" style={{ '--i': '2' }}>
      <div className="stat-icon-wrap" style={{ borderColor: 'rgba(196,98,58,.3)', color: 'var(--rust)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <div className="stat-eyebrow">Burned</div>
      <div className="stat-value">280</div>
      <div className="stat-unit">kcal today</div>
    </div>

    {/* Calorie Ring (spans rows) */}
    <div className="card ring-card" style={{ '--i': '3' }}>
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
            style={{ '--offset': 'calc(408 - 408 * 0.768)' }}
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
          <div className="ring-pct">77%</div>
          <div className="ring-of">of goal</div>
        </div>
      </div>
      <div className="divider"></div>
      <div style={{ textAlign: 'center' }}>
        <div className="ring-goal">1,850 kcal</div>
        <div className="ring-goal-label">Daily Goal</div>
      </div>
    </div>

    {/* Progress Card (spans 3 cols) */}
    <div className="card progress-card" style={{ '--i': '3', gridColumn: '1/4' }}>
      <div className="card-heading">
        <div>
          <div className="card-title">Macronutrient Progress</div>
        </div>
        <div className="card-meta">1,420 / 1,850 kcal</div>
      </div>

      {/* Main bar */}
      <div className="main-bar-track">
        <div className="main-bar-fill" style={{ '--w': '76.8%' }}></div>
      </div>

      {/* Macros */}
      <div className="macros-grid">
        {/* Carbs */}
        <div>
          <div className="macro-label">
            <span className="macro-name">🌾  Carbohydrates</span>
            <span className="macro-vals">162 / 232g</span>
          </div>
          <div className="macro-track">
            <div className="macro-fill" style={{ background: 'var(--rust)', '--w': '69.8%', animationDelay: '.5s' }}></div>
          </div>
        </div>
        {/* Protein */}
        <div>
          <div className="macro-label">
            <span className="macro-name">💪  Protein</span>
            <span className="macro-vals">88 / 143g</span>
          </div>
          <div className="macro-track">
            <div className="macro-fill" style={{ background: 'var(--slate)', '--w': '61.5%', animationDelay: '.58s' }}></div>
          </div>
        </div>
        {/* Fat */}
        <div>
          <div className="macro-label">
            <span className="macro-name">🥑  Fat</span>
            <span className="macro-vals">45 / 58g</span>
          </div>
          <div className="macro-track">
            <div className="macro-fill" style={{ background: 'var(--gold)', '--w': '77.6%', animationDelay: '.66s' }}></div>
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

        <div className="meal-row" style={{ animationDelay: '.35s' }}>
          <div className="meal-icon">🥣</div>
          <div className="meal-info">
            <div className="meal-name">Breakfast</div>
            <div className="meal-foods">Oatmeal &amp; Wild Berries</div>
          </div>
          <div><span className="meal-cal">420</span><span className="meal-cal-unit">kcal</span></div>
        </div>

        <div className="meal-row" style={{ animationDelay: '.42s' }}>
          <div className="meal-icon">🥗</div>
          <div className="meal-info">
            <div className="meal-name">Lunch</div>
            <div className="meal-foods">Grilled Chicken Salad</div>
          </div>
          <div><span className="meal-cal">580</span><span className="meal-cal-unit">kcal</span></div>
        </div>

        <div className="meal-row" style={{ animationDelay: '.49s' }}>
          <div className="meal-icon">🐟</div>
          <div className="meal-info">
            <div className="meal-name">Dinner</div>
            <div className="meal-foods">Salmon &amp; Sweet Potato</div>
          </div>
          <div><span className="meal-cal">420</span><span className="meal-cal-unit">kcal</span></div>
        </div>

      </div>
    </div>

    {/* Hydration */}
    <div className="card hydration-card">
      <div className="card-heading" style={{ marginBottom: '0' }}>
        <div className="card-title">Hydration</div>
        <div className="card-meta" id="waterCount">5 / 8 cups</div>
      </div>

      <div className="water-grid" id="waterGrid">
        {[...Array(8)].map((_, i) => (
          <button
            key={i}
            onClick={() => setWater(i + 1)}
            className={`water-cup ${i < water ? 'filled' : ''}`}
            style={{ animationDelay: `${0.4 + i * 0.04}s` }}
          />
        ))}
      </div>

      <div className="hydration-goal">
        <span className="hydration-goal-text" id="hydroGoalText">
          {8 - water > 0 
            ? <>🎯 &nbsp;<strong>{8 - water} more cup{8 - water > 1 ? 's' : ''}</strong> to reach your goal</>
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
