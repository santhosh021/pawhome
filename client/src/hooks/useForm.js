import { useState } from 'react';

// CUSTOM HOOK: form values + change handler (works with text, select and checkbox)
export default function useForm(initial) {
  const [values, setValues] = useState(initial);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  };

  const reset = () => setValues(initial);
  return { values, setValues, handleChange, reset };
}
