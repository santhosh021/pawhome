import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="container err-page">
      <div className="big">🚫🐾</div>
      <h1>Oops, this area is off-leash for you</h1>
      <p className="muted">Your account role does not have access to that page.</p>
      <Link className="btn lg" to="/">Back to the pets</Link>
    </div>
  );
}
