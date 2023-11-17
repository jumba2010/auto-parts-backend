const express = require('express');
const carPartController = require('../controllers/carPartController');

const router = express.Router();

router.post('/', carPartController.createCarPart);

router.get('/:sucursalId', carPartController.findCarPartsBySucursalId);
// router.get('/:carPartId', carPartController.getCarPart);
router.put('/:carPartId/:createdAt', carPartController.updateCarPart);
router.delete('/:carPartId/:createdAt', carPartController.deleteCarPart);

module.exports = router;
