const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const createAuthMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const createUserRoutes = require('./routes/userRoutes');
const createEventRoutes = require('./routes/eventRoutes');
const createRegistrationRoutes = require('./routes/registrationRoutes');
const createQrRoutes = require('./routes/qrRoutes');

const ROOT = path.join(__dirname, '..', '..', '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const FRONTEND_DIST = path.join(ROOT, 'frontend', 'dist');

// Sirve la aplicación React ya compilada; cualquier ruta que no sea de la API vuelve a index.html
// para que React Router resuelva la pantalla. Si no se ha compilado, la API funciona igual.
function serveFrontend(app) {
  if (!fs.existsSync(path.join(FRONTEND_DIST, 'index.html'))) {
    app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => res.status(503).send(
      'El frontend aún no está compilado. Ejecuta "npm run build" y reinicia el servidor.'
    ));
    return;
  }
  app.use(express.static(FRONTEND_DIST));
  app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => res.sendFile(path.join(FRONTEND_DIST, 'index.html')));
}

// Adaptador de entrada (HTTP): arma la aplicación Express a partir de los casos de uso
function createApp({ useCases, tokens, users }) {
  const app = express();
  const auth = createAuthMiddleware({ tokens, users });
  const deps = { useCases, auth };

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.static(PUBLIC_DIR));   // imágenes subidas (/uploads) y recursos estáticos

  app.use('/api/users', createUserRoutes(deps));
  app.use('/api/events/:id/registrations', createRegistrationRoutes(deps));
  app.use('/api/events', createEventRoutes(deps));
  app.use('/api/events/qr', createQrRoutes(deps));

  serveFrontend(app);

  // Debe ir después de todas las rutas para capturar sus errores
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
