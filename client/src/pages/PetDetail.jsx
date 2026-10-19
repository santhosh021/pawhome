import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import useAuth from '../hooks/useAuth.js';
import useForm from '../hooks/useForm.js';
import { api, photoUrl } from '../utils/api.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';

export default function PetDetail() {
  const { id } = useParams();
  const { data, loading, error, refetch } = useFetch(`/pets/${id}`);
  const { user, hasRole } = useAuth();
  const { values, handleChange, reset } = useForm({ message: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;
  const pet = data.pet;
  const isOwner = user && pet.shelter?._id === user.id;

  const apply = async (e) => {
    e.preventDefault();
    try {
      await api('/applications', { method: 'POST', body: { petId: pet._id, message: values.message } });
      setMsg({ type: 'success', text: 'Application sent! Track it under "My applications".' });
      reset();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const removePet = async () => {
    if (!window.confirm('Delete this pet?')) return;
    try {
      await api(`/pets/${pet._id}`, { method: 'DELETE' });
      window.location.href = '/shelter';
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const img = photoUrl(pet.photo);
  return (
    <div className="detail">
      {img ? <img src={img} alt={pet.name} /> : <div className="no-photo big">No photo</div>}
      <div>
        <h1>{pet.name} <span className={`tag ${pet.status}`}>{pet.status}</span></h1>
        <p className="muted">
          {pet.species}{pet.breed ? ` - ${pet.breed}` : ''} - {pet.age} yr - {pet.gender}
        </p>
        <p>{pet.description || 'No description yet.'}</p>
        <p className="muted">Shelter: {pet.shelter?.shelterName || pet.shelter?.name}</p>

        <Alert type={msg.type}>{msg.text}</Alert>

        {/* What you see depends on who you are */}
        {(isOwner || hasRole('admin')) && (
          <div className="row">
            <Link className="btn small" to={`/shelter/pets/${pet._id}/edit`}>Edit</Link>
            <button className="btn small danger" onClick={removePet}>Delete</button>
          </div>
        )}

        {!user && pet.status === 'available' && (
          <p><Link to="/login" state={{ from: `/pets/${pet._id}` }}>Log in</Link> as an adopter to apply.</p>
        )}

        {hasRole('adopter') && pet.status === 'available' && (
          <form onSubmit={apply} className="form">
            <label>Why would you be a good home?
              <textarea name="message" maxLength={500} rows={4} value={values.message} onChange={handleChange} />
            </label>
            <button className="btn">Apply to adopt</button>
          </form>
        )}
      </div>
    </div>
  );
}
