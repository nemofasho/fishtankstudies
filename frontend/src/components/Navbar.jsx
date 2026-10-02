import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();

  const location = useLocation();

  // Don't show the main navbar on authentication pages
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        Fishbowl Studies
      </Link>

      {isAuthenticated && (
        <div className="navbar-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <span className="navbar-user">
            {user?.username}
          </span>

          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      )}

    </nav>
  );
}

export default Navbar;