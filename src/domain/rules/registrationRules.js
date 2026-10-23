function isOwnedBy(registration, userId) {
  return String(registration.participantId) === String(userId);
}

// Una inscripción confirmada se cancela primero; así no se pierde un cupo por accidente
function canBeDeleted(registration) {
  return registration.status === 'cancelled';
}

module.exports = { isOwnedBy, canBeDeleted };
