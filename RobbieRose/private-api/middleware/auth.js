const jwt = require('jsonwebtoken');
const { JWT_SECRET, SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = require('../config/env');
const Shopify = require('shopify-api-node'); // New dependency

const shopify = new Shopify({
  shopName: 'robbie-rose-dev',
  apiKey: SHOPIFY_API_KEY,
  password: SHOPIFY_API_SECRET
});

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const customer = await shopify.customer.get(decoded.shopifyId);
    req.user = { shopifyId: customer.id.toString() };
    next();
  } catch (err) {
    console.error(`Auth failed: ${err.message}`);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { auth };