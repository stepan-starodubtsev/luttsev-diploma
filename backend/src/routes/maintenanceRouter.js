const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');


router.get('/', catchErrorsAsync(MaintenanceController.getAll));
router.get('/:id', catchErrorsAsync(MaintenanceController.getById));
router.post('/', catchErrorsAsync(MaintenanceController.create));
router.put('/:id', catchErrorsAsync(MaintenanceController.update));
router.delete('/:id', catchErrorsAsync(MaintenanceController.delete));

module.exports = router;