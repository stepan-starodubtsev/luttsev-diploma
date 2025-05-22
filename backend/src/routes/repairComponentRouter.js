const express = require('express');
const router = express.Router();
const RepairComponentController = require('../controllers/repairComponentController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(RepairComponentController.getAll));
router.get('/:id', catchErrorsAsync(RepairComponentController.getById));
router.post('/', catchErrorsAsync(RepairComponentController.create));
router.put('/:id', catchErrorsAsync(RepairComponentController.update));
router.delete('/:id', catchErrorsAsync(RepairComponentController.delete));

module.exports = router;