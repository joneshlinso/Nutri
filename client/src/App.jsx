import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MealLogger from "./pages/MealLogger";
import Planner from "./pages/Planner";
import Progress from "./pages/Progress";
import AICoach from "./pages/AICoach";
import Profile from "./pages/Profile";

function AppLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const showSidebar = user && pathname !== "/login";

  return (
    <div className="app-container">
      {/* ─── Ambient Light Layer ─── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle at top left, rgba(255,255,255,0.8), transparent 50%), radial-gradient(circle at bottom right, rgba(59, 95, 74, 0.05), transparent 50%)" }} />

      <div className="app-shell" style={{
        gridTemplateColumns: showSidebar ? "260px 1fr" : "1fr",
        position: "relative", zIndex: 1
      }}>
        {showSidebar && <Sidebar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/"         element={<Home />} />
            <Route path="/log"      element={<MealLogger />} />
            <Route path="/planner"  element={<Planner />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/ai"       element={<AICoach />} />
            <Route path="/profile"  element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
