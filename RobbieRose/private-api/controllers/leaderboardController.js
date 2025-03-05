// /private-api/controllers/leaderboardController.js (partial update)
const redis = require('redis');
const client = redis.createClient();

const getLeaderboard = async (req, res) => {
  try {
    const cached = await client.get('leaderboard');
    if (cached) return res.json(JSON.parse(cached));
    const users = await User.find().sort({ points: -1 }).limit(100);
    const top100 = users.map((u, i) => ({ rank: i + 1, username: u.username, points: u.points }));
    const user = await User.findOne({ shopifyId: req.user.shopifyId });
    const data = { top100, rank: user.rank };
    await client.setEx('leaderboard', 60, JSON.stringify(data)); // Cache for 60s
    io.emit('leaderboardUpdate', data);
    res.json(data);
  } catch (err) {
    logger.error(`Leaderboard fetch failed: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

// /private-api/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
module.exports = {
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 100 requests per IP
  })
};
module.exports = { getLeaderboard, updateLeaderboard };