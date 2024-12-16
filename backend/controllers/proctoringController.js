const asyncHandler = require('express-async-handler');
const Anomaly = require('../models/anomalyModel');
const Assignment = require('../models/assignmentModel');
const FaceRecognitionService = require('../services/faceRecognitionService');
const { uploadImageAndGetUrl } = require('../utils/imageUpload'); // Utility function to upload images

// @desc    Process proctoring data
// @route   POST /api/proctoring/:assignmentId
// @access  Private (Candidate)
const processProctoringData = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { imageData, eventType } = req.body; // imageData is base64 encoded image

  const assignment = await Assignment.findById(assignmentId).populate('testId');

  if (assignment && assignment.candidateId.toString() === req.user._id.toString()) {
    const proctoringSettings = assignment.testId.proctoringSettings;
    let anomalies = [];

    // Face Detection
    if (proctoringSettings.faceDetection && imageData) {
      const faceDetectionResult = await FaceRecognitionService.detectFaces(
        imageData
      );

      if (faceDetectionResult.facesCount === 0) {
        // No face detected
        anomalies.push('noFace');
      } else if (
        faceDetectionResult.facesCount > 1 &&
        proctoringSettings.multipleFacesDetection
      ) {
        // Multiple faces detected
        anomalies.push('multipleFaces');
      }
    }

    // App Switch Detection
    if (proctoringSettings.appSwitchDetection && eventType === 'appSwitch') {
      anomalies.push('appSwitch');
    }

    // Log anomalies
    for (const anomalyType of anomalies) {
      // Upload snapshot and get URL
      const snapshotUrl = imageData ? await uploadImageAndGetUrl(imageData) : null;

      await Anomaly.create({
        assignmentId,
        candidateId: req.user._id,
        type: anomalyType,
        snapshotUrl,
      });

      // Update warnings count
      assignment.warningsCount = (assignment.warningsCount || 0) + 1;

      // Check if warnings exceed limit
      if (
        proctoringSettings.autoLogout &&
        assignment.warningsCount >= proctoringSettings.warningsLimit
      ) {
        assignment.status = 'terminated';
        await assignment.save();
        res.status(200).json({
          terminated: true,
          message: 'Test terminated due to policy violations',
        });
        return;
      }

      await assignment.save();
    }

    res.status(200).json({ message: 'Proctoring data processed' });
  } else {
    res.status(404);
    throw new Error('Assignment not found or not authorized');
  }
});

module.exports = {
  processProctoringData,
};
