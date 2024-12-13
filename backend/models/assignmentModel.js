const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['assigned', 'inProgress', 'completed'],
      default: 'assigned',
    },
    startTime: { type: Date },
    endTime: { type: Date },
    responses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Response',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
