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
    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await registerUser({ name, email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
