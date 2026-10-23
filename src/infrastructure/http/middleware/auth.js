// Middlewares de autenticación. Dependen de los puertos TokenService y UserRepository,
// no de jsonwebtoken ni de Mongoose.
function createAuthMiddleware({ tokens, users }) {
  async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = tokens.verify(token);
      const user = await users.findById(payload.id);
      if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });
      req.user = user;
      next();
    } catch (err) {
      console.warn('Token inválido o expirado:', err.message);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  }

  function isOrganizer(req, res, next) {
    if (req.user.userType !== 'organizer') {
      return res.status(403).json({ message: 'Solo un organizador puede hacer esto' });
    }
    next();
  }

  return { verifyToken, isOrganizer };
}

module.exports = createAuthMiddleware;
