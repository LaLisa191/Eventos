// Puertos: contratos que el núcleo necesita del exterior. Los casos de uso dependen de
// estas abstracciones y nunca de Mongoose, bcrypt, JWT ni Nodemailer; los adaptadores de
// la capa de infraestructura son los que los implementan.

function notImplemented(name) {
  throw new Error(`${name} no está implementado`);
}

class EventRepository {
  isValidId(id) { return notImplemented('EventRepository.isValidId'); }
  create(data) { return notImplemented('EventRepository.create'); }
  findById(id) { return notImplemented('EventRepository.findById'); }
  findAll() { return notImplemented('EventRepository.findAll'); }
  findActiveInSlot({ date, location, excludeId }) { return notImplemented('EventRepository.findActiveInSlot'); }
  update(id, data) { return notImplemented('EventRepository.update'); }
  delete(id) { return notImplemented('EventRepository.delete'); }
}

class RegistrationRepository {
  isValidId(id) { return notImplemented('RegistrationRepository.isValidId'); }
  countConfirmed(eventId) { return notImplemented('RegistrationRepository.countConfirmed'); }
  findConfirmed(eventId, participantId) { return notImplemented('RegistrationRepository.findConfirmed'); }
  create({ eventId, participantId }) { return notImplemented('RegistrationRepository.create'); }
  findById(id) { return notImplemented('RegistrationRepository.findById'); }
  findInEvent(eventId, id) { return notImplemented('RegistrationRepository.findInEvent'); }
  cancel(id) { return notImplemented('RegistrationRepository.cancel'); }
  delete(id) { return notImplemented('RegistrationRepository.delete'); }
  listByEvent(eventId, { onlyConfirmed }) { return notImplemented('RegistrationRepository.listByEvent'); }
  listByParticipant(participantId) { return notImplemented('RegistrationRepository.listByParticipant'); }
  deleteCancelledOf(participantId) { return notImplemented('RegistrationRepository.deleteCancelledOf'); }
}

class UserRepository {
  create(data) { return notImplemented('UserRepository.create'); }
  findByEmail(email, { withPassword }) { return notImplemented('UserRepository.findByEmail'); }
  findById(id, { withPassword }) { return notImplemented('UserRepository.findById'); }
  update(id, changes) { return notImplemented('UserRepository.update'); }
  listFavorites(id) { return notImplemented('UserRepository.listFavorites'); }
  addFavorite(id, eventId) { return notImplemented('UserRepository.addFavorite'); }
  removeFavorite(id, eventId) { return notImplemented('UserRepository.removeFavorite'); }
}

class ReportRepository {
  create(data) { return notImplemented('ReportRepository.create'); }
  listByEvent(eventId) { return notImplemented('ReportRepository.listByEvent'); }
}

class PasswordHasher {
  hash(plain) { return notImplemented('PasswordHasher.hash'); }
  compare(plain, hashed) { return notImplemented('PasswordHasher.compare'); }
}

class TokenService {
  sign(payload) { return notImplemented('TokenService.sign'); }
  verify(token) { return notImplemented('TokenService.verify'); }
}

class RegistrationNotifier {
  notifyRegistration(email, event) { return notImplemented('RegistrationNotifier.notifyRegistration'); }
}

class QrCodeGenerator {
  toDataUrl(text) { return notImplemented('QrCodeGenerator.toDataUrl'); }
}

module.exports = {
  EventRepository, RegistrationRepository, UserRepository, ReportRepository,
  PasswordHasher, TokenService, RegistrationNotifier, QrCodeGenerator
};
