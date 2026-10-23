const mongoose = require('mongoose');

// El hash de la contraseña ya no se hace aquí: es responsabilidad del puerto PasswordHasher
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  userType: { type: String, enum: ['organizer', 'participant'], required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

module.exports = mongoose.model('User', userSchema);
