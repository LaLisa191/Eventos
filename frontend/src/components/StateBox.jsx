export default function StateBox({ type = 'error', children, style }) {
  if (!children) return null;
  return <div className={`state-box ${type}`} style={style}>{children}</div>;
}
