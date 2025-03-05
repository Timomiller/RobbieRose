const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
const tierRoutes = require('./routes/tierRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const userRoutes = require('./routes/userRoutes');
const { auth } = require('./middleware/auth');
const { rateLimit } = require('./middleware/rateLimit');
const db = require('./config/db');
const shopifyWebhook = require('shopify-webhook'); // New dependency

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(rateLimit);
app.use('/api/tiers', auth, tierRoutes);
app.use('/api/leaderboard', auth, leaderboardRoutes);
app.use('/api/users', auth, userRoutes);

// Shopify Webhook setup
const webhook = shopifyWebhook({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  shopDomain: 'robbie-rose-dev.myshopify.com',
  webhookPath: '/webhooks'
});
app.use('/webhooks', webhook.middleware);

webhook.on('orders/create', async (order) => {
  const shopifyId = order.customer.id.toString();
  const points = order.total_price / 100 * 10; // Example: 10 points per dollar
  await require('./controllers/tierController').updateTier({ body: { shopifyId, points } }, { json: () => {} });
  require('./controllers/leaderboardController').updateLeaderboard();
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

mongoose.connect(db.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error(err));

module.exports = { io };