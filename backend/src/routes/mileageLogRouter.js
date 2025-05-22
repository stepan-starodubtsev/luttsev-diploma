const express = require('express');
const router = express.Router();
const MileageLogController = require('../controllers/mileageLogController');
const catchErrorsAsync = require('../middleware/catchErrorAsync');

router.get('/', catchErrorsAsync(MileageLogController.getAll));
router.get('/:id', catchErrorsAsync(MileageLogController.getById));
router.post('/', catchErrorsAsync(MileageLogController.create));
// router.put('/:id', catchErrorsAsync(MileageLogController.update));
router.delete('/:id', catchErrorsAsync(MileageLogController.delete));

module.exports = router;