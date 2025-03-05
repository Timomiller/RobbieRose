const express = require('express');
const { checkDecay, updateTier } = require('../controllers/tierController');
const router = express.Router();

router.get('/check-decay', checkDecay);
router.post('/update', updateTier);
router.post('/invite-masterworks', inviteMasterworksUser);

module.exports = router;