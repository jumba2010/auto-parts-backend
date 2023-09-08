const { dynamoDBConfig } = require('./awsConfig'); 
const dynamoDB = new dynamoDBConfig.AWS.DynamoDB.DocumentClient();

const carPartSchema = {
  TableName: 'CarParts', 
  Key: {
    carPartId: 'S',
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
    { AttributeName: 'dimension', AttributeType: 'M' }, 
    { AttributeName: 'features', AttributeType: 'L' }, 
    { AttributeName: 'specifications', AttributeType: 'L' },
    { AttributeName: 'images', AttributeType: 'L' },
    { AttributeName: 'ratings', AttributeType: 'L' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

module.exports = { dynamoDB, carPartSchema };
