const constants = require("../utils/constants");

const reviewSchema = {
  TableName: constants.REVIEW_TABLE,
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'createdAt', AttributeType: 'S' } // Use 'S' for string data type
  ],
  BillingMode: 'PAY_PER_REQUEST', // Enable on-demand capacity mode
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH', // Partition Key
    },
    {
      AttributeName: 'createdAt',
      KeyType: 'RANGE', // Sort Key
    }
  ],
};

module.exports = reviewSchema;
