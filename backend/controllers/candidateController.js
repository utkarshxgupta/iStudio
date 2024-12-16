const asyncHandler = require('express-async-handler');
const Assignment = require('../models/assignmentModel');
const Question = require('../models/questionModel');
const Response = require('../models/responseModel');
const FaceRecognitionService = require('../services/faceRecognitionService');

// @desc    Start a test
// @route   POST /api/candidate/start-test/:assignmentId
// @access  Private (Candidate)
const startTest = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId).populate('testId');

  if (assignment && assignment.candidateId.toString() === req.user._id.toString()) {
    const proctoringSettings = assignment.testId.proctoringSettings;

    // Check if identity verification is enabled
    if (proctoringSettings.identityVerification) {
      // Expecting base64 encoded image from front-end
      const { livePhoto } = req.body;

      if (!livePhoto) {
        res.status(400);
        throw new Error('Live photo is required for identity verification');
      }

      // Retrieve stored photo URL of the candidate
      const candidatePhotoUrl = req.user.photoUrl;

      if (!candidatePhotoUrl) {
        res.status(400);
        throw new Error('Candidate photo not found');
      }

      // Use face recognition service to compare photos
      const isMatch = await FaceRecognitionService.compareFaces(
        candidatePhotoUrl,
        livePhoto
      );

      if (!isMatch) {
        res.status(403);
        throw new Error('Identity verification failed');
      }
    }

    assignment.status = 'inProgress';
    assignment.startTime = new Date();
    await assignment.save();

    res.json({ message: 'Test started', assignmentId: assignment._id });
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
