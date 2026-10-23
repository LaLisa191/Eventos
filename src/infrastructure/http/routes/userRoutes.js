const express = require('express');
const { handle } = require('../httpErrors');

function createUserRoutes({ useCases, auth }) {
  const router = express.Router();
  const { verifyToken } = auth;

  router.post('/signup', handle(400, async (req, res) => {
    const user = await useCases.signup.execute(req.body);
    res.status(201).json(user);
  }));

  router.post('/login', handle(500, async (req, res) => {
    res.json(await useCases.login.execute(req.body));
  }));

  router.get('/me/registrations', verifyToken, handle(500, async (req, res) => {
    res.json(await useCases.listMyRegistrations.execute({ userId: req.user._id }));
  }));

  router.delete('/me/registrations/cancelled', verifyToken, handle(500, async (req, res) => {
    res.json(await useCases.deleteMyCancelledRegistrations.execute({ userId: req.user._id }));
  }));

  router.put('/me', verifyToken, handle(400, async (req, res) => {
    res.json(await useCases.updateProfile.execute({ userId: req.user._id, ...req.body }));
  }));

  router.get('/me/favorites', verifyToken, handle(500, async (req, res) => {
    res.json(await useCases.favorites.list(req.user._id));
  }));

  router.post('/me/favorites/:eventId', verifyToken, handle(400, async (req, res) => {
    res.json(await useCases.favorites.add(req.user._id, req.params.eventId));
  }));

  router.delete('/me/favorites/:eventId', verifyToken, handle(400, async (req, res) => {
    res.json(await useCases.favorites.remove(req.user._id, req.params.eventId));
  }));

  return router;
}

module.exports = createUserRoutes;
