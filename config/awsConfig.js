const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const { S3Client } = require("@aws-sdk/client-s3");

// Create a DynamoDB client using the specified profile and region
const dynamoDBClient = new DynamoDBClient({
  credentials: fromIni({
    profile: process.env.AWS_PROFILE || 'dev',
  }),
  removeUndefinedValues: true,
  region: process.env.AWS_REGION,
});

// Create a S3 client using the specified profile and region
const s3Client = new S3Client({ 
  credentials: fromIni({
    profile: process.env.AWS_PROFILE || 'dev',
  }),
  region: process.env.AWS_REGION
});

module.exports={
  dynamoDBClient,
  s3Client
}



