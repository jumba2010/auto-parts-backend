const { dynamoDBClient } = require('../../config/awsConfig');
const {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  QueryCommand, 
} = require('@aws-sdk/client-dynamodb');

const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const constants = require('../utils/constants');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (orderData) => {
  try {
    orderData.id = await uuidv4();
    const params = {
      TableName: constants.ORDER_TABLE,
      Item: marshall(orderData),
    };

    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);

    return orderData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const readOrder = async (orderId) => {
  try {
    const params = {
      TableName: constants.ORDER_TABLE,
      Key: marshall({ id: orderId }),
    };

    const command = new GetItemCommand(params);
    const response = await dynamoDBClient.send(command);

    if (!response.Item) {
      throw new Error('not_found', 'Order not found');
    }

    return unmarshall(response.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const cancelOrder = async (orderId) => {
  try {
    const params = {
      TableName: constants.ORDER_TABLE,
      Key: marshall({ id: orderId }),
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

const updateOrderStatus = async (orderId, status) => {
  try {
    const params = {
      TableName: constants.ORDER_TABLE,
      Key: marshall({ id: orderId }),
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

    const command = new UpdateItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findActiveOrdersByUser = async (userId) => {
  try {
    const params = {
      TableName: constants.ORDER_TABLE,
      IndexName: 'UserIdIndex', 
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

    const command = new QueryCommand(params);
    const response = await dynamoDBClient.send(command);

    return response.Items.map((item) => unmarshall(item));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findCancelledOrders = async (userId) => {
  try {
    const params = {
      TableName: constants.ORDER_TABLE,
      IndexName: 'StatusIndex', 
      KeyConditionExpression: '#userId = :userId AND #status = :status',
      ExpressionAttributeNames: {
        '#userId': 'userId',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':status': 'CANCELED', 
      },
    };

    const command = new QueryCommand(params);
    const response = await dynamoDBClient.send(command);

    return response.Items.map((item) => unmarshall(item));
  } catch (error) {
    console.log(error);
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

