const { dynamoDBConfig } = require('./awsConfig'); 

const dynamoDB = new dynamoDBConfig.AWS.DynamoDB.DocumentClient();

const userSchema = {
  TableName: 'Users',
  Key: {
    userId: 'S',
  },
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'name', AttributeType: 'S' },
    { AttributeName: 'email', AttributeType: 'S' },
    { AttributeName: 'creationDate', AttributeType: 'N' }, // 'N' indicates a number type for timestamps
    { AttributeName: 'mobileVerified', AttributeType: 'BOOL' },
    { AttributeName: 'emailVerified', AttributeType: 'BOOL' },
    { AttributeName: 'active', AttributeType: 'BOOL' },
    { AttributeName: 'ratings', AttributeType: 'L' }, // 'L' indicates a list
    { AttributeName: 'orders', AttributeType: 'L' },
    { AttributeName: 'searchHistory', AttributeType: 'L' },
    { AttributeName: 'garage', AttributeType: 'L' },
    { AttributeName: 'wishList', AttributeType: 'L' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

module.exports = { dynamoDB, userSchema };
