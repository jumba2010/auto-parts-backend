const { paymentSchema, dynamoDB } = require('../models/Payment');

// Function to create a new payment
const createPayment = async (paymentData) => {
  try {
    // Use the DynamoDB schema for creating the item
    const params = {
      ...paymentSchema,
      Item: paymentData,
    };

    await dynamoDB.put(params).promise();
    return paymentData;
  } catch (error) {
    throw error;
  }
};

// Function to read a payment by ID
const readPayment = async (paymentId) => {
  try {
    const params = {
      ...paymentSchema,
      Key: {
        id: paymentId,
      },
    };

    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      throw new Error('Payment not found');
    }
    return result.Item;
  } catch (error) {
    throw error;
  }
};

// Function to cancel a payment (update status to CANCELED)
const cancelPayment = async (paymentId) => {
  try {
    const params = {
      ...paymentSchema,
      Key: {
        id: paymentId,
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

// Function to update payment status and lastUpdate timestamp
const updatePaymentStatus = async (paymentId, newStatus) => {
  try {
    const params = {
      ...paymentSchema,
      Key: {
        id: paymentId,
      },
      UpdateExpression: 'SET #status = :status, #lastUpdate = :timestamp',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#lastUpdate': 'lastUpdate',
      },
      ExpressionAttributeValues: {
        ':status': newStatus,
        ':timestamp': Date.now(),
      },
    };

    await dynamoDB.update(params).promise();
  } catch (error) {
    throw error;
  }
};

// Function to find active payments by user (everything not canceled)
const findActivePaymentsByUser = async (userId) => {
  try {
    const params = {
      ...paymentSchema,
      FilterExpression: 'attribute_not_exists(#status) OR #status <> :canceled',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':canceled': 'CANCELED',
      },
    };

    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  } catch (error) {
    throw error;
  }
};

// Function to find canceled payments
const findCancelledPayments = async () => {
  try {
    const params = {
      ...paymentSchema,
      FilterExpression: '#status = :canceled',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':canceled': 'CANCELED',
      },
    };

    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPayment,
  readPayment,
  cancelPayment,
  updatePaymentStatus,
  findActivePaymentsByUser,
  findCancelledPayments,
};
