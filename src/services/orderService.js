// orderService.js

const { orderSchema, dynamoDB } = require('../models/Order');

const createOrder = async (orderData) => {
  try {
    // Use the DynamoDB schema for creating the item
    const params = {
      ...orderSchema,
      Item: orderData,
    };

    await dynamoDB.put(params).promise();
    return orderData;
  } catch (error) {
    throw error;
  }
};

const readOrder = async (orderId) => {
  try {
    const params = {
      ...orderSchema,
      Key: {
        id: orderId,
      },
    };

    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      throw new Error('Order not found');
    }
    return result.Item;
  } catch (error) {
    throw error;
  }
};

const cancelOrder = async (orderId) => {
  try {
    const params = {
      ...orderSchema,
      Key: {
        id: orderId,
      },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'CANCELED',
      },
    };

    await dynamoDB.update(params).promise();
  } catch (error) {
    throw error;
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const params = {
      ...orderSchema,
      Key: {
        id: orderId,
      },
      UpdateExpression: 'SET #status = :status, #lastUpdate = :lastUpdate',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#lastUpdate': 'lastUpdate',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':lastUpdate': new Date().toISOString(),
      },
    };

    await dynamoDB.update(params).promise();
  } catch (error) {
    throw error;
  }
};

const findActiveOrdersByUser = async (userId) => {
  try {
    const params = {
      TableName: orderSchema.TableName,
      IndexName: 'UserIdIndex', // Assuming you have an index for userId
      KeyConditionExpression: '#userId = :userId AND #status <> :status',
      ExpressionAttributeNames: {
        '#userId': 'userId',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':status': 'CANCELED', 
      },
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items;
  } catch (error) {
    throw error;
  }
};

const findCancelledOrders = async (userId) => {
  try {
    const params = {
      TableName: orderSchema.TableName,
      IndexName: 'StatusIndex', // Assuming you have an index for status
      KeyConditionExpression: '#userId = :userId AND #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':status': 'CANCELED', 
      },
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items;
  } catch (error) {
    throw error;
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
