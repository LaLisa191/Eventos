import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Register from './pages/Register';
import MyEvents from './pages/MyEvents';
import OrganizerPortal from './pages/OrganizerPortal';
import Profile from './pages/Profile';
import QrEvent from './pages/QrEvent';
import NotFound from './pages/NotFound';

// Las rutas con ".html" se mantienen porque los enlaces que ya existen (QR, correos) las usan
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Navigate to="/#eventos" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register.html" element={<Register />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/organizer-portal" element={<OrganizerPortal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/qr-evento" element={<QrEvent />} />
      <Route path="/qr-evento.html" element={<QrEvent />} />
    </Routes>
  );
}
