const express = require('express');
const router = express.Router();
const {
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');
const { protect, adminOrCreator } = require('../middleware/authMiddleware');

// Routes for individual question operations
router
  .route('/:id')
  .put(protect, adminOrCreator, updateQuestion)
  .delete(protect, adminOrCreator, deleteQuestion);

module.exports = router;
