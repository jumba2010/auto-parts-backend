const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

// Create a new user
router.post('/', userController.createUser);

// Update an existing user
router.put('/:userId', userController.updateUser);

// Update user's search history
router.put('/:userId/search-history', userController.updateSearchHistory);

// Update user's list of orders
router.put('/:userId/orders', userController.updateOrders);

// Update user's wish list
router.put('/:userId/wish-list', userController.updateWishingList);

// Inactivate a user
router.delete('/:userId', userController.inactivateUser);

// Find an active user by ID
router.get('/:userId', userController.findActiveUserById);

module.exports = router;
