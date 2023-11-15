const express = require('express');
const promotionController = require('../controllers/promotionController');

const router = express.Router();

// Create a new promotion
router.post('/', promotionController.createPromotion);

// Update an existing promotion
router.put('/:promotionId/:createdAt', promotionController.updatePromotion);

// Find all active promotions
router.get('/active/:sucursalId', promotionController.findActivePromotions);

module.exports = router;
