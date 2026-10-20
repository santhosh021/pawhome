import { Link } from 'react-router-dom';
import PawIcon from './PawIcon.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="brand light"><PawIcon size={26} /> PawHome</div>
          <p className="footer-text">Every pet deserves a warm lap and a full bowl. Adopt, don't shop.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/">Find a pet</Link>
          <Link to="/register">Become a shelter partner</Link>
          <Link to="/login">Log in</Link>
        </nav>
      </div>
      <div className="footer-bottom">Made with ❤️ for pets and the people who love them</div>
    </footer>
  );
}
