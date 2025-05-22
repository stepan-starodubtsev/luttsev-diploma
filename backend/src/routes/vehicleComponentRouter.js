const express = require('express');
const router = express.Router();
const VehicleComponentController = require('../controllers/vehicleComponentController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(VehicleComponentController.getAll));
router.get('/:id', catchErrorsAsync(VehicleComponentController.getById));
router.post('/', catchErrorsAsync(VehicleComponentController.create));
router.put('/:id', catchErrorsAsync(VehicleComponentController.update));
router.delete('/:id', catchErrorsAsync(VehicleComponentController.delete));

module.exports = router;