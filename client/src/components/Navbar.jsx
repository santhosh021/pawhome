import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import PawIcon from './PawIcon.jsx';
import { initials } from '../utils/petMeta.js';

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the page changes
  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand"><PawIcon size={28} /> PawHome</Link>

        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          <span /><span /><span />
        </button>

        <div className={`nav-menu ${open ? 'open' : ''}`}>
          <nav className="nav-links">
            <NavLink to="/" end>Find a pet</NavLink>
            {/* Menu items change per role */}
            {hasRole('adopter') && <NavLink to="/my-applications">My applications</NavLink>}
            {hasRole('shelter') && <NavLink to="/shelter">Shelter dashboard</NavLink>}
            {hasRole('admin') && <NavLink to="/admin">Admin</NavLink>}
          </nav>

          <div className="nav-user">
            {user ? (
              <>
                <div className="user-chip">
                  <span className="avatar">{initials(user.name)}</span>
                  <span className="user-info"><strong>{user.name}</strong><small>{user.role}</small></span>
                </div>
                <button className="btn small secondary" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn small ghost">Log in</Link>
                <Link to="/register" className="btn small">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
