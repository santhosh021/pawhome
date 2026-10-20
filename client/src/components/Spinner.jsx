import PawIcon from './PawIcon.jsx';

export default function Spinner({ text = 'Fetching the good stuff...' }) {
  return (
    <div className="spinner" role="status">
      <PawIcon size={36} className="bounce" />
      <p>{text}</p>
    </div>
  );
}
