import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import PasswordField from '../components/PasswordField';
import RequireAuth from '../components/RequireAuth';
import StateBox from '../components/StateBox';
import usePageTitle from '../hooks/usePageTitle';
import { isValidEmail } from '../utils/format';

function DataCard() {
  const { user, token, updateUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setStatus(null);
    if (!name.trim()) return setStatus({ type: 'error', text: 'El nombre no puede quedar vacío.' });
    if (!isValidEmail(email.trim())) return setStatus({ type: 'error', text: 'Escribe un correo válido.' });
    setBusy(true);
    try {
      updateUser(await api.updateProfile(token, { name: name.trim(), email: email.trim() }));
      setStatus({ type: 'success', text: 'Datos actualizados.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="registro-card">
      <h2>Mi perfil</h2>
      <div className="meta" style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
        {user.userType === 'organizer' ? 'Cuenta de organizador' : 'Cuenta de participante'}
      </div>
      <label htmlFor="pNombre">Nombre completo</label>
      <input id="pNombre" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="pCorreo">Correo</label>
      <input id="pCorreo" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="btn-primary" onClick={save} disabled={busy}>{busy ? 'Guardando…' : 'Guardar cambios'}</button>
      {status && <StateBox type={status.type}>{status.text}</StateBox>}
    </div>
  );
}

function PasswordCard() {
  const { token } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setStatus(null);
    if (!next) return setStatus({ type: 'error', text: 'Escribe la nueva contraseña.' });
    if (next.length < 6) return setStatus({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    if (!current) return setStatus({ type: 'error', text: 'Escribe tu contraseña actual.' });
    setBusy(true);
    try {
      await api.updateProfile(token, { currentPassword: current, newPassword: next });
      setStatus({ type: 'success', text: 'Contraseña actualizada.' });
      setCurrent('');
      setNext('');
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="registro-card" style={{ marginTop: 20 }}>
      <h2 style={{ fontSize: 18 }}>Cambiar contraseña</h2>
      <div className="meta" style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
        Déjalo en blanco si no quieres cambiarla. Mínimo 6 caracteres.
      </div>
      <label htmlFor="pActual">Contraseña actual</label>
      <PasswordField id="pActual" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
      <label htmlFor="pNueva">Nueva contraseña</label>
      <PasswordField id="pNueva" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
      <button className="btn-primary" onClick={save} disabled={busy}>{busy ? 'Actualizando…' : 'Actualizar contraseña'}</button>
      {status && <StateBox type={status.type}>{status.text}</StateBox>}
    </div>
  );
}

export default function Profile() {
  usePageTitle('Mi perfil');
  return (
    <RequireAuth>
      <div className="registro-wrap">
        <Link to="/" className="back-link">← Volver a eventos</Link>
        <DataCard />
        <PasswordCard />
      </div>
    </RequireAuth>
  );
}
