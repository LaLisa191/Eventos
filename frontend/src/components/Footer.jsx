import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer wrap">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="/logo-udec.png" alt="Universidad de Cartagena" className="footer-logo" />
          <div className="wordmark">evento<span>s</span></div>
          <p>Inscripción centralizada a los eventos de la universidad, con cupos en tiempo real y confirmación inmediata.</p>
        </div>
        <div className="footer-col">
          <h4>Enlaces</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/#eventos">Eventos disponibles</Link></li>
            <li><Link to="/my-events">Mis eventos</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Universidad de Cartagena</h4>
          <ul>
            <li>Centro Tutorial San Juan Nepomuceno</li>
            <li>Facultad de Ingeniería</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contacto</h4>
          <ul>
            <li><a href="mailto:asierrao@unicartagena.edu.co">asierrao@unicartagena.edu.co</a></li>
            <li><a href="tel:+57-3022323405">+57-3022323405</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">Proyecto académico — Todos los derechos reservados — 2026</div>
    </footer>
  );
}
