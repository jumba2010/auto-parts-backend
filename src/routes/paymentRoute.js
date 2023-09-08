const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Create a new payment
router.post('/', paymentController.createPayment);

// Get a payment by ID
router.get('/:paymentId', paymentController.getPayment);

// Cancel a payment
router.delete('/:paymentId', paymentController.cancelPayment);

// Update payment status
router.put('/:paymentId', paymentController.updatePaymentStatus);

// Find active payments by user
router.get('/active/:userId', paymentController.findActivePaymentsByUser);

// Find canceled payments
router.get('/cancelled/:userId', paymentController.findCancelledPayments);

module.exports = router;
