const express = require('express');
const router = express.Router();
const {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
} = require('../controllers/testController');
const { addQuestion } = require('../controllers/questionController');
const { protect, adminOrCreator } = require('../middleware/authMiddleware');

// Middleware to check if user is admin or test creator
// You can implement adminOrCreator to check user roles

// Test routes
router
  .route('/')
  .post(protect, adminOrCreator, createTest)
  .get(protect, adminOrCreator, getTests);

router
  .route('/:id')
  .get(protect, getTestById)
  .put(protect, adminOrCreator, updateTest)
  .delete(protect, adminOrCreator, deleteTest);

// Question routes (nested under tests)
router
  .route('/:testId/questions')
  .post(protect, adminOrCreator, addQuestion);

module.exports = router;
