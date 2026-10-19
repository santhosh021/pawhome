import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { api } from '../utils/api.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';

export default function MyApplications() {
  const { data, loading, error, refetch } = useFetch('/applications/mine');
  const [err, setErr] = useState('');

  const withdraw = async (id) => {
    try {
      await api(`/applications/${id}`, { method: 'DELETE' });
      refetch();
    } catch (e) {
      setErr(e.message);
    }
  };

  if (loading) return <Spinner />;
  return (
    <>
      <h1>My applications</h1>
      <Alert>{error || err}</Alert>
      {data?.applications.length === 0 && <p className="muted">No applications yet. <Link to="/">Browse pets</Link></p>}
      <table className="table">
        <tbody>
          {data?.applications.map((a) => (
            <tr key={a._id}>
              <td><Link to={`/pets/${a.pet?._id}`}>{a.pet?.name}</Link> <span className="muted">({a.pet?.species})</span></td>
              <td><span className={`tag ${a.status}`}>{a.status}</span></td>
              <td>{new Date(a.createdAt).toLocaleDateString()}</td>
              <td>{a.status === 'pending' && <button className="btn small secondary" onClick={() => withdraw(a._id)}>Withdraw</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
