const asyncHandler = require('express-async-handler');
const Assignment = require('../models/assignmentModel');
const Question = require('../models/questionModel');
const Response = require('../models/responseModel');

// @desc    Start a test
// @route   POST /api/candidate/start-test/:assignmentId
// @access  Private (Candidate)
const startTest = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId);

  if (assignment && assignment.candidateId.toString() === req.user._id.toString()) {
    assignment.status = 'inProgress';
    assignment.startTime = new Date();
    await assignment.save();

    res.json({ message: 'Test started' });
  } else {
    res.status(404);
    throw new Error('Assignment not found or not authorized');
  }
});

// @desc    Submit an answer
// @route   POST /api/candidate/submit-answer
// @access  Private (Candidate)
const submitAnswer = asyncHandler(async (req, res) => {
  const { assignmentId, questionId, response } = req.body;

  const assignment = await Assignment.findById(assignmentId);
  const question = await Question.findById(questionId);

  if (
    assignment &&
    question &&
    assignment.candidateId.toString() === req.user._id.toString()
  ) {
    // Create or update the response
    const existingResponse = await Response.findOne({
      assignmentId,
      questionId,
      candidateId: req.user._id,
    });

    if (existingResponse) {
      existingResponse.response = response;
      existingResponse.submittedAt = new Date();
      await existingResponse.save();
    } else {
      await Response.create({
        assignmentId,
        questionId,
        candidateId: req.user._id,
        response,
        submittedAt: new Date(),
      });
    }

    res.json({ message: 'Answer submitted' });
  } else {
    res.status(404);
    throw new Error('Assignment or question not found, or not authorized');
  }
});

// @desc    Complete the test
// @route   POST /api/candidate/complete-test/:assignmentId
// @access  Private (Candidate)
const completeTest = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId);

  if (assignment && assignment.candidateId.toString() === req.user._id.toString()) {
    assignment.status = 'completed';
    assignment.endTime = new Date();
    await assignment.save();

    res.json({ message: 'Test completed' });
  } else {
    res.status(404);
    throw new Error('Assignment not found or not authorized');
  }
});

module.exports = {
  startTest,
  submitAnswer,
  completeTest,
};
