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

const createPromotion = async (promotionData) => {
  try {
    promotionData.id = await uuidv4();
    const params = {
      TableName: constants.PROMOTION_TABLE,
      Item: marshall(promotionData),
    };

    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);

    return promotionData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const readPromotion = async (promotionId) => {
  try {
    const params = {
      TableName: constants.PROMOTION_TABLE,
      Key: marshall({ id: promotionId }),
    };

    const command = new GetItemCommand(params);
    const response = await dynamoDBClient.send(command);

    if (!response.Item) {
      throw new Error('not_found', 'Promotion not found');
    }

    return unmarshall(response.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updatePromotion = async (promotionId, promotionData) => {
  let fieldsToUpdate = composeUpdateFields(promotionData);
  console.log(fieldsToUpdate.expressionAttributeValues);
  try {
    const input = {
      ExpressionAttributeNames: fieldsToUpdate.expressionAttributeNames,
      ExpressionAttributeValues: fieldsToUpdate.expressionAttributeValues,
      Key: {
        "id": {
          S: promotionId
        }
      },
      ReturnValues: "ALL_NEW",
      TableName: constants.PROMOTION_TABLE,
      UpdateExpression: fieldsToUpdate.updateExpression,
    };

    const command = new UpdateItemCommand(input);
    await dynamoDBClient.send(command);

    return promotionData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deletePromotion = async (promotionId) => {
  try {
    const params = {
      TableName: constants.PROMOTION_TABLE,
      Key: marshall({ id: promotionId }),
    };

    const command = new DeleteItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findActivePromotions = async () => {
  try {
    const params = {
      TableName: constants.PROMOTION_TABLE,
      FilterExpression: '#active = :active',
      ExpressionAttributeNames: {
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ':active': true,
      },
    };

    const command = new ScanCommand(params); // Use ScanCommand for scanning the table
    const response = await dynamoDBClient.send(command);

    return response.Items.map((item) => unmarshall(item));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createPromotion,
  readPromotion,
  updatePromotion,
  deletePromotion,
  findActivePromotions,
};
