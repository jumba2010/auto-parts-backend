const express = require('express');
const carPartController = require('../controllers/carPartController');

const router = express.Router();

router.post('/', carPartController.createCarPart);
router.get('/:carPartId', carPartController.getCarPart);
router.put('/:carPartId', carPartController.updateCarPart);
router.delete('/:carPartId', carPartController.deleteCarPart);

module.exports = router;
