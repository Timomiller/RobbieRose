const rateLimit = (req, res, next) => {
    // Mock rate limiting - 100 requests per minute
    next();
  };
  
  module.exports = { rateLimit };