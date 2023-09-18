const AWS = require('../../config/awsConfig'); 
const dynamoDB = new AWS.DynamoDB.DocumentClient();


// Define the DynamoDB schema for the Order entity
const orderSchema = {
  TableName: 'Orders',
  Key: {
    id: 'S',
  },
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'number', AttributeType: 'N' },
    { AttributeName: 'date', AttributeType: 'S' },
    { AttributeName: 'date', AttributeType: 'S' },
    { AttributeName: 'total', AttributeType: 'N' }, 
    { AttributeName: 'quantity', AttributeType: 'N' }, 
    { AttributeName: 'status', AttributeType: 'S' },
    { AttributeName: 'items', AttributeType: 'L' }, 
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

module.exports = { dynamoDB, orderSchema };
