import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useForm from '../hooks/useForm.js';
import { api, photoUrl } from '../utils/api.js';
import Alert from '../components/Alert.jsx';

const empty = { name: '', species: 'dog', breed: '', age: '', gender: 'male', description: '' };

// Create or edit a pet. The photo is sent as multipart/form-data (FormData) and handled by Multer.
export default function PetForm() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const { values, setValues, handleChange } = useForm(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api(`/pets/${id}`)
      .then(({ pet }) => {
        setValues({
          name: pet.name,
          species: pet.species,
          breed: pet.breed || '',
          age: pet.age,
          gender: pet.gender,
          description: pet.description || '',
        });
        setCurrentPhoto(pet.photo);
      })
      .catch((e) => setError(e.message));
  }, [id, setValues]);

  // Local preview of the chosen file
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const form = new FormData();
      Object.entries(values).forEach(([k, v]) => form.append(k, v));
      if (file) form.append('photo', file); // field name must match upload.single('photo') on the server
      await api(id ? `/pets/${id}` : '/pets', { method: id ? 'PUT' : 'POST', body: form });
      navigate('/shelter');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const shown = preview || photoUrl(currentPhoto);
  return (
    <form onSubmit={submit} className="form narrow">
      <h1>{id ? 'Edit pet' : 'Add a pet'}</h1>
      <Alert>{error}</Alert>
      <label>Name<input name="name" value={values.name} onChange={handleChange} required /></label>
      <div className="row">
        <label>Species
          <select name="species" value={values.species} onChange={handleChange}>
            {['dog', 'cat', 'rabbit', 'bird', 'other'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>Gender
          <select name="gender" value={values.gender} onChange={handleChange}>
            <option>male</option>
            <option>female</option>
          </select>
        </label>
        <label>Age (years)<input type="number" step="0.5" min="0" max="40" name="age" value={values.age} onChange={handleChange} required /></label>
      </div>
      <label>Breed<input name="breed" value={values.breed} onChange={handleChange} /></label>
      <label>Description<textarea name="description" rows={4} maxLength={1000} value={values.description} onChange={handleChange} /></label>
      <label>Photo (JPG, PNG or WEBP, max 2 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files[0] || null)} />
      </label>
      {shown && <img className="preview" src={shown} alt="Pet preview" />}
      <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save pet'}</button>
    </form>
  );
}
