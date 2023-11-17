const constants = require('../utils/constants');
const crudService = require("../services/crudService");
const {getImagesFromS3} = require('../services/aws/s3Service')

const createCarPart = async (req, res) => {
  try {
    // Extract data from request
    const carPartData  = req.body;

    // Call the carPartService.createCarPart method
    const newCarPart = await crudService.create(constants.CAR_PART_TABLE,carPartData);
    
    const stockData = {
      availablequantity: carPartData.availablequantity,
      quantity: carPartData.availablequantity,
      sellprice:carPartData.sellprice,
      sucursalId: carPartData.sucursalId,
      createdBy: carPartData.createdBy,
      activatedBy:carPartData.activatedBy,
      soldQuantity:0,
      type: 'ENTRANCE',
      product: {
        id:newCarPart.id,
        name: carPartData.name,
        images:carPartData.filenames
      }
    }

    const stock = await crudService.create(constants.STOCK_TABLE,stockData);  

    res.status(201).json(newCarPart);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the car part.' });
  }
};

const findCarPartsBySucursalId = async (req, res) => {
  try {

    const { sucursalId} = req.params;

    const carParts = await crudService.findBySucursalId(constants.CAR_PART_TABLE,sucursalId);
    const newList = [];
    for (let index = 0; index < carParts.length; index++) {
      const carpart = carParts[index];
      let features = transformMapToList(carpart.features);
      let filenames = transformMapToList(carpart.filenames);
      let mappedFilenames = filenames.map(fn=>fn.url);
      carpart.features = features;
      carpart.filenames= await getImagesFromS3(mappedFilenames);
      newList.push(carpart);
    }

    res.status(200).json(newList );
  } catch (error) {
    res.status(404).json({ error: 'No Item found by the given Id' });
  }
};

const transformMapToList = (object) =>{
  const arrayObject = [];
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      arrayObject.push(object[key]);
    }
  }
  return arrayObject;
}

const updateCarPart = async (req, res) => {
  try {
    // Extract car part ID and updated data from request
    const { carPartId,createdAt } = req.params;
    const carPartData  = req.body;

    // Call the carPartService.updateCarPart method
    const updatedCarPart =  await crudService.update(constants.CAR_PART_TABLE,carPartId,createdAt, carPartData);
    
    if (!updatedCarPart) {
      return res.status(404).json({ message: 'Car part not found.' });
    }

    res.status(200).json(updatedCarPart);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the car part.' });
  }
};

const deleteCarPart = async (req, res) => {
  try {
    // Extract car part ID from request
    const { carPartId,createdAt } = req.params;

    console.log(carPartId,createdAt)
    // Call the carPartService.deleteCarPart method
     await crudService.deleteRow(constants.CAR_PART_TABLE,carPartId,createdAt);
    res.status(200).json({ message: 'Car part deleted successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'An error occurred while deleting the car part.',error });
  }
};

module.exports = {
  createCarPart,deleteCarPart, updateCarPart,findCarPartsBySucursalId
};
