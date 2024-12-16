const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: 'YOUR_S3_ACCESS_KEY',
  secretAccessKey: 'YOUR_S3_SECRET_KEY',
  region: 'YOUR_S3_REGION',
});

const uploadImageAndGetUrl = async (imageBase64) => {
  const imageBuffer = Buffer.from(
    imageBase64.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );

  const params = {
    Bucket: 'YOUR_S3_BUCKET_NAME',
    Key: `snapshots/${Date.now()}.jpg`,
    Body: imageBuffer,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
  };

  const data = await s3.upload(params).promise();

  return data.Location; // URL of the uploaded image
};

module.exports = {
  uploadImageAndGetUrl,
};
