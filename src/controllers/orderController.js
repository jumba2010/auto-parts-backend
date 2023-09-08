const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  try {
    const { orderData } = req.body;

    const newOrder = await orderService.createOrder(orderData);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the order.' });
  }
};

const readOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderService.readOrder(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the order.' });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    await orderService.cancelOrder(orderId);

    res.json({ message: 'Order canceled successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while canceling the order.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    await orderService.updateOrderStatus(orderId, status);

    res.json({ message: 'Order status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the order status.' });
  }
};

const findActiveOrdersByUser = async (req, res) => {
  try {

    const { userId } = req.params;

    const activeOrders = await orderService.findActiveOrdersByUser(userId);

    res.json(activeOrders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching active orders by user.' });
  }
};

const findCancelledOrders = async (req, res) => {
  try {
    const cancelledOrders = await orderService.findCancelledOrders(userId);

    res.json(cancelledOrders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching canceled orders.' });
  }
};

module.exports = {
  createOrder,
  readOrder,
  cancelOrder,
  updateOrderStatus,
  findActiveOrdersByUser,
  findCancelledOrders,
};
