import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🥗 NutriPlanner</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">Hello, {user.name}</span>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
