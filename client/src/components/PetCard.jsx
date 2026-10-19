import { Link } from 'react-router-dom';
import { photoUrl } from '../utils/api.js';

export default function PetCard({ pet }) {
  const img = photoUrl(pet.photo);
  return (
    <Link to={`/pets/${pet._id}`} className="card pet-card">
      {img ? <img src={img} alt={pet.name} /> : <div className="no-photo">No photo</div>}
      <div className="card-body">
        <h3>{pet.name}</h3>
        <p className="muted">
          {pet.species}{pet.breed ? ` - ${pet.breed}` : ''} - {pet.age} yr - {pet.gender}
        </p>
        <span className={`tag ${pet.status}`}>{pet.status}</span>
      </div>
    </Link>
  );
}
