import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api, photoUrl } from '../utils/api.js';
import { speciesEmoji } from '../utils/petMeta.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';

const STATUS_TEXT = {
  pending: 'Waiting for the shelter to review',
  approved: 'Approved! The shelter will be in touch',
  rejected: 'Not selected this time',
};

export default function MyApplications() {
  const { data, loading, error, refetch } = useFetch('/applications/mine');
  const [err, setErr] = useState('');

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await api(`/applications/${id}`, { method: 'DELETE' });
      refetch();
    } catch (e) {
      setErr(e.message);
    }
  };

  const apps = data?.applications ?? [];

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>My applications</h1>
          <p className="muted" style={{ margin: 0 }}>Follow the progress of every pet you applied for.</p>
        </div>
        <Link to="/" className="btn secondary">Browse more pets</Link>
      </div>

      <Alert>{error || err}</Alert>
      {loading && <Spinner />}

      {!loading && apps.length === 0 && (
        <EmptyState emoji="💌" title="No applications yet" action={<Link to="/" className="btn">Find a pet to adopt</Link>}>
          When you apply for a pet, you can track the shelter's answer here.
        </EmptyState>
      )}

      <div className="list">
        {apps.map((a) => (
          <div className="item" key={a._id}>
            <div className="thumb">
              {a.pet?.photo ? <img src={photoUrl(a.pet.photo)} alt="" /> : speciesEmoji(a.pet?.species)}
            </div>
            <div className="item-main">
              <h3>{a.pet ? <Link to={`/pets/${a.pet._id}`}>{a.pet.name}</Link> : 'Pet removed'}</h3>
              <p className="muted">Applied on {new Date(a.createdAt).toLocaleDateString()} - {STATUS_TEXT[a.status]}</p>
              {a.message && <div className="item-msg">"{a.message}"</div>}
            </div>
            <div className="item-actions">
              <span className={`tag ${a.status}`}>{a.status}</span>
              {a.status === 'pending' && <button className="btn small danger" onClick={() => withdraw(a._id)}>Withdraw</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
