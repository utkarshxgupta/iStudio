const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['multipleFaces', 'noFace', 'appSwitch'],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    snapshotUrl: { type: String }, // URL to stored snapshot image
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

const Anomaly = mongoose.model('Anomaly', anomalySchema);

module.exports = Anomaly;
