import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useForm from '../hooks/useForm.js';
import Alert from '../components/Alert.jsx';
import PasswordInput from '../components/PasswordInput.jsx';

export default function Register() {
  const { register } = useAuth();
  const location = useLocation();
  const { values, setValues, handleChange } = useForm({ name: '', email: '', password: '', role: 'adopter', shelterName: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // No navigate() here: once register() sets the user, <GuestRoute> redirects automatically
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const body = { ...values };
      if (body.role !== 'shelter') delete body.shelterName;
      await register(body);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const isShelter = values.role === 'shelter';
  return (
    <div className="auth">
      <div className="auth-art">
        <div className="big-emoji">{isShelter ? '🏠' : '🐱'}</div>
        <h2>{isShelter ? 'Partner with PawHome' : 'Your new best friend is waiting'}</h2>
        <ul>
          {isShelter ? (
            <>
              <li>📋 List pets with photos in minutes</li>
              <li>💌 Review applications in one place</li>
              <li>✅ Find loving homes faster</li>
            </>
          ) : (
            <>
              <li>🔎 Browse pets from trusted shelters</li>
              <li>💌 Apply online in under a minute</li>
              <li>🏡 Bring home a family member</li>
            </>
          )}
        </ul>
      </div>

      <div className="auth-form">
        <form onSubmit={submit} className="form">
          <h1>Create your account</h1>
          <Alert>{error}</Alert>

          <div className="role-pick" role="radiogroup" aria-label="Account type">
            <button type="button" className={`role-card ${!isShelter ? 'active' : ''}`} onClick={() => setValues((v) => ({ ...v, role: 'adopter' }))}>
              <strong>🐾 Adopter</strong><small>I want to adopt a pet</small>
            </button>
            <button type="button" className={`role-card ${isShelter ? 'active' : ''}`} onClick={() => setValues((v) => ({ ...v, role: 'shelter' }))}>
              <strong>🏠 Shelter</strong><small>I list pets for adoption</small>
            </button>
          </div>

          <label>Your name
            <input name="name" autoComplete="name" value={values.name} onChange={handleChange} required />
          </label>
          {isShelter && (
            <label>Shelter name
              <input name="shelterName" placeholder="e.g. Paws & Claws" value={values.shelterName} onChange={handleChange} required />
            </label>
          )}
          <label>Email
            <input type="email" name="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={handleChange} required />
          </label>
          <label>Password
            <PasswordInput name="password" autoComplete="new-password" minLength={6} placeholder="At least 6 characters" value={values.password} onChange={handleChange} required />
          </label>
          {isShelter && <Alert type="info">Shelter accounts can add pets after an admin approves them.</Alert>}
          <button className="btn lg block" disabled={busy}>{busy ? 'Creating account...' : 'Sign up'}</button>
          <p className="muted switch">Already registered? <Link to="/login" state={location.state}>Log in</Link></p>
        </form>
      </div>
    </div>
  );
}
