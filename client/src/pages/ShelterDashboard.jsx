import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import useAuth from '../hooks/useAuth.js';
import { api } from '../utils/api.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';

export default function ShelterDashboard() {
  const { user } = useAuth();
  const pets = useFetch('/pets/mine');
  const apps = useFetch('/applications/shelter');
  const [err, setErr] = useState('');

  const review = async (id, status) => {
    try {
      await api(`/applications/${id}/status`, { method: 'PATCH', body: { status } });
      apps.refetch();
      pets.refetch();
    } catch (e) {
      setErr(e.message);
    }
  };

  const removePet = async (id) => {
    if (!window.confirm('Delete this pet and its applications?')) return;
    try {
      await api(`/pets/${id}`, { method: 'DELETE' });
      pets.refetch();
      apps.refetch();
    } catch (e) {
      setErr(e.message);
    }
  };

  // Not approved yet: the API returns 403 and we show the reason
  if (user && !user.isApproved) {
    return <Alert type="info">Your shelter account is waiting for admin approval. You can add pets once it is approved.</Alert>;
  }

  return (
    <>
      <div className="row between">
        <h1>{user.shelterName || 'My shelter'}</h1>
        <Link className="btn" to="/shelter/pets/new">Add pet</Link>
      </div>
      <Alert>{err || pets.error || apps.error}</Alert>

      <h2>My pets</h2>
      {pets.loading && <Spinner />}
      {pets.data?.pets.length === 0 && <p className="muted">You have not added any pets yet.</p>}
      <table className="table">
        <tbody>
          {pets.data?.pets.map((p) => (
            <tr key={p._id}>
              <td><Link to={`/pets/${p._id}`}>{p.name}</Link></td>
              <td>{p.species}</td>
              <td><span className={`tag ${p.status}`}>{p.status}</span></td>
              <td className="row">
                <Link className="btn small secondary" to={`/shelter/pets/${p._id}/edit`}>Edit</Link>
                <button className="btn small danger" onClick={() => removePet(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Applications for my pets</h2>
      {apps.loading && <Spinner />}
      {apps.data?.applications.length === 0 && <p className="muted">No applications yet.</p>}
      <table className="table">
        <tbody>
          {apps.data?.applications.map((a) => (
            <tr key={a._id}>
              <td>{a.pet?.name}</td>
              <td>{a.adopter?.name}<br /><span className="muted">{a.adopter?.email}</span></td>
              <td className="wrap">{a.message || <span className="muted">No message</span>}</td>
              <td><span className={`tag ${a.status}`}>{a.status}</span></td>
              <td className="row">
                {a.status === 'pending' && (
                  <>
                    <button className="btn small" onClick={() => review(a._id, 'approved')}>Approve</button>
                    <button className="btn small danger" onClick={() => review(a._id, 'rejected')}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
