import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome back, {user?.name}! 👋</h1>
      <p>Your NutriPlanner dashboard is ready. Start tracking your nutrition below.</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>🥗 Today's Calories</h3>
          <p className="stat">0 / 2000 kcal</p>
        </div>
        <div className="dashboard-card">
          <h3>💧 Water Intake</h3>
          <p className="stat">0 / 8 glasses</p>
        </div>
        <div className="dashboard-card">
          <h3>🏃 Workouts Logged</h3>
          <p className="stat">0 today</p>
        </div>
        <div className="dashboard-card">
          <h3>📊 Weekly Progress</h3>
          <p className="stat">–</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
