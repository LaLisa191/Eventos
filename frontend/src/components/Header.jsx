import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

export default function Header() {
  const { user, isOrganizer, logout } = useAuth();
  const { pathname, hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // En el inicio, "Inicio" y "Eventos disponibles" son la misma página: se distinguen por el scroll
  const [inEvents, setInEvents] = useState(false);
  useEffect(() => {
    const update = () => {
      const section = document.getElementById('eventos');
      setInEvents(Boolean(section) && section.getBoundingClientRect().top <= window.innerHeight * 0.4);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [pathname, hash]);

  const closeMenu = () => setMenuOpen(false);
  const onHome = pathname === '/' || pathname === '/index.html';
  const activeClass = ({ isActive }) => (isActive ? 'nav-activo' : undefined);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="wordmark" aria-label="Eventos, ir al inicio">Uni<span>Eventos</span></Link>
        <button className="nav-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Abrir menú">☰</button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`} onClick={closeMenu}>
          <li><Link to="/" className={onHome && !inEvents ? 'nav-activo' : undefined}>Inicio</Link></li>
          <li className="nav-item">
            <Link to="/#eventos" className={onHome && inEvents ? 'nav-activo' : undefined}>Eventos disponibles</Link>
            <div className="dropdown">
              <Link to="/?modality=in-person#eventos">Presenciales</Link>
              <Link to="/?modality=virtual#eventos">Virtuales</Link>
            </div>
          </li>
          <li>{user && <NavLink to="/my-events" className={activeClass}>Mis eventos</NavLink>}</li>
          <li>{isOrganizer && <NavLink to="/organizer-portal" className={activeClass}>Mi portal</NavLink>}</li>
          <li>{user && <NavLink to="/profile" className={activeClass}>Mi perfil</NavLink>}</li>
          <li id="navAccount">
            {user
              ? <a href="#salir" onClick={(e) => { e.preventDefault(); setConfirmLogout(true); }}>Salir ({user.name.split(' ')[0]})</a>
              : <NavLink to="/login">Iniciar sesión</NavLink>}
          </li>
          <li className="nav-item"></li>
        </ul>
        <div className="header-tag">Universidad de Cartagena</div>
      </header>

      {confirmLogout && (
        <Modal onClose={() => setConfirmLogout(false)} cardClassName="modal-card" cardStyle={{ maxWidth: 360, textAlign: 'center' }} showClose={false}>
          <h3>¿Cerrar sesión?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 10 }}>Vas a salir de tu cuenta en este dispositivo.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmLogout(false)}>Cancelar</button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => { logout(); setConfirmLogout(false); }}>Salir</button>
          </div>
        </Modal>
      )}
    </>
  );
}
