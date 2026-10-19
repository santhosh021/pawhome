import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useForm from '../hooks/useForm.js';
import Alert from '../components/Alert.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { values, handleChange } = useForm({ name: '', email: '', password: '', role: 'adopter', shelterName: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const body = { ...values };
      if (body.role !== 'shelter') delete body.shelterName;
      const user = await register(body);
      navigate(user.role === 'shelter' ? '/shelter' : '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="form narrow">
      <h1>Create account</h1>
      <Alert>{error}</Alert>
      <label>I am an
        <select name="role" value={values.role} onChange={handleChange}>
          <option value="adopter">Adopter (looking for a pet)</option>
          <option value="shelter">Shelter (listing pets)</option>
        </select>
      </label>
      <label>Name<input name="name" value={values.name} onChange={handleChange} required /></label>
      {values.role === 'shelter' && (
        <label>Shelter name<input name="shelterName" value={values.shelterName} onChange={handleChange} required /></label>
      )}
      <label>Email<input type="email" name="email" value={values.email} onChange={handleChange} required /></label>
      <label>Password (min 6 characters)<input type="password" name="password" minLength={6} value={values.password} onChange={handleChange} required /></label>
      {values.role === 'shelter' && <p className="muted">Shelter accounts can add pets after an admin approves them.</p>}
      <button className="btn" disabled={busy}>{busy ? 'Creating...' : 'Sign up'}</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
