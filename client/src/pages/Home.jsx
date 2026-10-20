import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import useAuth from '../hooks/useAuth.js';
import PetCard from '../components/PetCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Alert from '../components/Alert.jsx';
import { photoUrl } from '../utils/api.js';
import { SPECIES, speciesEmoji } from '../utils/petMeta.js';

const PAGE_SIZE = 8;

const SORTS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  youngest: (a, b) => a.age - b.age,
  oldest: (a, b) => b.age - a.age,
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function Home() {
  const { user, hasRole } = useAuth();
  const { data, loading, error } = useFetch('/pets');

  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('all');
  const [status, setStatus] = useState('available');
  const [sort, setSort] = useState('newest');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const query = useDebounce(search, 300).trim().toLowerCase();

  const pets = data?.pets ?? [];

  const stats = useMemo(() => ({
    available: pets.filter((p) => p.status === 'available').length,
    adopted: pets.filter((p) => p.status === 'adopted').length,
    shelters: new Set(pets.map((p) => p.shelter?._id).filter(Boolean)).size,
  }), [pets]);

  // Filter by status + search first, so the category counts match what the visitor sees
  const base = useMemo(() => pets.filter((p) => {
    if (status && p.status !== status) return false;
    if (!query) return true;
    return [p.name, p.breed, p.species].some((v) => v?.toLowerCase().includes(query));
  }), [pets, status, query]);

  const counts = useMemo(() => {
    const c = { all: base.length };
    SPECIES.forEach((s) => { c[s.value] = base.filter((p) => p.species === s.value).length; });
    return c;
  }, [base]);

  const filtered = useMemo(
    () => base.filter((p) => species === 'all' || p.species === species).sort(SORTS[sort]),
    [base, species, sort]
  );

  const showing = filtered.slice(0, visible);
  const heroPets = pets.filter((p) => p.photo && p.status === 'available').slice(0, 3);

  const change = (setter) => (e) => {
    setter(e.target.value);
    setVisible(PAGE_SIZE);
  };
  const pickSpecies = (value) => {
    setSpecies(value);
    setVisible(PAGE_SIZE);
  };

  let secondary = { to: '/register', label: 'Join as a shelter' };
  if (hasRole('shelter')) secondary = { to: '/shelter', label: 'Open my dashboard' };
  else if (hasRole('admin')) secondary = { to: '/admin', label: 'Open admin panel' };
  else if (hasRole('adopter')) secondary = { to: '/my-applications', label: 'My applications' };

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">🐾 Adopt, don't shop</span>
            <h1>Find a friend who will <em>love you back</em></h1>
            <p className="hero-lead">
              PawHome connects caring families with rescued dogs, cats, bunnies and more from trusted local shelters.
              Browse, apply online and bring your new best friend home.
            </p>
            <div className="hero-actions">
              <a href="#pets" className="btn lg">Meet the pets</a>
              <Link to={secondary.to} className="btn lg secondary">{secondary.label}</Link>
            </div>
            {hasRole('shelter') && !user.isApproved && (
              <div className="hero-note">
                <Alert type="info">Your shelter account is waiting for admin approval. You can add pets once it is approved.</Alert>
              </div>
            )}
          </div>

          <div className="collage" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`blob b${i + 1}`}>
                {heroPets[i] ? <img src={photoUrl(heroPets[i].photo)} alt="" /> : ['🐶', '🐱', '🐰'][i]}
              </div>
            ))}
            <div className="float-badge fb1">❤️ {stats.adopted} happy homes</div>
            <div className="float-badge fb2">🐾 {stats.available} waiting for you</div>
          </div>
        </div>
      </section>

      <div className="container stats-strip">
        <div className="stats-grid">
          <div className="stat-item"><strong>{stats.available}</strong><span>Pets to adopt</span></div>
          <div className="stat-item"><strong>{stats.adopted}</strong><span>Happy adoptions</span></div>
          <div className="stat-item"><strong>{stats.shelters}</strong><span>Partner shelters</span></div>
        </div>
      </div>

      <section className="section container" id="pets">
        <div className="section-head">
          <h2>Pets waiting for a home</h2>
          <p>Every one of them is vaccinated, loved and ready to meet you. Find your match below.</p>
        </div>

        <div className="chips-scroll" role="tablist" aria-label="Filter by species">
          <button className={`cat ${species === 'all' ? 'active' : ''}`} onClick={() => pickSpecies('all')}>
            🐾 All <small>{counts.all}</small>
          </button>
          {SPECIES.map((s) => (
            <button key={s.value} className={`cat ${species === s.value ? 'active' : ''}`} onClick={() => pickSpecies(s.value)}>
              {s.emoji} {s.label} <small>{counts[s.value]}</small>
            </button>
          ))}
        </div>

        <div className="toolbar">
          <div className="search">
            <span aria-hidden="true">🔍</span>
            <input
              placeholder="Search by name or breed, e.g. Labrador"
              value={search}
              onChange={change(setSearch)}
              aria-label="Search pets"
            />
          </div>
          <select value={status} onChange={change(setStatus)} aria-label="Adoption status">
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
            <option value="">All pets</option>
          </select>
          <select value={sort} onChange={change(setSort)} aria-label="Sort pets">
            <option value="newest">Newest first</option>
            <option value="youngest">Youngest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <Alert>{error}</Alert>

        {loading ? (
          <div className="grid">{Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            emoji={species === 'all' ? '🐾' : speciesEmoji(species)}
            title="No pets match your search"
            action={<button className="btn secondary" onClick={() => { setSearch(''); setSpecies('all'); setStatus('available'); }}>Clear filters</button>}
          >
            Try another species or a different spelling. New pets are added by our shelters all the time.
          </EmptyState>
        ) : (
          <>
            <p className="muted">Showing {showing.length} of {filtered.length} pets</p>
            <div className="grid">{showing.map((p) => <PetCard key={p._id} pet={p} />)}</div>
            {filtered.length > showing.length && (
              <div className="more-wrap">
                <button className="btn secondary lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Show more pets</button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Adopting is easy</h2>
          <p>Three simple steps between you and a lifetime of tail wags and purrs.</p>
        </div>
        <div className="steps">
          <div className="step"><span className="num">01</span><div className="step-icon">🔎</div><h3>Find your match</h3><p>Browse pets by species, age and breed, and read their story.</p></div>
          <div className="step"><span className="num">02</span><div className="step-icon">💌</div><h3>Send an application</h3><p>Tell the shelter a little about your home. It takes under a minute.</p></div>
          <div className="step"><span className="num">03</span><div className="step-icon">🏡</div><h3>Welcome them home</h3><p>Once the shelter approves, your new family member is yours.</p></div>
        </div>

        {!user && (
          <div className="cta-band">
            <div>
              <h2>Run a shelter or rescue?</h2>
              <p>List your animals for free, review applications and find loving homes faster.</p>
            </div>
            <Link to="/register" className="btn light lg">Become a partner</Link>
          </div>
        )}
      </section>
    </div>
  );
}
