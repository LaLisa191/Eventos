import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StateBox from './StateBox';

// Protege una página: sin sesión lleva al login (y vuelve aquí después); si se exige
// organizador y el usuario no lo es, muestra el aviso.
export default function RequireAuth({ organizer = false, children }) {
  const { user, isOrganizer } = useAuth();
  const { pathname, search } = useLocation();

  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(pathname + search)}`} replace />;

  if (organizer && !isOrganizer) {
    return (
      <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <StateBox style={{ maxWidth: 460 }}>Esta página es solo para cuentas de organizador.</StateBox>
        <Link to="/" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Volver al inicio</Link>
      </main>
    );
  }
  return children;
}
