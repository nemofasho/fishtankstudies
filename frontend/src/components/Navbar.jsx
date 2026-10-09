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
        <img
          src="/fishbowl-logo.jpeg"
          alt="Fishbowl Studies"
        />
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

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            {user?.username}
          </NavLink>

        </div>
      )}

    </nav>
  );
}

export default Navbar;