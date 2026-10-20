import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import useAuth from '../hooks/useAuth.js';
import useForm from '../hooks/useForm.js';
import { api, photoUrl } from '../utils/api.js';
import { ageLabel, genderSymbol, initials, speciesEmoji, speciesLabel } from '../utils/petMeta.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(`/pets/${id}`);
  const { user, hasRole } = useAuth();
  const { values, handleChange, reset } = useForm({ message: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="container page"><Spinner /></div>;
  if (error) {
    return (
      <div className="container page">
        <Link to="/" className="back-link">← Back to all pets</Link>
        <Alert>{error}</Alert>
      </div>
    );
  }

  const pet = data.pet;
  const isOwner = user && pet.shelter?._id === user.id;
  const available = pet.status === 'available';
  const shelterName = pet.shelter?.shelterName || pet.shelter?.name || 'Shelter';
  const img = photoUrl(pet.photo);

  const apply = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: '', text: '' });
    try {
      await api('/applications', { method: 'POST', body: { petId: pet._id, message: values.message } });
      setSent(true);
      reset();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const removePet = async () => {
    if (!window.confirm(`Delete ${pet.name}?`)) return;
    try {
      await api(`/pets/${pet._id}`, { method: 'DELETE' });
      navigate(hasRole('admin') ? '/' : '/shelter');
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="container page">
      <Link to="/" className="back-link">← Back to all pets</Link>

      <div className="detail">
        <div>
          <div className="detail-photo">
            {img ? <img src={img} alt={pet.name} /> : <div className="pet-fallback">{speciesEmoji(pet.species)}</div>}
          </div>

          <div className="panel" style={{ marginTop: '1.2rem' }}>
            <h2>About {pet.name}</h2>
            <p style={{ marginBottom: 0 }}>{pet.description || `${pet.name} is still getting to know the shelter team. Apply to meet them in person!`}</p>
          </div>
        </div>

        <aside>
          <div className="panel">
            <div className="detail-title">
              <h1>{pet.name}</h1>
              <span className={`tag ${pet.status}`}>{pet.status}</span>
            </div>
            <p className="muted" style={{ marginBottom: 0 }}>{pet.breed || speciesLabel(pet.species)}</p>

            <div className="facts">
              <div className="fact"><small>Species</small><strong>{speciesEmoji(pet.species)} {speciesLabel(pet.species)}</strong></div>
              <div className="fact"><small>Age</small><strong>{ageLabel(pet.age)}</strong></div>
              <div className="fact"><small>Gender</small><strong>{genderSymbol(pet.gender)}</strong></div>
              <div className="fact"><small>Status</small><strong style={{ textTransform: 'capitalize' }}>{pet.status}</strong></div>
            </div>

            <div className="shelter-card">
              <span className="avatar">{initials(shelterName)}</span>
              <div>
                <small className="muted">Cared for by</small>
                <div><strong>{shelterName}</strong></div>
              </div>
            </div>
          </div>

          <div className="panel adopt-panel">
            <Alert type={msg.type}>{msg.text}</Alert>

            {/* What you see depends on who you are */}
            {(isOwner || hasRole('admin')) && (
              <>
                <h2>Manage this pet</h2>
                <div className="row">
                  <Link className="btn small teal" to={`/shelter/pets/${pet._id}/edit`}>Edit details</Link>
                  <button className="btn small danger" onClick={removePet}>Delete</button>
                </div>
              </>
            )}

            {!isOwner && !hasRole('admin') && !available && (
              <div className="adopted-banner">🎉 {pet.name} has found a loving home!</div>
            )}

            {!user && available && (
              <>
                <h2>💛 Interested in {pet.name}?</h2>
                <p className="muted">Create a free adopter account to send your application to {shelterName}.</p>
                <div className="row">
                  <Link className="btn" to="/register" state={{ from: `/pets/${pet._id}` }}>Sign up to adopt</Link>
                  <Link className="btn secondary" to="/login" state={{ from: `/pets/${pet._id}` }}>Log in</Link>
                </div>
              </>
            )}

            {hasRole('adopter') && available && !sent && (
              <form onSubmit={apply} className="form">
                <h2>💛 Adopt {pet.name}</h2>
                <label>
                  Tell {shelterName} about your home
                  <textarea
                    name="message"
                    maxLength={500}
                    rows={4}
                    placeholder="Do you have a garden? Other pets? Experience with animals?"
                    value={values.message}
                    onChange={handleChange}
                  />
                </label>
                <button className="btn block lg" disabled={busy}>{busy ? 'Sending...' : `Apply to adopt ${pet.name}`}</button>
              </form>
            )}

            {sent && (
              <>
                <Alert type="success">Application sent! {shelterName} will review it soon.</Alert>
                <Link className="btn secondary block" to="/my-applications">Track my applications</Link>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
