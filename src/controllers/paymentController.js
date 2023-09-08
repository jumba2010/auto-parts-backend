const paymentService = require('../services/paymentService');

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const { paymentData } = req.body;
    const newPayment = await paymentService.createPayment(paymentData);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the payment.' });
  }
};

// Get a payment by ID
const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentService.readPayment(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the payment.' });
  }
};

// Cancel a payment
const cancelPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    await paymentService.cancelPayment(paymentId);
    res.json({ message: 'Payment canceled successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while canceling the payment.' });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { newStatus } = req.body;
    await paymentService.updatePaymentStatus(paymentId, newStatus);
    res.json({ message: 'Payment status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the payment status.' });
  }
};

// Find active payments by user (everything not canceled)
const findActivePaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const activePayments = await paymentService.findActivePaymentsByUser(userId);
    res.json(activePayments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching active payments.' });
  }
};

// Find canceled payments
const findCancelledPayments = async (req, res) => {
  try {
    const cancelledPayments = await paymentService.findCancelledPayments(userId);
    res.json(cancelledPayments);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching canceled payments.' });
  }
};

module.exports = {
  createPayment,
  getPayment,
  cancelPayment,
  updatePaymentStatus,
  findActivePaymentsByUser,
  findCancelledPayments,
};
