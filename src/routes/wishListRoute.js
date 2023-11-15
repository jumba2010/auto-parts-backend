const express = require('express');
const wishlistController = require('../controllers/wishlistController');

const router = express.Router();

router.get('/:sucursalId', wishlistController.findBySucursalId);

module.exports = router;
