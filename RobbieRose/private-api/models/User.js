const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  shopifyId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  points: { type: Number, default: 0 },
  tier: { type: String, enum: ['Lovers', 'Loyal', 'Signature', 'Servitude', 'Echelon'], default: 'Lovers' },
  lastActivity: { type: Date, default: Date.now },
  rank: { type: Number, default: 0 },
  wishlist: [{ type: String }]
});

module.exports = mongoose.model('User', UserSchema);