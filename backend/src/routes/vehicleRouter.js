const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(VehicleController.getAll));
router.get('/:id', catchErrorsAsync(VehicleController.getById));
router.post('/', catchErrorsAsync(VehicleController.create));
router.put('/:id', catchErrorsAsync(VehicleController.update));
router.delete('/:id', catchErrorsAsync(VehicleController.delete));

module.exports = router;