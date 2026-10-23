import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SESSION_EXPIRED_EVENT } from '../api/client';

const STORAGE_KEY = 'session';
const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [expired, setExpired] = useState(false);

  const save = useCallback((data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
    setExpired(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  // Si el servidor responde 401, la sesión ya no sirve: se cierra y se avisa en el login
  useEffect(() => {
    const onExpired = () => { logout(); setExpired(true); };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [logout]);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    token: session?.token ?? null,
    isOrganizer: session?.user?.userType === 'organizer',
    expired,
    login: save,
    updateUser: (user) => save({ token: session.token, user }),
    logout
  }), [session, expired, save, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
