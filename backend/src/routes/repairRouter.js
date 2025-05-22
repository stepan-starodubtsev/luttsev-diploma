const express = require('express');
const router = express.Router();
const RepairController = require('../controllers/repairController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');


router.get('/', catchErrorsAsync(RepairController.getAll));
router.get('/:id', catchErrorsAsync(RepairController.getById));
router.post('/', catchErrorsAsync(RepairController.create));
router.put('/:id', catchErrorsAsync(RepairController.update));
router.delete('/:id', catchErrorsAsync(RepairController.delete));

module.exports = router;