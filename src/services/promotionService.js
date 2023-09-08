const { promotionSchema, dynamoDB } = require('../models/Promotion');

const createPromotion = async (promotionData) => {
  try {
    const params = {
      ...promotionSchema,
      Item: promotionData,
    };

    await dynamoDB.put(params).promise();
    return promotionData;
  } catch (error) {
    throw error;
  }
};

const updatePromotion = async (promotionId, promotionData) => {
  try {

    const params = {
      ...promotionSchema,
      Key: {
        promotionId,
      },
      UpdateExpression: 'SET #percentage = :percentage, #startDate = :startDate, #endDate = :endDate, #applyToAll = :applyToAll, #active = :active',
      ExpressionAttributeNames: {
        '#percentage': 'percentage',
        '#startDate': 'startDate',
        '#endDate': 'endDate',
        '#applyToAll': 'applyToAll',
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ':percentage': promotionData.percentage,
        ':startDate': promotionData.startDate,
        ':endDate': promotionData.endDate,
        ':applyToAll': promotionData.applyToAll,
        ':active': promotionData.active,
      },
    };

    await dynamoDB.update(params).promise();
    return promotionData;
  } catch (error) {
    throw error;
  }
};


const findActivePromotions = async () => {
  try {
    const params = {
      ...promotionSchema,
      FilterExpression: '#active = :active',
      ExpressionAttributeNames: {
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ':active': true,
      },
    };

    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPromotion,
  updatePromotion,
  findActivePromotions
};
