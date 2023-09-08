// orderRoute.js

const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Create a new order
router.post('/', orderController.createOrder);

// Get order by ID
router.get('/:orderId', orderController.readOrder);

// Cancel an order
router.delete('/:orderId', orderController.cancelOrder);

// Update order status
router.put('/:orderId', orderController.updateOrderStatus);

// Get active orders by user
router.get('/user/:userId/active', orderController.findActiveOrdersByUser);

// Get canceled orders
router.get('/user/:userId/cancelled', orderController.findCancelledOrders);

module.exports = router;
