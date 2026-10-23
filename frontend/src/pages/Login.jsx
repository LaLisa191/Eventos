import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import PasswordField from '../components/PasswordField';
import StateBox from '../components/StateBox';
import usePageTitle from '../hooks/usePageTitle';
import { safeNext } from '../utils/safeRedirect';

export default function Login() {
  usePageTitle('Iniciar sesión');
  const { login, expired, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      login(await api.login(email, password));
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="registro-wrap">
      <Link to="/" className="back-link">← Volver a eventos</Link>
      <form className="registro-card" onSubmit={submit}>
        <h2>Iniciar sesión</h2>
        <div className="meta" style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
          Ingresa con tu cuenta para poder registrarte a un evento.
        </div>
        {expired && !user && <StateBox>Tu sesión venció. Inicia sesión de nuevo para continuar.</StateBox>}

        <label htmlFor="email">Correo</label>
        <input id="email" type="email" placeholder="ana@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Contraseña</label>
        <PasswordField id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

        <button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Iniciar sesión'}</button>
        <StateBox>{error}</StateBox>

        <p style={{ marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          ¿No tienes cuenta? <Link to="/signup" style={{ color: 'var(--text)' }}>Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
