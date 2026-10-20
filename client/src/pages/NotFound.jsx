import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container err-page">
      <div className="big">🐕‍🦺❓</div>
      <h1>This page ran away</h1>
      <p className="muted">We sniffed everywhere but could not find it.</p>
      <Link className="btn lg" to="/">Take me home</Link>
    </div>
  );
}
