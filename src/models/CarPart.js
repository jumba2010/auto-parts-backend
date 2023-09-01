const { dynamoDBConfig } = require('./awsConfig'); // Import AWS configuration

// Create a DynamoDB document client using the AWS configuration
const dynamoDB = new dynamoDBConfig.AWS.DynamoDB.DocumentClient();

// Define the DynamoDB schema for the CarPart entity
const carPartSchema = {
  TableName: 'CarParts', 
  Key: {
    carPartId: 'S', // 'S' indicates string type for the key
  },
  AttributeDefinitions: [
    { AttributeName: 'carPartId', AttributeType: 'S' },
    { AttributeName: 'name', AttributeType: 'S' },
    { AttributeName: 'vehicleId', AttributeType: 'S' },
    { AttributeName: 'brand', AttributeType: 'S' },
    { AttributeName: 'country', AttributeType: 'S' },
    { AttributeName: 'material', AttributeType: 'S' },
    { AttributeName: 'color', AttributeType: 'S' },
    { AttributeName: 'description', AttributeType: 'S' },
    { AttributeName: 'dimension', AttributeType: 'M' }, // 'M' indicates a map
    { AttributeName: 'features', AttributeType: 'L' }, // 'L' indicates a list
    { AttributeName: 'specifications', AttributeType: 'L' },
    { AttributeName: 'images', AttributeType: 'L' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

module.exports = { dynamoDB, carPartSchema };
