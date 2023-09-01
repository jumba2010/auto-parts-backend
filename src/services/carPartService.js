const { carPartSchema, dynamoDB } = require('../models/CarPart');

const createCarPart = async (carPartData) => {
    try {
      //TODO: Validate to be added
      
      // Use the DynamoDB schema for creating the item
      const params = {
        ...carPartSchema,
        Item: carPartData,
      };
  
      await dynamoDB.put(params).promise();
      return carPartData;
    } catch (error) {

      throw error;
    }
  };

  const readCarPart = async (carPartId) => {
    try {
      const params = {
        ...carPartSchema,
        Key: {
          carPartId,
        },
      };
  
      const result = await dynamoDB.get(params).promise();
      if (!result.Item) {
        throw new Error('CarPart not found');
      }
      return result.Item;
    } catch (error) {
      throw error;
    }
  };

const updateCarPart = async (carPartId, carPartData) => {
    try {
      // Validate the incoming request body
      validatePayload(carPartData, carPartPayloadSchema);
  
      const params = {
        ...carPartSchema,
        Key: {
          carPartId,
        },
        UpdateExpression: 'SET #name = :name, #vehicleId = :vehicleId, #brand = :brand, #country = :country, #material = :material, #color = :color, #description = :description, #dimension = :dimension, #features = :features, #specifications = :specifications, #images = :images',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#vehicleId': 'vehicleId',
          '#brand': 'brand',
          '#country': 'country',
          '#material': 'material',
          '#color': 'color',
          '#description': 'description',
          '#dimension': 'dimension',
          '#features': 'features',
          '#specifications': 'specifications',
          '#images': 'images',
        },
        ExpressionAttributeValues: {
          ':name': carPartData.name,
          ':vehicleId': carPartData.vehicleId,
          ':brand': carPartData.brand,
          ':country': carPartData.country,
          ':material': carPartData.material,
          ':color': carPartData.color,
          ':description': carPartData.description,
          ':dimension': carPartData.dimension,
          ':features': carPartData.features,
          ':specifications': carPartData.specifications,
          ':images': carPartData.images,
        },
      };
  
      await dynamoDB.update(params).promise();
      return carPartData;
    } catch (error) {
      throw error;
    }
  };
  
  const deleteCarPart = async (carPartId) => {
    try {
      const params = {
        ...carPartSchema,
        Key: {
          carPartId,
        },
      };
  
      await dynamoDB.delete(params).promise();
    } catch (error) {
      throw error;
    }
  };
  
  module.exports = { createCarPart, readCarPart, updateCarPart, deleteCarPart };

