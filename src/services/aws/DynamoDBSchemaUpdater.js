const DynamoDBTableUtility = require('../../utils/DynamoDBTableUtility');
const carPartSchema = require('../../models/carpart');
const userSchema = require('../../models/user');
const orderSchema = require('../../models/order');
const paymentSchema = require('../../models/payment');
const vehicleSchema = require('../../models/vehicle');
const promotionSchema = require('../../models/promotion');
const profileSchema = require('../../models/profile');
const commentSchema = require('../../models/comment');
const reviewSchema = require('../../models/review');
const sucursalSchema = require('../../models/sucursal');
const logginInfoSchema = require('../../models/logininfo');


const carPartTableUtility = new DynamoDBTableUtility(carPartSchema.TableName, carPartSchema);
const userTableUtility = new DynamoDBTableUtility( userSchema.TableName, userSchema);
const orderTableUtility = new DynamoDBTableUtility(orderSchema.TableName, orderSchema);
const paymentTableUtility = new DynamoDBTableUtility(paymentSchema.TableName, paymentSchema);
const vehicleTableUtility = new DynamoDBTableUtility(vehicleSchema.TableName, vehicleSchema);
const promotionTableUtility = new DynamoDBTableUtility(promotionSchema.TableName, promotionSchema);
const profileTableUtility = new DynamoDBTableUtility(profileSchema.TableName, profileSchema);
const commentTableUtility = new DynamoDBTableUtility(commentSchema.TableName, commentSchema);
const reviewTableUtility = new DynamoDBTableUtility(reviewSchema.TableName, reviewSchema);
const sucursalTableUtility = new DynamoDBTableUtility(sucursalSchema.TableName, sucursalSchema);
const logginInfoTableUtility = new DynamoDBTableUtility(logginInfoSchema.TableName, logginInfoSchema);


const update=async () => {
  await carPartTableUtility.checkOrCreateTable();
  await userTableUtility.checkOrCreateTable();
  await orderTableUtility.checkOrCreateTable();
  await paymentTableUtility.checkOrCreateTable();
  await vehicleTableUtility.checkOrCreateTable();
  await promotionTableUtility.checkOrCreateTable();
  await profileTableUtility.checkOrCreateTable();
  await commentTableUtility.checkOrCreateTable();
  await reviewTableUtility.checkOrCreateTable();
  await sucursalTableUtility.checkOrCreateTable();
  await logginInfoTableUtility.checkOrCreateTable();

}

module.exports = {update};
