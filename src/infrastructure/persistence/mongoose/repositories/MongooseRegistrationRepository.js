const mongoose = require('mongoose');
const { RegistrationRepository } = require('../../../../application/ports');
const Registration = require('../models/Registration');

class MongooseRegistrationRepository extends RegistrationRepository {
  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  countConfirmed(eventId) {
    return Registration.countDocuments({ eventId, status: 'confirmed' });
  }

  findConfirmed(eventId, participantId) {
    return Registration.findOne({ eventId, participantId, status: 'confirmed' }).lean();
  }

  async create({ eventId, participantId }) {
    return (await Registration.create({ eventId, participantId })).toObject();
  }

  findById(id) {
    return Registration.findById(id).lean();
  }

  findInEvent(eventId, id) {
    return Registration.findOne({ _id: id, eventId }).lean();
  }

  cancel(id) {
    return Registration.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true }).lean();
  }

  async delete(id) {
    await Registration.deleteOne({ _id: id });
  }

  listByEvent(eventId, { onlyConfirmed }) {
    const filter = onlyConfirmed ? { eventId, status: 'confirmed' } : { eventId };
    return Registration.find(filter).populate('participantId', 'name email').lean();
  }

  listByParticipant(participantId) {
    return Registration.find({ participantId }).populate('eventId').sort({ date: -1 }).lean();
  }

  async deleteCancelledOf(participantId) {
    const result = await Registration.deleteMany({ participantId, status: 'cancelled' });
    return result.deletedCount;
  }
}

module.exports = MongooseRegistrationRepository;
