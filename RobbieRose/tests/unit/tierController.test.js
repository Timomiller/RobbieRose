const { checkDecay, updateTier } = require('../../private-api/controllers/tierController');
const User = require('../../private-api/models/User');

jest.mock('../../private-api/models/User');

test('checkDecay resets inactive users', async () => {
  User.find.mockResolvedValue([{ shopifyId: '1', tier: 'Loyal', lastActivity: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000) }]);
  const res = { json: jest.fn() };
  await checkDecay({}, res);
  expect(res.json).toHaveBeenCalledWith({ message: 'Decay checked' });
});