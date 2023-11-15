const express = require('express');
const auditController = require('../controllers/auditController');

const router = express.Router();

router.get('/:sucursalId', auditController.findBySucursalId);

module.exports = router;
