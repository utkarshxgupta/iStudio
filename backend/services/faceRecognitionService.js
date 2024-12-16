const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition({
  accessKeyId: 'YOUR_AWS_ACCESS_KEY',
  secretAccessKey: 'YOUR_AWS_SECRET_KEY',
  region: 'YOUR_AWS_REGION',
});

const compareFaces = async (sourceImageUrl, targetImageBase64) => {
  // Fetch source image from URL
  const sourceImageResponse = await fetch(sourceImageUrl);
  const sourceImageBuffer = await sourceImageResponse.buffer();

  // Convert target image base64 to buffer
  const targetImageBuffer = Buffer.from(
    targetImageBase64.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );

  const params = {
    SourceImage: {
      Bytes: sourceImageBuffer,
    },
    TargetImage: {
      Bytes: targetImageBuffer,
    },
    SimilarityThreshold: 90, // Adjust threshold as needed
  };

  const data = await rekognition.compareFaces(params).promise();

  return data.FaceMatches && data.FaceMatches.length > 0;
};

const detectFaces = async (imageBase64) => {
  // Convert image base64 to buffer
  const imageBuffer = Buffer.from(
    imageBase64.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );

  const params = {
    Image: {
      Bytes: imageBuffer,
    },
    Attributes: ['ALL'],
  };

  const data = await rekognition.detectFaces(params).promise();

  return { facesCount: data.FaceDetails.length };
};

module.exports = {
  compareFaces,
  detectFaces,
};
