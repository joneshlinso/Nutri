import { createContext, useContext, useState, useEffect } from "react";
import { getMe, loginUser, registerUser } from "../api/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Fetch user on mount if token exists ──────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // ─── Demo Bypass ─────────────────────────────────────────
    if (email === "admin@nutri.com" && password === "password") {
      const mockUser = { id: "demo-123", name: "Demo User", email: "admin@nutri.com" };
      localStorage.setItem("token", "mock-token-123");
      setUser(mockUser);
      return mockUser;
    }

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      // If backend is down, we can still allow demo login for UI testing
      if (email === "test@test.com") {
        const testUser = { id: "test-456", name: "Test User", email: "test@test.com" };
        localStorage.setItem("token", "mock-token-456");
        setUser(testUser);
        return testUser;
      }
      throw err;
    }
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
