const express = require('express');
const upload = require('../middleware/upload');
const { handle } = require('../httpErrors');

const imageUrlOf = (file) => (file ? `/uploads/${file.filename}` : undefined);

function createEventRoutes({ useCases, auth }) {
  const router = express.Router();
  const { verifyToken, isOrganizer } = auth;

  router.post('/', verifyToken, isOrganizer, upload.single('image'), handle(400, async (req, res) => {
    const event = await useCases.createEvent.execute({
      organizerId: req.user._id, form: req.body, imageUrl: imageUrlOf(req.file)
    });
    res.status(201).json(event);
  }));

  router.put('/:id', verifyToken, isOrganizer, upload.single('image'), handle(400, async (req, res) => {
    res.json(await useCases.updateEvent.execute({
      eventId: req.params.id, organizerId: req.user._id, form: req.body, imageUrl: imageUrlOf(req.file)
    }));
  }));

  router.delete('/:id', verifyToken, isOrganizer, handle(500, async (req, res) => {
    await useCases.deleteEvent.execute({ eventId: req.params.id, organizerId: req.user._id });
    res.json({ message: 'Evento eliminado' });
  }));

  router.get('/', handle(500, async (req, res) => {
    res.json(await useCases.listEvents.execute());
  }));

  router.get('/:id', handle(500, async (req, res) => {
    res.json(await useCases.getEvent.execute({ eventId: req.params.id }));
  }));

  router.post('/:id/reports', verifyToken, isOrganizer, handle(500, async (req, res) => {
    const report = await useCases.generateReport.execute({ eventId: req.params.id, organizerId: req.user._id });
    res.status(201).json(report);
  }));

  router.get('/:id/reports', verifyToken, isOrganizer, handle(500, async (req, res) => {
    res.json(await useCases.listReports.execute({ eventId: req.params.id, organizerId: req.user._id }));
  }));

  return router;
}

module.exports = createEventRoutes;
