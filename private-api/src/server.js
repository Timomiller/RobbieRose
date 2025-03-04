const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let users = [
  { id: 1, points: 100, tier: 'Lovers' },
  { id: 2, points: 200, tier: 'Loyal' }
];

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/leaderboard/top100', (req, res) => {
  const ranked = users.sort((a, b) => b.points - a.points).slice(0, 100);
  res.json(ranked);
});

app.listen(3000, () => console.log('API running on port 3000'));