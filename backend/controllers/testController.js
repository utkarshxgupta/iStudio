const asyncHandler = require('express-async-handler');
const Test = require('../models/testModel');
const Question = require('../models/questionModel');

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private (Admins/Test Creators)
const createTest = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    instructions,
    timeLimit,
    proctoringSettings,
  } = req.body;
  // Check if required fields are provided
  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  // Create the test
  const test = await Test.create({
    title,
    description,
    instructions,
    timeLimit,
    createdBy: req.user._id,
    questions: [],
    proctoringSettings, // Save proctoring settings
  });

  res.status(201).json(test);
});

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private (Admins/Test Creators)
const getTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({ createdBy: req.user._id });
  res.json(tests);
});

// @desc    Get a test by ID
// @route   GET /api/tests/:id
// @access  Private
const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id).populate('questions');

  if (test) {
    res.json(test);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

// @desc    Update a test
// @route   PUT /api/tests/:id
// @access  Private (Admins/Test Creators)
const updateTest = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    instructions,
    timeLimit,
    proctoringSettings,
  } = req.body;

  const test = await Test.findById(req.params.id);

  if (test && test.createdBy.toString() === req.user._id.toString()) {
    test.title = title || test.title;
    test.description = description || test.description;
    test.instructions = instructions || test.instructions;
    test.timeLimit = timeLimit || test.timeLimit;
    test.proctoringSettings = proctoringSettings || test.proctoringSettings;

    const updatedTest = await test.save();
    res.json(updatedTest);
  } else {
    res.status(404);
    throw new Error('Test not found or not authorized');
  }
});

// @desc    Delete a test
// @route   DELETE /api/tests/:id
// @access  Private (Admins/Test Creators)
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test && test.createdBy.toString() === req.user._id.toString()) {
    await test.remove();
    res.json({ message: 'Test removed' });
  } else {
    res.status(404);
    throw new Error('Test not found or not authorized');
  }
});

module.exports = {
  createTest,
  getTests,
  getTestById,
  updateTest,
  deleteTest,
};
