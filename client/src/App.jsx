import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import AmbientBackground from "./components/AmbientBackground";
import Cursor from "./components/Cursor";
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
    <>
      <Cursor />
      <AmbientBackground />
      <div className="awwwards-app-container">
        <div className="awwwards-shell" style={{
          gridTemplateColumns: showSidebar ? "240px 1fr" : "1fr",
        }}>
          {showSidebar && <Sidebar />}
          <div className="awwwards-content">
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
      </div>
    </>
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
