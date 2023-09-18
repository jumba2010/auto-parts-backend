const AWS = require('../../config/awsConfig'); 
const dynamoDB = new AWS.DynamoDB.DocumentClient();


// Define the DynamoDB schema for the Payment entity
const paymentSchema = {
  TableName: 'Payments',
  Key: {
    id: 'S', // 'S' indicates string type for the key
  },
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'reference', AttributeType: 'S' },
    { AttributeName: 'date', AttributeType: 'N' }, // 'N' indicates number (timestamp)
    { AttributeName: 'orderAmount', AttributeType: 'N' },
    { AttributeName: 'orderId', AttributeType: 'S' },
    { AttributeName: 'status', AttributeType: 'S' },
    { AttributeName: 'paymentMethod', AttributeType: 'S' },
    { AttributeName: 'discount', AttributeType: 'N' },
    { AttributeName: 'paidAmount', AttributeType: 'N' },
    { AttributeName: 'currency', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

module.exports = { dynamoDB, paymentSchema };
