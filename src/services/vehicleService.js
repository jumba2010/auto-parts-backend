const { dynamoDBClient } = require('../../config/awsConfig');
const {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');
const constants = require('../utils/constants');
const { composeUpdateFields } = require('../utils/DynamoDBUpdaterUtil');

const createVehicle = async (vehicleData) => {
  try {
    vehicleData.id = await uuidv4();
    const params = {
      TableName: constants.VEHICLE_TABLE,
      Item: marshall(vehicleData),
    };

    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);

    return vehicleData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const readVehicle = async (vehicleId) => {
  try {
    const params = {
      TableName: constants.VEHICLE_TABLE,
      Key: marshall({ id: vehicleId }),
    };

    const command = new GetItemCommand(params);
    const response = await dynamoDBClient.send(command);

    if (!response.Item) {
      throw new Error('Vehicle not found');
    }

    return unmarshall(response.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateVehicle = async (vehicleId, vehicleData) => {
  let fieldsToUpdate = composeUpdateFields(vehicleData);

  try {
    const input = {
      ExpressionAttributeNames: fieldsToUpdate.expressionAttributeNames,
      ExpressionAttributeValues: fieldsToUpdate.expressionAttributeValues,
      Key: {
        id: vehicleId,
      },
      ReturnValues: 'ALL_NEW',
      TableName: constants.VEHICLE_TABLE,
      UpdateExpression: fieldsToUpdate.updateExpression,
    };

    const command = new UpdateItemCommand(input);
    await dynamoDBClient.send(command);

    return vehicleData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteVehicle = async (vehicleId) => {
  try {
    const params = {
      TableName: constants.VEHICLE_TABLE,
      Key: marshall({ id: vehicleId }),
    };

    const command = new DeleteItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { createVehicle, readVehicle, updateVehicle, deleteVehicle };
