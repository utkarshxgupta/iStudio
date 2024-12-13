const asyncHandler = require('express-async-handler');
const Question = require('../models/questionModel');
const Test = require('../models/testModel');

// @desc    Add a question to a test
// @route   POST /api/tests/:testId/questions
// @access  Private (Admins/Test Creators)
const addQuestion = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.testId);

  if (test && test.createdBy.toString() === req.user._id.toString()) {
    const { type, text, options, correctAnswers, settings } = req.body;

    if (!type || !text) {
      res.status(400);
      throw new Error('Type and text are required');
    }

    const question = await Question.create({
      testId: test._id,
      type,
      text,
      options,
      correctAnswers,
      settings,
    });

    test.questions.push(question._id);
    await test.save();

    res.status(201).json(question);
  } else {
    res.status(404);
    throw new Error('Test not found or not authorized');
  }
});

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private (Admins/Test Creators)
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (question) {
    const test = await Test.findById(question.testId);

    if (test && test.createdBy.toString() === req.user._id.toString()) {
      const { type, text, options, correctAnswers, settings } = req.body;

      question.type = type || question.type;
      question.text = text || question.text;
      question.options = options || question.options;
      question.correctAnswers = correctAnswers || question.correctAnswers;
      question.settings = settings || question.settings;

      const updatedQuestion = await question.save();

      res.json(updatedQuestion);
    } else {
      res.status(404);
      throw new Error('Not authorized to update this question');
    }
  } else {
    res.status(404);
    throw new Error('Question not found');
  }
});

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private (Admins/Test Creators)
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (question) {
    const test = await Test.findById(question.testId);

    if (test && test.createdBy.toString() === req.user._id.toString()) {
      await question.remove();

      // Remove question from test's question list
      test.questions = test.questions.filter(
        (qId) => qId.toString() !== req.params.id
      );
      await test.save();

      res.json({ message: 'Question removed' });
    } else {
      res.status(404);
      throw new Error('Not authorized to delete this question');
    }
  } else {
    res.status(404);
    throw new Error('Question not found');
  }
});

module.exports = {
  addQuestion,
  updateQuestion,
  deleteQuestion,
};
