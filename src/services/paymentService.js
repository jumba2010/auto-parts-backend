const { dynamoDBClient } = require('../../config/awsConfig');
const {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand, 
} = require('@aws-sdk/client-dynamodb');

const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const constants = require('../utils/constants');
const { composeUpdateFields } = require('../utils/DynamoDBUpdaterUtil');
const { v4: uuidv4 } = require('uuid');

const createPayment = async (paymentData) => {
  try {
    paymentData.id = await uuidv4();
    const params = {
      TableName: constants.PAYMENT_TABLE,
      Item: marshall(paymentData),
    };

    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);

    return paymentData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const readPayment = async (paymentId) => {
  try {
    const params = {
      TableName: constants.PAYMENT_TABLE,
      Key: marshall({ id: paymentId }),
    };

    const command = new GetItemCommand(params);
    const response = await dynamoDBClient.send(command);

    if (!response.Item) {
      throw new Error('not_found', 'Payment not found');
    }

    return unmarshall(response.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const cancelPayment = async (paymentId) => {
  try {
    const params = {
      TableName: constants.PAYMENT_TABLE,
      Key: marshall({ id: paymentId }),
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'CANCELED',
      },
    };

    const command = new UpdateItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updatePaymentStatus = async (paymentId, newStatus) => {
  try {
    const params = {
      TableName: constants.PAYMENT_TABLE,
      Key: marshall({ id: paymentId }),
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

    const command = new UpdateItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findActivePaymentsByUser = async (userId) => {
  try {
    const params = {
      TableName: constants.PAYMENT_TABLE,
      FilterExpression: 'attribute_not_exists(#status) OR #status <> :canceled',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':canceled': 'CANCELED',
      },
    };

    const command = new ScanCommand(params);
    const response = await dynamoDBClient.send(command);

    return response.Items.map((item) => unmarshall(item));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findCancelledPayments = async () => {
  try {
    const params = {
      TableName: constants.PAYMENT_TABLE,
      FilterExpression: '#status = :canceled',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':canceled': 'CANCELED',
      },
    };

    const command = new ScanCommand(params);
    const response = await dynamoDBClient.send(command);

    return response.Items.map((item) => unmarshall(item));
  } catch (error) {
    console.log(error);
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
