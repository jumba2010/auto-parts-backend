const DynamoDBTableUtility = require('../../utils/DynamoDBTableUtility');
const carPartSchema = require('../../models/CarPart');

const carPartTableUtility = new DynamoDBTableUtility(carPartSchema.TableName, carPartSchema);

const update=async () => {
  await carPartTableUtility.checkOrCreateTable();


}

module.exports = {update};
