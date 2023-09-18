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
const {composeUdateFields}=require('../utils/DynamoDBUpdaterUtil')

const createCarPart = async (carPartData) => {
  try {
    carPartData.id = await uuidv4();
    const params = {
      TableName: constants.CAR_PART_TABLE,
      Item: marshall(carPartData),
    };

    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);

    return carPartData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const readCarPart = async (carPartId) => {
  try {
    const params = {
      TableName: constants.CAR_PART_TABLE,
      Key: marshall({ id: carPartId }),
    };

    const command = new GetItemCommand(params);
    const response = await dynamoDBClient.send(command);

    if (!response.Item) {
      throw new Error('not_found','CarPart not found');
    }

    return unmarshall(response.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateCarPart = async (carPartId, carPartData) => {
let fieldsToUpdate=composeUdateFields(carPartData);
console.log(fieldsToUpdate.expressionAttributeValues)
  try {
    const input = {
      ExpressionAttributeNames:fieldsToUpdate.expressionAttributeNames,
      ExpressionAttributeValues: fieldsToUpdate.expressionAttributeValues,
      Key: {
        "id": {
          S: carPartId
        }
      },
      ReturnValues: "ALL_NEW",
      TableName: constants.CAR_PART_TABLE,
      UpdateExpression:fieldsToUpdate.updateExpression,
    };

    const command = new UpdateItemCommand(input);
    await dynamoDBClient.send(command);

    return carPartData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const deleteCarPart = async (carPartId) => {
  try {
    const params = {
      TableName: constants.CAR_PART_TABLE,
      Key: marshall({ id: carPartId }),
    };

    const command = new DeleteItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { createCarPart, readCarPart, updateCarPart, deleteCarPart };
