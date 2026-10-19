import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import PetCard from '../components/PetCard.jsx';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';

export default function Home() {
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('');
  const [status, setStatus] = useState('available');
  const debouncedSearch = useDebounce(search);

  const params = new URLSearchParams();
  if (debouncedSearch) params.set('search', debouncedSearch);
  if (species) params.set('species', species);
  if (status) params.set('status', status);

  const { data, loading, error } = useFetch(`/pets?${params.toString()}`);

  return (
    <>
      <h1>Find your new best friend</h1>
      <div className="filters">
        <input placeholder="Search by name or breed" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={species} onChange={(e) => setSpecies(e.target.value)}>
          <option value="">All species</option>
          {['dog', 'cat', 'rabbit', 'bird', 'other'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="available">Available</option>
          <option value="adopted">Adopted</option>
          <option value="">All</option>
        </select>
      </div>

      <Alert>{error}</Alert>
      {loading && <Spinner />}
      {data && data.pets.length === 0 && <p className="muted">No pets match your search.</p>}
      <div className="grid">
        {data?.pets.map((p) => <PetCard key={p._id} pet={p} />)}
      </div>
    </>
  );
}
