import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="center">
      <h1>404 - Page not found</h1>
      <Link className="btn" to="/">Back to pets</Link>
    </div>
  );
}
