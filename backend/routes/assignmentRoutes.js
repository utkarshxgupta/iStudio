const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getMyAssignments,
} = require('../controllers/assignmentController');
const { protect, adminOrCreator } = require('../middleware/authMiddleware');

// Route to assign tests to candidates
router.route('/').post(protect, adminOrCreator, createAssignment);

// Route for candidates to get their assignments
router.route('/my').get(protect, getMyAssignments);

module.exports = router;
