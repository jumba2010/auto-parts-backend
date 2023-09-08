// vehicleService.js

const { vehicleSchema, dynamoDB } = require('../models/Vehicle');

// Create a new vehicle
const createVehicle = async (vehicleData) => {
  try {
    // Validate the incoming request body

    // Use the DynamoDB schema for creating the item
    const params = {
      ...vehicleSchema,
      Item: vehicleData,
    };

    await dynamoDB.put(params).promise();
    return vehicleData;
  } catch (error) {
    throw error;
  }
};

// Get a vehicle by vehicleId
const readVehicle = async (vehicleId) => {
  try {
    const params = {
      ...vehicleSchema,
      Key: {
        vehicleId,
      },
    };

    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      throw new Error('Vehicle not found');
    }
    return result.Item;
  } catch (error) {
    throw error;
  }
};

// Update a vehicle by vehicleId
const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    // Validate the incoming request body
    // (you can add validation logic here)

    const params = {
      ...vehicleSchema,
      Key: {
        vehicleId,
      },
      UpdateExpression: 'SET #year = :year, #brand = :brand, #model = :model, #engine = :engine, #capacity = :capacity, #manufacturer = :manufacturer, #fuelType = :fuelType',
      ExpressionAttributeNames: {
        '#year': 'year',
        '#brand': 'brand',
        '#model': 'model',
        '#engine': 'engine',
        '#capacity': 'capacity',
        '#manufacturer': 'manufacturer',
        '#fuelType': 'fuelType',
      },
      ExpressionAttributeValues: {
        ':year': vehicleData.year,
        ':brand': vehicleData.brand,
        ':model': vehicleData.model,
        ':engine': vehicleData.engine,
        ':capacity': vehicleData.capacity,
        ':manufacturer': vehicleData.manufacturer,
        ':fuelType': vehicleData.fuelType,
      },
    };

    await dynamoDB.update(params).promise();
    return vehicleData;
  } catch (error) {
    throw error;
  }
};

// Delete a vehicle by vehicleId
const deleteVehicle = async (vehicleId) => {
  try {
    const params = {
      ...vehicleSchema,
      Key: {
        vehicleId,
      },
    };

    await dynamoDB.delete(params).promise();
  } catch (error) {
    throw error;
  }
};

module.exports = { createVehicle, readVehicle, updateVehicle, deleteVehicle };
