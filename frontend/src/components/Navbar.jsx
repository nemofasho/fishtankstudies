import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        Fishbowl Studies
      </Link>

      <div className="navbar-links">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

      </div>

    </nav>
  );
}

export default Navbar;