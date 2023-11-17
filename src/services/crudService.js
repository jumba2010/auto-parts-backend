const { dynamoDBClient } = require('../../config/awsConfig');

const constants=require('../utils/constants');
const {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} = require('@aws-sdk/client-dynamodb');

const { marshall,unmarshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');
const {composeUdateFields,flattenAttributes}=require('../utils/DynamoDBUpdaterUtil');
const {getCurrentDateTime}=require('../utils/DatetimeUtils');

const create = async (tableName,payload) => {
  
  try {
    payload.id = await uuidv4();
    payload.active = 1;
    payload.createdAt = getCurrentDateTime();

    let newPayload =removeEmpty(payload)

    const params = {
      TableName:tableName,
      Item: marshall(newPayload),
    };
    
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
    return payload;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const findBySucursalId= async (tableName, sucursalId) => {
  try {
    const command = new QueryCommand({
      IndexName: 'sucursalId-index', 
      KeyConditionExpression: "sucursalId = :sucursalId",
      ExpressionAttributeValues: {
        ":sucursalId": { S: sucursalId }
      },
      TableName: tableName,
    });
  
    const response = await dynamoDBClient.send(command);
    return flattenAttributes(response.Items)
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const queryBySucursalId= async (tableName, sucursalId, lastEvaluatedKey, pageLimit) => {
  const data = []

  let done = false;

  lastEvaluatedKey = !lastEvaluatedKey || lastEvaluatedKey==''?null:lastEvaluatedKey;

  while (!done) {
    try {
      const command = new QueryCommand({
        IndexName: 'sucursalId-index',
        KeyConditionExpression: "sucursalId = :sucursalId",
        ExpressionAttributeValues: {
          ":sucursalId": { S: sucursalId }
        },
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: pageLimit,
        ScanIndexForward: false,
      });

      const response = await dynamoDBClient.send(command);

      if (response.Items) {
        data.push(...flattenAttributes(response.Items));
      }

      lastEvaluatedKey = response.LastEvaluatedKey;

      if (!lastEvaluatedKey) {
           done = true; 
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return { data, lastEvaluatedKey };
};





const queryBySucursalIdAnYear = async (tableName,sucursalId,year) => {

  if(!tableName || !sucursalId || !year){
    return []
  }

  try {
    const command = new QueryCommand({
      IndexName: 'sucursalId-index',
      KeyConditionExpression: "sucursalId = :sucursalId",
      ExpressionAttributeNames: {
        '#year': 'year',
        '#active':'active'
      },
      FilterExpression: "#year = :year and #active = :active",
      ExpressionAttributeValues: {
        ":sucursalId": { S: sucursalId },
        ":year": { N: year.toString() },
        ":active":{N: '1'}
      },
      TableName: tableName,
    });

    const response = await dynamoDBClient.send(command);
    return flattenAttributes(response.Items)
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const queryBySucursalIdAndStatus = async (tableName,sucursalId,status) => {
  if(!tableName || !sucursalId || !year || !status){
    return []
  }

  console.log(tableName,sucursalId,status,year)
  try {
    const command = new QueryCommand({
      IndexName: 'sucursalId-index',
      KeyConditionExpression: "sucursalId = :sucursalId",
      FilterExpression: "#status = :status and #active = :active",
      ExpressionAttributeNames: {
        '#year': 'year',
        '#status': 'status',
        '#active':'active'
      },
      ExpressionAttributeValues: {
        ":sucursalId": { S: sucursalId },
        ":status": { N: status.toString()},
        ':active':{N:"1"}
      },
      TableName: tableName,
    });
  
    const response = await dynamoDBClient.send(command);
    return flattenAttributes(response.Items)
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const queryUnpaidBySucursalId= async (tableName,sucursalId) => {
  if(!tableName || !sucursalId ){
    return []
  }

  try {
    const command = new QueryCommand({
      IndexName: 'sucursalId-index',
      KeyConditionExpression: "sucursalId = :sucursalId",
      FilterExpression: "#status = :status and #hasFine = :hasFine and #active = :active",
      ExpressionAttributeNames: {
        '#status': 'status',
        '#hasFine': 'hasFine',
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ":sucursalId": { S: sucursalId },
        ":status": { N: "0"},
        ":hasFine": { N: "1"},
        ":active":  {N: "1"},
      },
      TableName: tableName,
    });
  
    const response = await dynamoDBClient.send(command);
    return flattenAttributes(response.Items)
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const readById = async (tableName,id) => {

  try {
    const params = {
      TableName: tableName,
      Key: marshall({ id: id }),
    };

    const command = new GetItemCommand(params);
    const response = await dynamoDBClient.send(command);

    if (!response.Item) {
      throw new Error('not_found',`${tableName} was not found by id ${id}`);
    }

    return flattenAttributes(response.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const update = async (tableName,id,createdAt, payload) => {
payload.updatedAt = getCurrentDateTime();
let newPayload = removeEmpty(payload)
let fieldsToUpdate = composeUdateFields(newPayload);

  try {
    const input = {
      ExpressionAttributeNames:fieldsToUpdate.expressionAttributeNames,
      ExpressionAttributeValues: fieldsToUpdate.expressionAttributeValues,
      Key: {
        "id": { S: id },
        "createdAt": { S: createdAt }
      },
      ReturnValues: "ALL_NEW",
      TableName: tableName,
      UpdateExpression:fieldsToUpdate.updateExpression,
    };

    const command = new UpdateItemCommand(input);
    await dynamoDBClient.send(command);

    return newPayload;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const deleteRow = async (tableName,id,createdAt) => {
  try {
    const params = {
      TableName:tableName,
      Key: {
        "id": { S: id },
        "createdAt": { S: createdAt }
      },
    };


    const command = new DeleteItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const inactivate = async (tableName,id) => {
  try {
    const params = {
      Key: {
        "id": {
          S: id
        }
      },
      ReturnValues: "ALL_NEW",
      TableName: tableName,
      UpdateExpression: 'SET #active = :active',
      ExpressionAttributeNames: {
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ':active': {N: "0"}, 
      },
    };

    const command = new UpdateItemCommand(params);
    await dynamoDBClient.send(command);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findActiveByUserName = async (tableName,username) => {
  try {
    const command = new QueryCommand({
      IndexName: 'sge-username-index', 
      KeyConditionExpression: "username = :username",
      FilterExpression: "#active = :active",
      ExpressionAttributeNames: {
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ":username": { S: username },
        ":active": { N: "1" }
      },
      TableName: tableName,
    });
    
    const response = await dynamoDBClient.send(command);
    return flattenAttributes(response.Items[0]);

  } catch (error) {
    console.log(error);
    throw error;
  }
};

async function buildChart(tableName,sucursalId,startDate,endDate ) {
  try {

      const queryCommand = new QueryCommand({
      TableName: tableName,
      IndexName: 'sucursalId-index', 
      KeyConditionExpression: "sucursalId = :sucursalId",
      FilterExpression: '#date BETWEEN :start_date AND :end_date',
      ExpressionAttributeNames: {
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':sucursalId': { S: sucursalId },
        ':start_date':  { S,startDate},
        ':end_date':  { S:endDate},
      },
      ProjectionExpression: '#date, COUNT(#date) as totalCount',
      GroupBy: '#date',
    });

    const result = await dynamoDBClient.send(queryCommand);

    const chartData = result.Items.map(item => ({
      x: item.createdAt,
      y: item.totalCount,
    }));

    return chartData;
  } catch (error) {
    console.error('Error building chart:', error);
    throw error;
  }
}

async function sumAmountByDateInterval(tableName,sucursalId,startDate, endDate) {
  try {

    const queryCommand = new QueryCommand({
      TableName: tableName,
      IndexName: 'sucursalId-index',  
      KeyConditionExpression: "sucursalId = :sucursalId",
      FilterExpression: '#date BETWEEN :start_date AND :end_date',
      ExpressionAttributeNames: {
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':sucursalId': { S: sucursalId },
        ':start_date':  { S,startDate},
        ':end_date':  { S:endDate},
      },
      ProjectionExpression: 'amount', 
    });

    const result = await dynamoDBClient.send(queryCommand);

    const totalOrderAmount = result.Items.reduce((sum, item) => sum + Number(item.amount), 0);

    return totalOrderAmount;
  } catch (error) {
    console.error('Error summing order amounts:', error);
    throw error;
  }
}

const findActiveByUserId= async (tableName,userId) => {
  try {
    const command = new QueryCommand({
      IndexName: 'userId-index', 
      KeyConditionExpression: "userId = :userId",
      FilterExpression: "#active = :active",
      ExpressionAttributeNames: {
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ":userId": { S: userId },
        ":active": { N: "1" }
      },
      TableName: tableName,
    });
    
    const response = await dynamoDBClient.send(command);
    return flattenAttributes(response.Items[0]);

  } catch (error) {
    console.log(error);
    throw error;
  }
};


const removeEmpty = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else if (obj[key] !== undefined && obj[key] !== '') newObj[key] = obj[key];
  });
  return newObj;
};

module.exports = { 
  create, 
  update, 
  deleteRow, 
  inactivate,
  readById,
  queryBySucursalId,
  queryBySucursalIdAnYear,
  findActiveByUserName,
  queryBySucursalIdAndStatus,
  queryUnpaidBySucursalId,
  buildChart,
  sumAmountByDateInterval,
  findActiveByUserId,
  findBySucursalId
 };