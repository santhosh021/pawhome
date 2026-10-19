import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="center">
      <h1>403 - Not allowed</h1>
      <p className="muted">Your role does not have access to that page.</p>
      <Link className="btn" to="/">Back to pets</Link>
    </div>
  );
}
