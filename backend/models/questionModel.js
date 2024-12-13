const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    type: {
      type: String,
      enum: ['singleChoice', 'multipleChoice', 'essay', 'code', 'video'],
      required: true,
    },
    text: { type: String, required: true },
    options: [String], // For multiple-choice questions
    correctAnswers: [String], // Correct options
    settings: Object, // Additional settings like word limit
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
