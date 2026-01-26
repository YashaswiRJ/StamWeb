import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/components/navbar.css";

/* Cloudinary logo (scaled, not cropped) */
const LOGO_URL =
  "https://res.cloudinary.com/dxdjptisw/image/upload/c_scale,w_80,f_png,q_auto/logo_wbpyqn.png";

const navLinkClass = ({ isActive }) =>
  "nav-link " + (isActive ? "nav-link-active" : "");

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Identify if we are in the admin section
  const isAdminRoute = location.pathname.startsWith("/admin");

  // 2. Identify if we are specifically on the Login page
  const isLoginPage = location.pathname === "/admin";

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  // ================= ADMIN NAVBAR =================
  if (isAdminRoute) {
    return (
      <header className="navbar">
        <div className="navbar-inner">
          <Link to={isLoginPage ? "/admin" : "/admin/dashboard"} className="logo">
            <img
              src={LOGO_URL}
              alt="Stamatics Logo"
              className="logo-image"
            />
            <div className="logo-text">
              <span className="logo-title">Stamatics Admin</span>
            </div>
          </Link>

          {!isLoginPage && (
            <nav className="top-right-nav">
              <NavLink to="/admin/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>

              <a href="/" target="_blank" rel="noreferrer" className="nav-link">
                View Live Site ↗
              </a>

              <button
                onClick={handleLogout}
                className="nav-link"
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>
    );
  }

  // ================= PUBLIC NAVBAR =================
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <img
            src={LOGO_URL}
            alt="Stamatics Logo"
            className="logo-image"
          />
          <div className="logo-text">
            <span className="logo-title">Stamatics</span><br />
            <span className="logo-subtitle">IIT Kanpur</span>
          </div>
        </Link>

        <nav className="nav-links top-right-nav">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>

          <div className="dropdown">
            <span className="dropdown-label">Competitions ▾</span>
            <div className="dropdown-menu">
              <NavLink to="/mathemania" className="dropdown-item">Mathemania</NavLink>
              <NavLink to="/leaderboard" className="dropdown-item">Leaderboard</NavLink>
              <NavLink to="/view-pdf" className="dropdown-item">Round 2: Questions</NavLink>
              <NavLink to="/second-round" className="dropdown-item">Submit Answers</NavLink>
            </div>
          </div>

          <NavLink to="/blogs" className={navLinkClass}>Blogs</NavLink>
          <NavLink to="/team" className={navLinkClass}>Our Team</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
