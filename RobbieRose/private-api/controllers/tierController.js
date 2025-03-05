const winston = require('winston');
const User = require('../models/User');
const MasterworksAccess = require('../models/MasterworksAccess');
const { io } = require('../server');
const cron = require('node-cron');

const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })]
});

const tiers = {
  Lovers: { decay: 15, points: 1000 },
  Loyal: { decay: 30, points: 3000 },
  Signature: { decay: 55, points: 5000 },
  Servitude: { decay: 80, points: 15000 },
  Echelon: { decay: Infinity, points: 25000 }
};

let masterworksSlots = 15; // Adjustable via admin endpoint

const checkDecay = async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const daysSinceActivity = (Date.now() - user.lastActivity) / (1000 * 60 * 60 * 24);
      const currentTier = tiers[user.tier];
      if (daysSinceActivity > currentTier.decay && user.tier !== 'Echelon') {
        user.tier = 'Lovers';
        user.points = 0;
        await user.save();
        io.emit('tierUpdate', { userId: user.shopifyId, tier: user.tier });
        io.emit('notification', { message: `${user.username} tier decayed to Lovers` });
      }
    }
  } catch (err) {
    logger.error(`Decay check failed: ${err.message}`);
  }
};

const updateTier = async (req, res) => {
  try {
    const { shopifyId, points } = req.body;
    let user = await User.findOne({ shopifyId });
    if (!user) {
      user = new User({ shopifyId, username: `User-${shopifyId}`, points: 0 });
    }
    user.points += points;
    user.lastActivity = Date.now();
    for (const [tier, data] of Object.entries(tiers).reverse()) {
      if (user.points >= data.points) {
        if (user.tier !== tier) {
          user.tier = tier;
          io.emit('notification', { message: `${user.username} advanced to ${tier}` });
          if (tier === 'Echelon') checkMasterworksEligibility(user);
        }
        break;
      }
    }
    await user.save();
    io.emit('tierUpdate', { userId: shopifyId, tier: user.tier });
    res.json(user);
  } catch (err) {
    logger.error(`Tier update failed: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

// Mock Data Note: Replace mock selection logic with Shopify customer tags in Phase 2
const checkMasterworksEligibility = async (user) => {
  const existingAccess = await MasterworksAccess.findOne({ userId: user._id });
  if (!existingAccess && Math.random() < 0.05) { // 5% chance
    await MasterworksAccess.create({ userId: user._id });
    io.emit('notification', { message: `${user.username}: Masterworks access granted`, url: '/pages/masterworks-hidden' });
  }
};

const selectMasterworksUsers = async () => {
  try {
    const echelonUsers = await User.find({ tier: 'Echelon' });
    const currentAccess = await MasterworksAccess.find();
    if (currentAccess.length >= masterworksSlots) return;

    const eligibleUsers = echelonUsers.filter(u => !currentAccess.some(a => a.userId.equals(u._id)));
    const selected = [];
    for (const user of eligibleUsers) {
      if (selected.length < masterworksSlots && Math.random() < 0.05) {
        selected.push(user);
      }
    }
    for (const user of selected) {
      await MasterworksAccess.create({ userId: user._id });
      io.emit('notification', { message: `${user.username}: Masterworks access granted`, url: '/pages/masterworks-hidden' });
    }
  } catch (err) {
    logger.error(`Masterworks selection failed: ${err.message}`);
  }
};

const inviteMasterworksUser = async (req, res) => {
  try {
    const { shopifyId } = req.body;
    const user = await User.findOne({ shopifyId, tier: 'Echelon' });
    if (!user) return res.status(404).json({ error: 'Echelon user not found' });
    const currentAccess = await MasterworksAccess.find();
    if (currentAccess.length >= masterworksSlots) {
      const toReplace = currentAccess.find(a => !a.invitedManually) || currentAccess[0];
      await MasterworksAccess.deleteOne({ _id: toReplace._id });
    }
    await MasterworksAccess.create({ userId: user._id, invitedManually: true });
    io.emit('notification', { message: `${user.username}: Masterworks access granted`, url: '/pages/masterworks-hidden' });
    res.json({ message: 'User invited' });
  } catch (err) {
    logger.error(`Manual invite failed: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

// Schedule daily decay and weekly Masterworks selection
cron.schedule('0 0 * * *', checkDecay); // Daily at midnight
cron.schedule('0 0 * * 0', selectMasterworksUsers); // Weekly on Sunday

module.exports = { checkDecay, updateTier, inviteMasterworksUser };