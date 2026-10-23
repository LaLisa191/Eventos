const mongoose = require('mongoose');
const { EventRepository } = require('../../../../application/ports');
const Event = require('../models/Event');

class MongooseEventRepository extends EventRepository {
  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async create(data) {
    return (await Event.create(data)).toObject();
  }

  findById(id) {
    return Event.findById(id).lean();
  }

  findAll() {
    return Event.find().sort({ _id: -1 }).lean();
  }

  // Un evento activo en el mismo lugar y a la misma hora (ignorando uno, si se está editando)
  findActiveInSlot({ date, location, excludeId }) {
    const filter = { date, location, status: 'active' };
    if (excludeId) filter._id = { $ne: excludeId };
    return Event.findOne(filter).lean();
  }

  update(id, data) {
    return Event.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  async delete(id) {
    await Event.deleteOne({ _id: id });
  }
}

module.exports = MongooseEventRepository;
