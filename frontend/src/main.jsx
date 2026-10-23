import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/styles.css';
import './styles/styles-portal.css';
import './styles/styles-compare.css';
import './styles/styles-extra.css';
import './styles/styles-nav.css';
import './styles/styles-favoritos.css';
import './styles/styles-footer.css';
import './styles/styles-imagenes.css';
import './styles/styles-modal.css';
import './styles/styles-confirmar.css';
import './styles/styles-qr.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
