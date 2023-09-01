const carPartService = require('../services/carPartService');

const createCarPart = async (req, res) => {
  try {
    // Extract data from request
    const { carPartData, imageFiles } = req.body;

    // Call the carPartService.createCarPart method
    const newCarPart = await carPartService.createCarPart(carPartData, imageFiles);

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
    const carPart = await carPartService.getCarPart(carPartId);

    if (!carPart) {
      return res.status(404).json({ message: 'Car part not found.' });
    }

    res.json(carPart);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the car part.' });
  }
};

const updateCarPart = async (req, res) => {
  try {
    // Extract car part ID and updated data from request
    const { carPartId } = req.params;
    const { carPartData, imageFiles } = req.body;

    // Call the carPartService.updateCarPart method
    const updatedCarPart = await carPartService.updateCarPart(carPartId, carPartData);

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
    const deletedCarPart = await carPartService.deleteCarPart(carPartId);

    if (!deletedCarPart) {
      return res.status(404).json({ message: 'Car part not found.' });
    }

    res.json({ message: 'Car part deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the car part.' });
  }
};

module.exports = {
  createCarPart,
  getCarPart,
  updateCarPart,
  deleteCarPart,
};
