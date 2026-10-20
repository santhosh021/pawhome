import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import useAuth from '../hooks/useAuth.js';
import { api, photoUrl } from '../utils/api.js';
import { speciesEmoji } from '../utils/petMeta.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function ShelterDashboard() {
  const { user } = useAuth();
  const pets = useFetch('/pets/mine');
  const apps = useFetch('/applications/shelter');
  const [tab, setTab] = useState('pets');
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

  const removePet = async (id, name) => {
    if (!window.confirm(`Delete ${name} and all of its applications?`)) return;
    try {
      await api(`/pets/${id}`, { method: 'DELETE' });
      pets.refetch();
      apps.refetch();
    } catch (e) {
      setErr(e.message);
    }
  };

  // Not approved yet: shelters cannot add pets until an admin approves them
  if (user && !user.isApproved) {
    return (
      <div className="container page">
        <EmptyState emoji="⏳" title="Waiting for approval">
          Thanks for joining PawHome! An admin needs to approve your shelter account before you can add pets.
        </EmptyState>
      </div>
    );
  }

  const myPets = pets.data?.pets ?? [];
  const myApps = apps.data?.applications ?? [];
  const pending = myApps.filter((a) => a.status === 'pending').length;

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>{user.shelterName || 'My shelter'}</h1>
          <p className="muted" style={{ margin: 0 }}>Manage your pets and review adoption requests.</p>
        </div>
        <Link className="btn lg" to="/shelter/pets/new">+ Add a pet</Link>
      </div>

      <div className="stat-cards">
        <div className="stat-card"><div className="ico">🐾</div><div><strong>{myPets.length}</strong><span>Total pets</span></div></div>
        <div className="stat-card"><div className="ico">💚</div><div><strong>{myPets.filter((p) => p.status === 'available').length}</strong><span>Available</span></div></div>
        <div className="stat-card"><div className="ico">🏡</div><div><strong>{myPets.filter((p) => p.status === 'adopted').length}</strong><span>Adopted</span></div></div>
        <div className={`stat-card ${pending ? 'hot' : ''}`}><div className="ico">💌</div><div><strong>{pending}</strong><span>Pending requests</span></div></div>
      </div>

      <Alert>{err || pets.error || apps.error}</Alert>

      <div className="tabs" role="tablist">
        <button className={`tab ${tab === 'pets' ? 'active' : ''}`} onClick={() => setTab('pets')}>My pets ({myPets.length})</button>
        <button className={`tab ${tab === 'apps' ? 'active' : ''}`} onClick={() => setTab('apps')}>Applications ({myApps.length})</button>
      </div>

      {tab === 'pets' && (
        <>
          {pets.loading && <Spinner />}
          {!pets.loading && myPets.length === 0 && (
            <EmptyState emoji="🐶" title="No pets yet" action={<Link className="btn" to="/shelter/pets/new">Add your first pet</Link>}>
              Add a pet with a photo and it will appear on the homepage right away.
            </EmptyState>
          )}
          <div className="list">
            {myPets.map((p) => (
              <div className="item" key={p._id}>
                <div className="thumb">{p.photo ? <img src={photoUrl(p.photo)} alt="" /> : speciesEmoji(p.species)}</div>
                <div className="item-main">
                  <h3><Link to={`/pets/${p._id}`}>{p.name}</Link></h3>
                  <p className="muted">{p.breed || p.species} - {p.age} yr - {p.gender}</p>
                </div>
                <div className="item-actions">
                  <span className={`tag ${p.status}`}>{p.status}</span>
                  <Link className="btn small secondary" to={`/shelter/pets/${p._id}/edit`}>Edit</Link>
                  <button className="btn small danger" onClick={() => removePet(p._id, p.name)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'apps' && (
        <>
          {apps.loading && <Spinner />}
          {!apps.loading && myApps.length === 0 && (
            <EmptyState emoji="💌" title="No applications yet">Adopters' requests for your pets will show up here.</EmptyState>
          )}
          <div className="list">
            {myApps.map((a) => (
              <div className="item" key={a._id}>
                <div className="thumb">{a.pet?.photo ? <img src={photoUrl(a.pet.photo)} alt="" /> : speciesEmoji(a.pet?.species)}</div>
                <div className="item-main">
                  <h3>{a.adopter?.name} <span className="muted">wants to adopt</span> {a.pet?.name}</h3>
                  <p className="muted">{a.adopter?.email} - {new Date(a.createdAt).toLocaleDateString()}</p>
                  {a.message && <div className="item-msg">"{a.message}"</div>}
                </div>
                <div className="item-actions">
                  <span className={`tag ${a.status}`}>{a.status}</span>
                  {a.status === 'pending' && (
                    <>
                      <button className="btn small teal" onClick={() => review(a._id, 'approved')}>Approve</button>
                      <button className="btn small danger" onClick={() => review(a._id, 'rejected')}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
