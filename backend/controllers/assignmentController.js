const asyncHandler = require('express-async-handler');
const Assignment = require('../models/assignmentModel');
const Test = require('../models/testModel');
const User = require('../models/userModel');

// @desc    Assign test to a candidate
// @route   POST /api/assignments
// @access  Private (Admins/Test Creators)
const createAssignment = asyncHandler(async (req, res) => {
  const { testId, candidateId } = req.body;

  // Verify test and candidate exist
  const test = await Test.findById(testId);
  const candidate = await User.findById(candidateId);

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  if (!candidate || candidate.role !== 'candidate') {
    res.status(404);
    throw new Error('Candidate not found');
  }

  // Check if the user is authorized to assign this test
  if (test.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to assign this test');
  }

  // Create the assignment
  const assignment = await Assignment.create({
    testId,
    candidateId,
    status: 'assigned',
  });

  res.status(201).json(assignment);
});

// @desc    Get assignments for a candidate
// @route   GET /api/assignments/my
// @access  Private (Candidate)
const getMyAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ candidateId: req.user._id }).populate('testId');
  res.json(assignments);
});

module.exports = {
  createAssignment,
  getMyAssignments,
};
