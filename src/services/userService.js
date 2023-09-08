const { userSchema, dynamoDB } = require('../models/User');

const createUser = async (userData) => {
  try {
    const params = {
      ...userSchema,
      Item: userData,
    };

    await dynamoDB.put(params).promise();
    return userData;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {

    const params = {
      ...userSchema,
      Key: {
        userId,
      },
      UpdateExpression: `
        SET #name = :name,
            #email = :email,
            #mobileVerified = :mobileVerified,
            #emailVerified = :emailVerified,
            #active = :active
      `,
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email',
        '#mobileVerified': 'mobileVerified',
        '#emailVerified': 'emailVerified',
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ':name': userData.name,
        ':email': userData.email,
        ':mobileVerified': userData.mobileVerified,
        ':emailVerified': userData.emailVerified,
        ':active': userData.active,
      },
    };

    await dynamoDB.update(params).promise();
    return userData;
  } catch (error) {
    throw error;
  }
};

const updateSearchHistory = async (userId, searchHistory) => {
  try {
    const params = {
      ...userSchema,
      Key: {
        userId,
      },
      UpdateExpression: 'SET #searchHistory = :searchHistory',
      ExpressionAttributeNames: {
        '#searchHistory': 'searchHistory',
      },
      ExpressionAttributeValues: {
        ':searchHistory': searchHistory,
      },
    };

    await dynamoDB.update(params).promise();
  } catch (error) {
    throw error;
  }
};

const updateOrders = async (userId, orders) => {
  try {
    const params = {
      ...userSchema,
      Key: {
        userId,
      },
      UpdateExpression: 'SET #orders = :orders',
      ExpressionAttributeNames: {
        '#orders': 'orders',
      },
      ExpressionAttributeValues: {
        ':orders': orders,
      },
    };

    await dynamoDB.update(params).promise();
  } catch (error) {
    throw error;
  }
};

const updateWishingList = async (userId, wishList) => {
  try {
    const params = {
      ...userSchema,
      Key: {
        userId,
      },
      UpdateExpression: 'SET #wishList = :wishList',
      ExpressionAttributeNames: {
        '#wishList': 'wishList',
      },
      ExpressionAttributeValues: {
        ':wishList': wishList,
      },
    };

    await dynamoDB.update(params).promise();
  } catch (error) {
    throw error;
  }
};

const inactivateUser = async (userId) => {
  try {
    const params = {
      ...userSchema,
      Key: {
        userId,
      },
      UpdateExpression: 'SET #active = :active',
      ExpressionAttributeNames: {
        '#active': 'active',
      },
      ExpressionAttributeValues: {
        ':active': false, 
      },
    };

    await dynamoDB.update(params).promise();
  } catch (error) {
    throw error;
  }
};

const findActiveUserById = async (userId) => {
  try {
    const params = {
      ...userSchema,
      Key: {
        userId,
      },
    };

    const result = await dynamoDB.get(params).promise();
    if (!result.Item || !result.Item.active) {
      throw new Error('Active user not found');
    }
    return result.Item;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  updateUser,
  updateSearchHistory,
  updateOrders,
  updateWishingList,
  inactivateUser,
  findActiveUserById,
};
