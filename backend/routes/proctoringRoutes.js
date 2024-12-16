const express = require('express');
const router = express.Router();
const { processProctoringData } = require('../controllers/proctoringController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:assignmentId').post(protect, processProctoringData);

module.exports = router;
