const express = require('express');
const { handle } = require('../httpErrors');

// Montado en /api/events/:id/registrations
function createRegistrationRoutes({ useCases, auth }) {
  const router = express.Router({ mergeParams: true });
  const { verifyToken, isOrganizer } = auth;

  router.get('/', verifyToken, isOrganizer, handle(500, async (req, res) => {
    res.json(await useCases.listEventRegistrations.execute({
      eventId: req.params.id, organizerId: req.user._id
    }));
  }));

  router.post('/', verifyToken, handle(500, async (req, res) => {
    const registration = await useCases.registerParticipant.execute({ eventId: req.params.id, user: req.user });
    res.status(201).json({ message: 'Registro confirmado', registration });
  }));

  router.patch('/:registrationId/cancel', verifyToken, handle(500, async (req, res) => {
    const registration = await useCases.cancelRegistration.execute({
      registrationId: req.params.registrationId, userId: req.user._id
    });
    res.json({ message: 'Registro cancelado', registration });
  }));

  router.delete('/:registrationId', verifyToken, handle(500, async (req, res) => {
    await useCases.deleteRegistration.execute({
      eventId: req.params.id, registrationId: req.params.registrationId, userId: req.user._id
    });
    res.json({ message: 'Registro eliminado' });
  }));

  return router;
}

module.exports = createRegistrationRoutes;
