const express = require('express');
const app = express();

let users = [
  { id: 1, points: 100, tier: 'Lovers' },
  { id: 2, points: 200, tier: 'Loyal' }
];

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/users/:id/tier', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) res.json({ tier: user.tier, points: user.points });
  else res.status(404).json({ error: 'User not found' });
});
app.post('/users/:id/points', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const points = req.body.points || 0;
  user.points += points;
  user.tier = calculateTier(user.points);
  res.json({ tier: user.tier, points: user.points });
});

function calculateTier(points) {
  if (points >= 1000) return 'Echelon';
  if (points >= 750) return 'Servitude';
  if (points >= 500) return 'Signature';
  if (points >= 250) return 'Loyal';
  return 'Lovers';
}

app.get('/leaderboard/top100', (req, res) => {
  const ranked = users.sort((a, b) => b.points - a.points).slice(0, 100);
  res.json(ranked);
});

app.listen(3000, () => console.log('API running on port 3000'));