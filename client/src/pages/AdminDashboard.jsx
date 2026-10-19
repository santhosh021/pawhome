import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { api } from '../utils/api.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';

export default function AdminDashboard() {
  const stats = useFetch('/admin/stats');
  const users = useFetch('/admin/users');
  const [err, setErr] = useState('');

  const act = async (fn) => {
    try {
      await fn();
      stats.refetch();
      users.refetch();
    } catch (e) {
      setErr(e.message);
    }
  };

  const approve = (id) => act(() => api(`/admin/users/${id}/approve`, { method: 'PATCH' }));
  const remove = (id) => {
    if (window.confirm('Delete this user and everything they own?')) act(() => api(`/admin/users/${id}`, { method: 'DELETE' }));
  };

  return (
    <>
      <h1>Admin</h1>
      <Alert>{err || stats.error || users.error}</Alert>
      {stats.data && (
        <div className="stats">
          {Object.entries(stats.data.stats).map(([k, v]) => (
            <div className="card stat" key={k}><strong>{v}</strong><span className="muted">{k}</span></div>
          ))}
        </div>
      )}

      <h2>Users</h2>
      {users.loading && <Spinner />}
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead>
        <tbody>
          {users.data?.users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}{u.shelterName ? <span className="muted"> ({u.shelterName})</span> : null}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.role === 'shelter' ? <span className={`tag ${u.isApproved ? 'approved' : 'pending'}`}>{u.isApproved ? 'approved' : 'waiting'}</span> : '-'}</td>
              <td className="row">
                {u.role === 'shelter' && !u.isApproved && <button className="btn small" onClick={() => approve(u._id)}>Approve</button>}
                {u.role !== 'admin' && <button className="btn small danger" onClick={() => remove(u._id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
