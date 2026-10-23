const { DomainError } = require('../../domain/errors');

const STATUS_BY_KIND = {
  invalid_input: 400,
  unauthenticated: 401,
  forbidden: 403,
  not_found: 404
};

// Texto legible para errores de la base de datos que llegan sin traducir
function errorMessage(err) {
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => e.message).join(' / ');
    return `Revisa el formulario: ${details}`;
  }
  if (err.code === 11000) return 'Ya existe un registro con esos datos.';
  return err.message;
}

// Envuelve un controlador: los errores del dominio se traducen a su código HTTP y
// cualquier otro error usa `fallbackStatus` (400 en escrituras de formularios, 500 en el resto)
function handle(fallbackStatus, controller) {
  return async (req, res) => {
    try {
      await controller(req, res);
    } catch (err) {
      if (err instanceof DomainError) {
        return res.status(STATUS_BY_KIND[err.kind]).json({ message: err.message });
      }
      res.status(fallbackStatus).json({ message: errorMessage(err) });
    }
  };
}

module.exports = { handle, errorMessage };
