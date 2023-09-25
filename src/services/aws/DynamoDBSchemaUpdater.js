const DynamoDBTableUtility = require('../../utils/DynamoDBTableUtility');
const carPartSchema = require('../../models/CarPart');
const userSchema = require('../../models/User');
const orderSchema = require('../../models/Order');
const paymentSchema = require('../../models/Payment');
const vehicleSchema = require('../../models/Vehicle');
const promotionSchema = require('../../models/Promotion');

const carPartTableUtility = new DynamoDBTableUtility(carPartSchema.TableName, carPartSchema);
const userTableUtility = new DynamoDBTableUtility( userSchema.TableName, userSchema);
const orderTableUtility = new DynamoDBTableUtility(orderSchema.TableName, orderSchema);
const paymentTableUtility = new DynamoDBTableUtility(paymentSchema.TableName, paymentSchema);
const vehicleTableUtility = new DynamoDBTableUtility(vehicleSchema.TableName, vehicleSchema);
const promotionTableUtility = new DynamoDBTableUtility(promotionSchema.TableName, promotionSchema);

const update=async () => {
  await carPartTableUtility.checkOrCreateTable();
  await userTableUtility.checkOrCreateTable();
  await orderTableUtility.checkOrCreateTable();
  await paymentTableUtility.checkOrCreateTable();
  await vehicleTableUtility.checkOrCreateTable();
  await promotionTableUtility.checkOrCreateTable();

}

module.exports = {update};
