const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

// Create a DynamoDB client using the specified profile and region
const dynamoDBClient = new DynamoDBClient({
  credentials: fromIni({
    profile: process.env.AWS_PROFILE || 'dev',
  }),
  removeUndefinedValues: true,
  region: process.env.AWS_REGION,
});

module.exports={
  dynamoDBClient
}

