import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useForm from '../hooks/useForm.js';
import Alert from '../components/Alert.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, handleChange } = useForm({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(values);
      const home = { admin: '/admin', shelter: '/shelter', adopter: '/' }[user.role];
      navigate(location.state?.from || home, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="form narrow">
      <h1>Log in</h1>
      <Alert>{error}</Alert>
      <label>Email<input type="email" name="email" value={values.email} onChange={handleChange} required /></label>
      <label>Password<input type="password" name="password" value={values.password} onChange={handleChange} required /></label>
      <button className="btn" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
