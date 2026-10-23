class ListMyRegistrations {
  constructor({ registrations }) {
    this.registrations = registrations;
  }

  execute({ userId }) {
    return this.registrations.listByParticipant(userId);
  }
}

module.exports = ListMyRegistrations;
