# API Flow Diagrams

## Purchase Event
1. User adds to cart -> POST /api/users/add-points
2. Points update -> TierController.updateTier
3. Tier updates -> WebSocket 'tierUpdate'
4. Leaderboard recalculates -> LeaderboardController.updateLeaderboard
5. WebSocket 'leaderboardUpdate' -> UI updates