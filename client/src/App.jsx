import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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

function AppShell() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuth = location.pathname === "/login";

  if (!user || isAuth) return null;
  return <Sidebar />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell" style={{ gridTemplateColumns: "auto 1fr" }}>
          <AppShell />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/"        element={<Home />} />
              <Route path="/log"     element={<MealLogger />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/progress"element={<Progress />} />
              <Route path="/ai"      element={<AICoach />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
