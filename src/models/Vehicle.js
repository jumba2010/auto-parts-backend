const { dynamoDBConfig } = require('./awsConfig'); // Import AWS configuration

// Create a DynamoDB document client using the AWS configuration
const dynamoDB = new dynamoDBConfig.AWS.DynamoDB.DocumentClient();

// Define the DynamoDB schema for the Vehicle entity
const vehicleSchema = {
  TableName: 'Vehicles', 
  Key: {
    vehicleId: 'S', 
  },
  AttributeDefinitions: [
    { AttributeName: 'vehicleId', AttributeType: 'S' },
    { AttributeName: 'year', AttributeType: 'N' }, 
    { AttributeName: 'brand', AttributeType: 'S' },
    { AttributeName: 'model', AttributeType: 'S' },
    { AttributeName: 'engine', AttributeType: 'S' },
    { AttributeName: 'capacity', AttributeType: 'N' },
    { AttributeName: 'manufacturer', AttributeType: 'S' },
    { AttributeName: 'fuelType', AttributeType: 'S' }, 
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

module.exports = { dynamoDB, vehicleSchema };
