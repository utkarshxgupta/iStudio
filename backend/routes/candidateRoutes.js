const express = require('express');
const router = express.Router();
const {
  startTest,
  submitAnswer,
  completeTest,
} = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

// Candidate starts a test
router.route('/start-test/:assignmentId').post(protect, startTest);

// Candidate submits an answer
router.route('/submit-answer').post(protect, submitAnswer);

// Candidate completes a test
router.route('/complete-test/:assignmentId').post(protect, completeTest);

module.exports = router;
