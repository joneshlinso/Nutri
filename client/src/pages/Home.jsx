import { Link } from "react-router-dom";

const Home = () => (
  <div className="home">
    <div className="hero">
      <h1>🥗 NutriPlanner</h1>
      <p>Track your nutrition, plan your meals, and achieve your health goals — all in one place.</p>
      <div className="hero-cta">
        <Link to="/register" className="btn-primary">Get Started</Link>
        <Link to="/login" className="btn-outline">Sign In</Link>
      </div>
    </div>
  </div>
);

export default Home;
