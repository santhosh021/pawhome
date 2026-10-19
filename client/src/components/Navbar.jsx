import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">PawHome</Link>
      <nav>
        <NavLink to="/">Pets</NavLink>
        {/* Menu items change per role */}
        {hasRole('adopter') && <NavLink to="/my-applications">My applications</NavLink>}
        {hasRole('shelter') && <NavLink to="/shelter">Shelter dashboard</NavLink>}
        {hasRole('admin') && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-right">
        {user ? (
          <>
            <span className="muted">{user.name} ({user.role})</span>
            <button className="btn small secondary" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn small secondary">Log in</Link>
            <Link to="/register" className="btn small">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
