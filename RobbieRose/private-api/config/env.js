module.exports = {
    JWT_SECRET: 'mock-secret',
    SHOPIFY_API_KEY: 'mock-key',
    SHOPIFY_API_SECRET: 'mock-secret'
  };
  require('dotenv').config(); // New dependency
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY || 'your-api-key',
  SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET || 'your-api-secret'
};