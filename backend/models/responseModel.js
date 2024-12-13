const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    response: mongoose.Schema.Types.Mixed, // Can store different data types
    submittedAt: { type: Date },
    isFinal: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
