const constants = require("../utils/constants");

const carPartSchema = {
  TableName: constants.CAR_PART_TABLE,
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH',
    }
    
  ],
};

module.exports = carPartSchema;
