const AWS = require('../../config/awsConfig'); 
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const promotionSchema = {
  TableName: 'Promotions',
  Key: {
    promotionId: 'S', 
  },
  AttributeDefinitions: [
    { AttributeName: 'promotionId', AttributeType: 'S' },
    { AttributeName: 'percentage', AttributeType: 'N' },
    { AttributeName: 'startDate', AttributeType: 'N' },
    { AttributeName: 'endDate', AttributeType: 'N' },
    { AttributeName: 'applyToAll', AttributeType: 'BOOL' },
    { AttributeName: 'active', AttributeType: 'BOOL' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TimeToLiveSpecification: {
    AttributeName: 'endDate', // Name of the attribute storing the TTL timestamp
    Enabled: true, // Enable TTL
  },
};

module.exports = { dynamoDB, promotionSchema };
