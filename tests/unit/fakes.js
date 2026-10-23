// Adaptadores falsos en memoria: permiten probar los casos de uso sin base de datos,
// sin Express y sin enviar correos. Es la ventaja directa de la arquitectura hexagonal.
const { EventRepository, RegistrationRepository, UserRepository, PasswordHasher, TokenService, RegistrationNotifier } =
  require('../../src/application/ports');

let nextId = 1;
const newId = () => String(nextId++).padStart(24, '0');

class FakeEventRepository extends EventRepository {
  constructor(events = []) { super(); this.items = events; }
  isValidId(id) { return /^\d{24}$/.test(String(id)); }
  async create(data) { const event = { _id: newId(), status: 'active', ...data }; this.items.push(event); return event; }
  async findById(id) { return this.items.find(e => e._id === id) ?? null; }
  async findAll() { return [...this.items]; }
  async findActiveInSlot({ date, location, excludeId }) {
    return this.items.find(e => e.status === 'active' && e.location === location
      && new Date(e.date).getTime() === date.getTime() && e._id !== excludeId) ?? null;
  }
  async update(id, data) { Object.assign(await this.findById(id), data); return this.findById(id); }
  async delete(id) { this.items = this.items.filter(e => e._id !== id); }
}

class FakeRegistrationRepository extends RegistrationRepository {
  constructor(items = []) { super(); this.items = items; }
  isValidId(id) { return /^\d{24}$/.test(String(id)); }
  async countConfirmed(eventId) { return this.items.filter(r => r.eventId === eventId && r.status === 'confirmed').length; }
  async findConfirmed(eventId, participantId) {
    return this.items.find(r => r.eventId === eventId && r.participantId === participantId && r.status === 'confirmed') ?? null;
  }
  async create({ eventId, participantId }) {
    const registration = { _id: newId(), eventId, participantId, status: 'confirmed', date: new Date() };
    this.items.push(registration);
    return registration;
  }
  async findById(id) { return this.items.find(r => r._id === id) ?? null; }
  async findInEvent(eventId, id) { return this.items.find(r => r._id === id && r.eventId === eventId) ?? null; }
  async cancel(id) { const r = await this.findById(id); r.status = 'cancelled'; return r; }
  async delete(id) { this.items = this.items.filter(r => r._id !== id); }
}

class FakeUserRepository extends UserRepository {
  constructor(users = []) { super(); this.items = users; }
  async create(data) { const user = { _id: newId(), ...data }; this.items.push(user); return user; }
  async findByEmail(email) { return this.items.find(u => u.email === email) ?? null; }
  async findById(id) { return this.items.find(u => u._id === id) ?? null; }
  async update(id, changes) { return Object.assign(await this.findById(id), changes); }
}

class FakeHasher extends PasswordHasher {
  async hash(plain) { return `hash:${plain}`; }
  async compare(plain, hashed) { return hashed === `hash:${plain}`; }
}

class FakeTokenService extends TokenService {
  sign(payload) { return `token-${payload.id}`; }
}

class FakeNotifier extends RegistrationNotifier {
  constructor({ fails = false } = {}) { super(); this.fails = fails; this.sent = []; }
  async notifyRegistration(email, event) {
    if (this.fails) throw new Error('SMTP caído');
    this.sent.push({ email, event });
  }
}

module.exports = {
  FakeEventRepository, FakeRegistrationRepository, FakeUserRepository, FakeHasher, FakeTokenService, FakeNotifier, newId
};
