const constants = require('../utils/constants');
const crudService = require("../services/crudService");

const createOrder = async (req, res) => {
  try {
    const { orderData } = req.body;

    const newOrder = await crudService.create(constants.ORDER_TABLE,orderData);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the order.' });
  }
};

const readOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await crudService.readById(constants.ORDER_TABLE,orderId);

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
    const { orderId,createdAt } = req.params;

    await crudService.update(constants.ORDER_TABLE,orderId,createdAt,{status:'CANCELLED',});

    res.json({ message: 'Order canceled successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while canceling the order.' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId,createdAt } = req.params;
    const { status } = req.body;

    await crudService.update(constants.ORDER_TABLE,createdAt,orderId, {status});

    res.json({ message: 'Order status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the order status.' });
  }
};

const findActiveOrdersBysucursalId = async (req, res) => {
  try {

    const { sucursalId } = req.params;

    const activeOrders = await crudService.queryBySucursalId(constants.ORDER_TABLE,sucursalId);

    res.json(activeOrders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching active orders by user.' });
  }
};

const findCancelledOrders = async (req, res) => {
  try {
    const cancelledOrders = await crudService.queryBySucursalIdAndStatus(constants.ORDER_TABLE,req.params.sucursalId,'CANCELLED');

    res.json(cancelledOrders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching canceled orders.' });
  }
};

const buildChart = async (req, res) => {
  try {

    const { sucursalId,startDate,endDate } = req.params;

    const visits = await crudService.buildChart(constants.ORDER_TABLE,sucursalId,startDate,endDate);

    res.status(200).json(visits);
  } catch (error) {
    res.status(404).json({ error: 'No Item found by the given Id' });
  }
};

const sumAmountByDateInterval = async (req, res) => {
  try {

    const { sucursalId,startDate,endDate } = req.params;

    const sumAmount = await crudService.sumAmountByDateInterval(constants.ORDER_TABLE,sucursalId,startDate,endDate);

    res.status(200).json(sumAmount);
  } catch (error) {
    res.status(404).json({ error: 'No Item found by the given Id' });
  }
};

module.exports = {
  createOrder,
  readOrder,
  cancelOrder,
  updateOrderStatus,
  findActiveOrdersBysucursalId,
  findCancelledOrders,
  buildChart,
  sumAmountByDateInterval,
};
