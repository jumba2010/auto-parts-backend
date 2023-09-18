const { dynamoDBClient } = require('../../config/awsConfig');
const {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const constants = require('../utils/constants');
const { composeUpdateFields } = require('../utils/DynamoDBUpdaterUtil');

const createUser = async (userData) => {
  try {
    const params = {
      TableName: constants.USER_TABLE,
      Item: marshall(userData),
    };

    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);

    return userData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const readUser = async (userId) => {
  try {
    const params = {
      TableName: constants.USER_TABLE,
      Key: marshall({ userId }),
    };

    const command = new GetItemCommand(params);
    const response = await dynamoDBClient.send(command);

    if (!response.Item) {
      throw new Error('User not found');
    }

    return unmarshall(response.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  let fieldsToUpdate = composeUpdateFields(userData);

  try {
    const input = {
      ExpressionAttributeNames: fieldsToUpdate.expressionAttributeNames,
      ExpressionAttributeValues: fieldsToUpdate.expressionAttributeValues,
      Key: {
        userId,
      },
      ReturnValues: 'ALL_NEW',
      TableName: constants.USER_TABLE,
      UpdateExpression: fieldsToUpdate.updateExpression,
    };

    const command = new UpdateItemCommand(input);
    await dynamoDBClient.send(command);

    return userData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const params = {
      TableName: constants.USER_TABLE,
      Key: marshall({ userId }),
    };

    const command = new DeleteItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const inactivateUser = async (userId) => {
  try {
    const params = {
      TableName: constants.USER_TABLE,
      Key: {
        userId,
      },
      UpdateExpression: 'SET #active = :active',
      ExpressionAttributeNames: {
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ':active': false, 
      },
    };

    const command = new UpdateItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findActiveUserById = async (userId) => {
  try {
    const params = {
      TableName: constants.USER_TABLE,
      Key: {
        userId,
      },
    };

    const result = await dynamoDBClient.send(new GetItemCommand(params));

    if (!result.Item || !result.Item.active) {
      throw new Error('Active user not found');
    }

    return unmarshall(result.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  inactivateUser,
  findActiveUserById,
};

