import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useForm from '../hooks/useForm.js';
import Alert from '../components/Alert.jsx';
import PasswordInput from '../components/PasswordInput.jsx';

export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const { values, handleChange } = useForm({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // No navigate() here: once login() sets the user, <GuestRoute> redirects automatically
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(values);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-art">
        <div className="big-emoji">🐶</div>
        <h2>Welcome back!</h2>
        <p style={{ position: 'relative', margin: '.4rem 0 0', opacity: .95 }}>Someone is waiting for you to come home.</p>
        <ul>
          <li>🐾 Track your adoption applications</li>
          <li>💌 Hear back from shelters quickly</li>
          <li>❤️ Give a rescue pet a second chance</li>
        </ul>
      </div>

      <div className="auth-form">
        <form onSubmit={submit} className="form">
          <div>
            <h1>Log in</h1>
            {location.state?.from && <p className="muted">Please log in to continue.</p>}
          </div>
          <Alert>{error}</Alert>
          <label>Email
            <input type="email" name="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={handleChange} required />
          </label>
          <label>Password
            <PasswordInput name="password" autoComplete="current-password" placeholder="Your password" value={values.password} onChange={handleChange} required />
          </label>
          <button className="btn lg block" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
          <p className="muted switch">New to PawHome? <Link to="/register" state={location.state}>Create an account</Link></p>
        </form>
      </div>
    </div>
  );
}
