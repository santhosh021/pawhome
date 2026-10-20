export default function PawIcon({ size = 24, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
      <ellipse cx="32" cy="43" rx="14" ry="11" />
      <ellipse cx="13" cy="29" rx="6" ry="8" transform="rotate(-18 13 29)" />
      <ellipse cx="25" cy="17" rx="6" ry="8.5" transform="rotate(-6 25 17)" />
      <ellipse cx="39" cy="17" rx="6" ry="8.5" transform="rotate(6 39 17)" />
      <ellipse cx="51" cy="29" rx="6" ry="8" transform="rotate(18 51 29)" />
    </svg>
  );
}
