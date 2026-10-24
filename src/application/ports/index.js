// Puertos: contratos que el núcleo necesita del exterior. Los casos de uso dependen de
// estas abstracciones y nunca de Mongoose, bcrypt, JWT ni Nodemailer; los adaptadores de
// la capa de infraestructura son los que los implementan.
//
// Los métodos que hacen entrada/salida (base de datos, correo, hash) se declaran `async`: así el
// contrato ya devuelve una promesa y las implementaciones asíncronas lo cumplen sin conflicto de tipos.
// Solo isValidId, sign y verify son síncronos, porque no esperan ningún recurso externo.

/** @returns {never} Siempre lanza: en métodos async se convierte en una promesa rechazada. */
function notImplemented(name) {
  throw new Error(`${name} no está implementado`);
}

class EventRepository {
  isValidId(id) { return notImplemented('EventRepository.isValidId'); }
  async create(data) { return notImplemented('EventRepository.create'); }
  async findById(id) { return notImplemented('EventRepository.findById'); }
  async findAll() { return notImplemented('EventRepository.findAll'); }
  async findActiveInSlot({ date, location, excludeId }) { return notImplemented('EventRepository.findActiveInSlot'); }
  async update(id, data) { return notImplemented('EventRepository.update'); }
  async delete(id) { return notImplemented('EventRepository.delete'); }
}

class RegistrationRepository {
  isValidId(id) { return notImplemented('RegistrationRepository.isValidId'); }
  async countConfirmed(eventId) { return notImplemented('RegistrationRepository.countConfirmed'); }
  async findConfirmed(eventId, participantId) { return notImplemented('RegistrationRepository.findConfirmed'); }
  async create({ eventId, participantId }) { return notImplemented('RegistrationRepository.create'); }
  async findById(id) { return notImplemented('RegistrationRepository.findById'); }
  async findInEvent(eventId, id) { return notImplemented('RegistrationRepository.findInEvent'); }
  async cancel(id) { return notImplemented('RegistrationRepository.cancel'); }
  async delete(id) { return notImplemented('RegistrationRepository.delete'); }
  async listByEvent(eventId, { onlyConfirmed }) { return notImplemented('RegistrationRepository.listByEvent'); }
  async listByParticipant(participantId) { return notImplemented('RegistrationRepository.listByParticipant'); }
  async deleteCancelledOf(participantId) { return notImplemented('RegistrationRepository.deleteCancelledOf'); }
}

class UserRepository {
  async create(data) { return notImplemented('UserRepository.create'); }
  async findByEmail(email, { withPassword }) { return notImplemented('UserRepository.findByEmail'); }
  async findById(id, { withPassword }) { return notImplemented('UserRepository.findById'); }
  async update(id, changes) { return notImplemented('UserRepository.update'); }
  async listFavorites(id) { return notImplemented('UserRepository.listFavorites'); }
  async addFavorite(id, eventId) { return notImplemented('UserRepository.addFavorite'); }
  async removeFavorite(id, eventId) { return notImplemented('UserRepository.removeFavorite'); }
}

class ReportRepository {
  async create(data) { return notImplemented('ReportRepository.create'); }
  async listByEvent(eventId) { return notImplemented('ReportRepository.listByEvent'); }
}

class PasswordHasher {
  async hash(plain) { return notImplemented('PasswordHasher.hash'); }
  async compare(plain, hashed) { return notImplemented('PasswordHasher.compare'); }
}

class TokenService {
  sign(payload) { return notImplemented('TokenService.sign'); }
  verify(token) { return notImplemented('TokenService.verify'); }
}

class RegistrationNotifier {
  async notifyRegistration(email, event) { return notImplemented('RegistrationNotifier.notifyRegistration'); }
}

class QrCodeGenerator {
  async toDataUrl(text) { return notImplemented('QrCodeGenerator.toDataUrl'); }
}

module.exports = {
  EventRepository, RegistrationRepository, UserRepository, ReportRepository,
  PasswordHasher, TokenService, RegistrationNotifier, QrCodeGenerator
};