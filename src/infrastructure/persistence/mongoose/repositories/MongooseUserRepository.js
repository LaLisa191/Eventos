const { UserRepository } = require('../../../../application/ports');
const User = require('../models/User');

class MongooseUserRepository extends UserRepository {
  async create(data) {
    return (await User.create(data)).toObject();
  }

  findByEmail(email, { withPassword = false } = {}) {
    const query = User.findOne({ email });
    return (withPassword ? query.select('+password') : query).lean();
  }

  findById(id, { withPassword = false } = {}) {
    const query = User.findById(id);
    return (withPassword ? query.select('+password') : query).lean();
  }

  async update(id, changes) {
    const user = await User.findById(id).select('+password');
    Object.assign(user, changes);
    await user.save();
    return user.toObject();
  }

  async listFavorites(id) {
    const user = await User.findById(id).populate('favorites').lean();
    return user.favorites;
  }

  async addFavorite(id, eventId) {
    const user = await User.findById(id);
    if (!user.favorites.some(favorite => String(favorite) === String(eventId))) {
      user.favorites.push(eventId);
      await user.save();
    }
    return user.favorites;
  }

  async removeFavorite(id, eventId) {
    const user = await User.findById(id);
    user.favorites = user.favorites.filter(favorite => String(favorite) !== String(eventId));
    await user.save();
    return user.favorites;
  }
}

module.exports = MongooseUserRepository;
