const express = require('express');
const { DomainError } = require('../../../domain/errors');

// Montado en /api/events/qr
function createQrRoutes({ useCases }) {
  const router = express.Router();

  router.get('/:id/qr', async (req, res) => {
    try {
      res.json(await useCases.generateEventQr.execute({ eventId: req.params.id }));
    } catch (err) {
      if (err instanceof DomainError) {
        const status = err.kind === 'not_found' ? 404 : 400;
        return res.status(status).json({ message: err.message });
      }
      console.error('Error generando QR', err);
      res.status(500).json({ message: 'No se pudo generar el QR' });
    }
  });

  return router;
}

module.exports = createQrRoutes;
