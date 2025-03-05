const mongoose = require('mongoose');

const MasterworksAccessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  invitedManually: { type: Boolean, default: false },
  grantedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MasterworksAccess', MasterworksAccessSchema);