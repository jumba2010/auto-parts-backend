const constants = require('../utils/constants');
const crudService = require("../services/crudService");

const createCarPart = async (req, res) => {
  try {
    // Extract data from request
    const carPartData  = req.body;

    // Call the carPartService.createCarPart method
    const newCarPart = await crudService.create(constants.CAR_PART_TABLE,carPartData);

    res.status(201).json(newCarPart);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the car part.' });
  }
};

const getCarPart = async (req, res) => {
  try {
    // Extract car part ID from request
    const { carPartId } = req.params;

    // Call the carPartService.getCarPart method
    const carPart = await crudService.readById(constants.CAR_PART_TABLE,carPartId);

    if (!carPart) {
      return res.status(404).json({ message: 'Car part not found.' });
    }

    res.json(carPart);
  } catch (error) {
    res.status(404).json({ error: 'No Item found by the given Id' });
  }
};

const updateCarPart = async (req, res) => {
  try {
    // Extract car part ID and updated data from request
    const { carPartId } = req.params;
    const carPartData  = req.body;

    // Call the carPartService.updateCarPart method
    const updatedCarPart =  await crudService.update(constants.CAR_PART_TABLE,carPartId, carPartData);

    //TODO: Add logic to add images to S3

    if (!updatedCarPart) {
      return res.status(404).json({ message: 'Car part not found.' });
    }

    res.json(updatedCarPart);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the car part.' });
  }
};

const deleteCarPart = async (req, res) => {
  try {
    // Extract car part ID from request
    const { carPartId } = req.params;

    // Call the carPartService.deleteCarPart method
     await crudService.delete(constants.CAR_PART_TABLE,carPartId);

    res.json({ message: 'Car part deleted successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'An error occurred while deleting the car part.',error });
  }
};

module.exports = {
  createCarPart,deleteCarPart, updateCarPart,getCarPart
};
