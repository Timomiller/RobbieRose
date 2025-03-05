const User = require('../models/User');
const { io } = require('../server');
// /controllers/userController.js (partial update)
const addPoints = async (req, res) => {
    // Existing logic
    if (points > 50) io.emit('notification', { message: `${user.username} earned ${points} points` });
  };
  
  // /controllers/tierController.js (example)
  io.emit('notification', { message: `${user.username} abandoned cart` }); // Triggered by future cart logic
  
const getUser = async (req, res) => {
  const user = await User.findOne({ shopifyId: req.user.shopifyId });
  res.json(user);
};

module.exports = { addPoints, getUser };