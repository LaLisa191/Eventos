import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import PasswordField from '../components/PasswordField';
import StateBox from '../components/StateBox';
import usePageTitle from '../hooks/usePageTitle';
import { isValidEmail } from '../utils/format';

export default function Signup() {
  usePageTitle('Crear cuenta');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', userType: 'participant' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    const email = form.email.trim();
    if (!isValidEmail(email)) return setError('Escribe un correo con formato válido');

    setBusy(true);
    try {
      await api.signup({ ...form, email });
      login(await api.login(email, form.password));   // inicia sesión automáticamente
      navigate('/', { replace: true });
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
        <h2>Crear cuenta</h2>
        <div className="meta" style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
          Como participante puedes inscribirte a eventos. Como organizador puedes crear eventos y ver sus reportes.
        </div>

        <label htmlFor="name">Nombre completo</label>
        <input id="name" placeholder="Ana Sierra Osorio" value={form.name} onChange={set('name')} />

        <label htmlFor="email">Correo</label>
        <input id="email" type="email" placeholder="ana@correo.com" value={form.email} onChange={set('email')} />

        <label htmlFor="password">Contraseña</label>
        <PasswordField id="password" value={form.password} onChange={set('password')} autoComplete="new-password" />

        <fieldset className="radio-group">
          <legend>Tipo de cuenta</legend>
          <label><input type="radio" name="userType" value="participant" checked={form.userType === 'participant'} onChange={set('userType')} /> Participante</label>
          <label><input type="radio" name="userType" value="organizer" checked={form.userType === 'organizer'} onChange={set('userType')} /> Organizador</label>
        </fieldset>

        <button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Creando…' : 'Crear cuenta'}</button>
        <StateBox>{error}</StateBox>

        <p style={{ marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--text)' }}>Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
