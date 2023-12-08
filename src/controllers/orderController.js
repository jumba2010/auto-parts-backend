const constants = require('../utils/constants');
const crudService = require("../services/crudService");
const {transformMapToList} = require('../utils/DynamoDBUpdaterUtil')

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    const newOrder = await crudService.create(constants.ORDER_TABLE,orderData);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the order.' });
  }
};

const findById = async (req, res) => {
  try {
    const { id,sucursalId } = req.params;
    const orders = await crudService.findByIdAndSucursalId(constants.ORDER_TABLE, id,sucursalId);
    let newList = await composeOrderData(orders)
    res.status(200).json(newList);
  } catch (error) {
    res.status(404).json({ error: 'No Item found by the given Id' });
  }
};

const findByUserId = async (req, res) => {
  try {
    
    const { userId} = req.params;
    const orders = await crudService.findByUserId(constants.ORDER_TABLE,userId);
    let newList = composeOrderData(orders)
    res.status(200).json(newList);
  } catch (error) {
    res.status(404).json({ error: 'No Item found by the the userId' });
  }
};

async function composeOrderData(orders) {
  const newList = [];
  for (let index = 0; index < orders.length; index++) {
    const order = orders[index];
    let items = transformMapToList(order.items);
    let totals = transformMapToList(order.totals);
    order.items = items;
    order.totals=totals
    newList.push(order);
  }
  return newList;
}


const cancelOrder = async (req, res) => {
  try {
    const { orderId,createdAt } = req.params;

    let order = await crudService.readById(constants.ORDER_TABLE,orderId);

    for (let index = 0; index < order.items.length; index++) {
      const item = order.items[index];
      let product = await crudService.readById(constants.CAR_PART_TABLE,item.id);
      let productPayload = {availableQuantity: parseInt(product.availableQuantity)+parseInt(item.quantity)}
      await crudService.update(constants.CAR_PART_TABLE,product.id,product.createdAt,productPayload);
    }

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


const refundPayment = async (req, res) => {
  try {
    const { orderId,createdAt } = req.params;
    const payload = req.body;

    await crudService.update(constants.ORDER_TABLE,createdAt,orderId, payload);

    res.json({ message: 'Order refunded successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while refunding order.' });
  }
};

const findActiveOrdersBysucursalIdAndDateInterval = async (req, res) => {
  try {

    const { sucursalId,startDate,endDate } = req.params;
    const activeOrders = await crudService.findActiveBySucursalIdAndDateInterval(constants.ORDER_TABLE,sucursalId,startDate,endDate );
    let newList = await composeOrderData(activeOrders)
    res.status(200).json(newList);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching active orders' });
  }
};


const findRefundedOrders = async (req, res) => {
  try {

    const { sucursalId,startDate,endDate } = req.params;

    const orders = await crudService.findRefundedOrders(constants.ORDER_TABLE,sucursalId,startDate,endDate );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching refunded orders' });
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
  cancelOrder,
  updateOrderStatus,
  findActiveOrdersBysucursalIdAndDateInterval,
  findCancelledOrders,
  buildChart,
  sumAmountByDateInterval,
  findRefundedOrders,
  refundPayment,
  findByUserId,
  findById,
};
