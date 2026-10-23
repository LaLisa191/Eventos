// Elimina todas las inscripciones canceladas del usuario autenticado
class DeleteMyCancelledRegistrations {
  constructor({ registrations }) {
    this.registrations = registrations;
  }

  async execute({ userId }) {
    return { deleted: await this.registrations.deleteCancelledOf(userId) };
  }
}

module.exports = DeleteMyCancelledRegistrations;
