const ICONS = { error: '⚠️', success: '✅', info: '💡' };

export default function Alert({ type = 'error', children }) {
  if (!children) return null;
  return (
    <div className={`alert ${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span aria-hidden="true">{ICONS[type]}</span>
      <div>{children}</div>
    </div>
  );
}
