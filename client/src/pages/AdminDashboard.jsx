import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { api } from '../utils/api.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';

const STAT_ICONS = { users: '👥', shelters: '🏠', pendingShelters: '⏳', pets: '🐾', applications: '💌' };
const STAT_LABELS = { users: 'Users', shelters: 'Shelters', pendingShelters: 'Awaiting approval', pets: 'Pets', applications: 'Applications' };

export default function AdminDashboard() {
  const stats = useFetch('/admin/stats');
  const users = useFetch('/admin/users');
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');

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
  const remove = (id, name) => {
    if (window.confirm(`Delete ${name} and everything they own?`)) act(() => api(`/admin/users/${id}`, { method: 'DELETE' }));
  };

  const all = users.data?.users ?? [];
  const waiting = all.filter((u) => u.role === 'shelter' && !u.isApproved);
  const shown = all.filter((u) => {
    if (filter === 'waiting') return u.role === 'shelter' && !u.isApproved;
    return filter === 'all' || u.role === filter;
  });

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Admin panel</h1>
          <p className="muted" style={{ margin: 0 }}>Approve shelters and keep the community healthy.</p>
        </div>
      </div>

      <Alert>{err || stats.error || users.error}</Alert>

      {stats.data && (
        <div className="stat-cards">
          {Object.entries(stats.data.stats).map(([k, v]) => (
            <div className={`stat-card ${k === 'pendingShelters' && v > 0 ? 'hot' : ''}`} key={k}>
              <div className="ico">{STAT_ICONS[k] || '📊'}</div>
              <div><strong>{v}</strong><span>{STAT_LABELS[k] || k}</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="tabs">
        {[['all', 'All'], ['waiting', `Awaiting approval (${waiting.length})`], ['shelter', 'Shelters'], ['adopter', 'Adopters']].map(([value, label]) => (
          <button key={value} className={`tab ${filter === value ? 'active' : ''}`} onClick={() => setFilter(value)}>{label}</button>
        ))}
      </div>

      {users.loading && <Spinner />}
      {!users.loading && shown.length === 0 && <EmptyState emoji="🎉" title="Nothing here">No users match this filter.</EmptyState>}

      {shown.length > 0 && (
        <div className="table-wrap">
          <table className="rtable">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u._id}>
                  <td data-label="Name">{u.name}{u.shelterName ? <span className="muted"> ({u.shelterName})</span> : null}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Role" style={{ textTransform: 'capitalize' }}>{u.role}</td>
                  <td data-label="Status">
                    {u.role === 'shelter' ? <span className={`tag ${u.isApproved ? 'approved' : 'pending'}`}>{u.isApproved ? 'approved' : 'waiting'}</span> : '-'}
                  </td>
                  <td data-label="Actions">
                    <div className="item-actions">
                      {u.role === 'shelter' && !u.isApproved && <button className="btn small teal" onClick={() => approve(u._id)}>Approve</button>}
                      {u.role !== 'admin' && <button className="btn small danger" onClick={() => remove(u._id, u.name)}>Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
