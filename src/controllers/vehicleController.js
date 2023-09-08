const vehicleService = require('../services/vehicleService');

// Create a new vehicle
const createVehicle = async (req, res) => {
  try {

    const { vehicleData } = req.body;

    const newVehicle = await vehicleService.createVehicle(vehicleData);

    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the vehicle.' });
  }
};

// Get a vehicle by vehicleId
const getVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await vehicleService.readVehicle(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the vehicle.' });
  }
};

// Update a vehicle by vehicleId
const updateVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { vehicleData } = req.body;

    const updatedVehicle = await vehicleService.updateVehicle(vehicleId, vehicleData);

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ error: 'An error when updating vehicle'});
  }
}

// Delete a vehicle by vehicleId
const deleteVehicle = async (req, res) => {
  try {

    const { vehicleId } = req.params;

    await vehicleService.deleteVehicle(vehicleId);

    res.json({ message: 'Vehicle deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the vehicle.' });
  }
};

module.exports = {
  createVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
