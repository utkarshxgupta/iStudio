const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    instructions: { type: String },
    timeLimit: { type: Number }, // in minutes
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    proctoringSettings: {
      identityVerification: { type: Boolean, default: true },
      multipleFacesDetection: { type: Boolean, default: true },
      faceDetection: { type: Boolean, default: true },
      appSwitchDetection: { type: Boolean, default: true },
      warningsLimit: { type: Number, default: 3 },
      autoLogout: { type: Boolean, default: true },
    }, // New field for proctoring settings
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
