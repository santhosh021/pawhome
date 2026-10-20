import { Link } from 'react-router-dom';
import { photoUrl } from '../utils/api.js';
import { ageLabel, genderSymbol, speciesEmoji, speciesLabel } from '../utils/petMeta.js';

export default function PetCard({ pet }) {
  const img = photoUrl(pet.photo);
  const adopted = pet.status === 'adopted';
  return (
    <Link to={`/pets/${pet._id}`} className={`pet-card ${adopted ? 'is-adopted' : ''}`}>
      <div className="pet-media">
        {img ? <img src={img} alt={pet.name} loading="lazy" /> : <div className="pet-fallback">{speciesEmoji(pet.species)}</div>}
        <span className="badge-species">{speciesEmoji(pet.species)} {speciesLabel(pet.species)}</span>
        {adopted && <span className="ribbon">Adopted 🎉</span>}
      </div>
      <div className="pet-body">
        <div className="pet-title">
          <h3>{pet.name}</h3>
          <span className={`gender ${pet.gender}`}>{pet.gender === 'female' ? '♀' : '♂'}</span>
        </div>
        <p className="pet-breed">{pet.breed || speciesLabel(pet.species)}</p>
        <div className="chips">
          <span className="chip">{ageLabel(pet.age)}</span>
          <span className="chip">{genderSymbol(pet.gender)}</span>
        </div>
        <div className="pet-foot">
          <span className="pet-shelter">🏠 {pet.shelter?.shelterName || pet.shelter?.name || 'Shelter'}</span>
          <span className="pet-cta">{adopted ? 'See story' : `Meet ${pet.name}`} →</span>
        </div>
      </div>
    </Link>
  );
}
