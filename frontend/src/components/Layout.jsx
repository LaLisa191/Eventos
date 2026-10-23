import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Botón "volver arriba": aparece al llegar al final de páginas largas
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight;
      const atBottom = window.innerHeight + window.scrollY >= height - 120;
      setVisible(atBottom && height > window.innerHeight + 200);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <button type="button" className={`btn-subir ${visible ? 'visible' : ''}`} aria-label="Volver al inicio de la página"
      onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
    </button>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  // Al cambiar de página se vuelve arriba (excepto en el inicio, que maneja su propio scroll)
  useEffect(() => { if (pathname !== '/') window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
}
