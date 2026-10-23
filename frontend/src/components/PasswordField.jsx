import { useState } from 'react';

export default function PasswordField({ id, value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <input id={id} type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} />
      <button type="button" className="toggle-password" onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
        <i className={`bi ${visible ? 'bi-eye-slash' : 'bi-eye'}`}></i>
      </button>
    </div>
  );
}
