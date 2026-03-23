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

function AppShell() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  if (!user || pathname === "/login") return null;
  return <Sidebar />;
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

function AppLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const showSidebar = user && pathname !== "/login";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: showSidebar ? "260px 1fr" : "1fr",
      minHeight: "100vh",
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
  );
}

export default App;
