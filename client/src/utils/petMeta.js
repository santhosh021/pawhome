// Shared labels / emojis for species and helpers for display
export const SPECIES = [
  { value: 'dog', label: 'Dogs', emoji: '🐶' },
  { value: 'cat', label: 'Cats', emoji: '🐱' },
  { value: 'rabbit', label: 'Rabbits', emoji: '🐰' },
  { value: 'bird', label: 'Birds', emoji: '🐦' },
  { value: 'other', label: 'Others', emoji: '🐹' },
];

export const speciesEmoji = (s) => SPECIES.find((x) => x.value === s)?.emoji || '🐾';
export const speciesLabel = (s) => SPECIES.find((x) => x.value === s)?.label.replace(/s$/, '') || s;

export const ageLabel = (age) => {
  const n = Number(age);
  if (n < 1) return `${Math.max(1, Math.round(n * 12))} mo`;
  return `${n} ${n === 1 ? 'yr' : 'yrs'}`;
};

export const genderSymbol = (g) => (g === 'female' ? '♀ Female' : '♂ Male');

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
