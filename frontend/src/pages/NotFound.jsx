import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Página no encontrada');
  return (
    <div className="registro-wrap">
      <div className="registro-card">
        <h2>Página no encontrada</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: 16 }}>Volver al inicio</Link>
      </div>
    </div>
  );
}
