const AWS = require('../../../config/awsConfig');
var fs = require('fs');
// Initialize AWS services

var s3 = new AWS.S3({apiVersion: process.env.AWS_S3_VERSION});


// Function to initiate multipart upload
const initiateMultipartUpload = async (file) => {
  const currentDate = moment().format('YYYY-MM-DD_HH-mm-ss');
  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${currentDate}.${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueFileName,
    ContentType: file.type,
  };

  try {
    const data = await s3.createMultipartUpload(params).promise();
    return { uploadId: data.UploadId, key: params.Key };
  } catch (error) {
    throw error;
  }
};

// Function to upload a part
const uploadPart = async (file, partNumber, uploadId) => {
  const params = {
    Bucket:  process.env.AWS_S3_BUCKET_NAME,
    Key: file.key,
    PartNumber: partNumber,
    UploadId: uploadId,
    Body: fs.createReadStream(file.path),
  };

  try {
    const data = await s3.uploadPart(params).promise();
    return { PartNumber: partNumber, ETag: data.ETag };
  } catch (error) {
    throw error;
  }
};

// Retry upload with a specified retry count and delay
const retryUpload = async (uploadFunction, args, retryCount, retryDelay) => {
  let attempts = 0;

  while (attempts < retryCount) {
    try {
      const result = await uploadFunction(...args);
      return result; // Upload succeeded, exit the retry loop
    } catch (error) {
      console.error('Upload failed, retrying...', error);
      attempts++;

      // Delay before the next retry (in milliseconds)
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error('Max retry attempts reached, upload failed.');
};

// Function to complete multipart upload
const completeMultipartUpload = async (file, uploadId, parts) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: file.key,
    MultipartUpload: { Parts: parts },
    UploadId: uploadId,
  };

  try {
    await s3.completeMultipartUpload(params).promise();
    return key;
  } catch (error) {
    throw error;
  }
};

const uploadToS3 = async (files) => {
  // Upload Multiple files to S3 in paralel
  const uploadedFileUrls = [];
  await Promise.all(
    files.map(async (file) => {
      try {
        const { uploadId, key } = await initiateMultipartUpload(file);

        const partPromises = [];
        const fileStream = fs.createReadStream(file.path);
        let partNumber = 1;
        let retryCount=process.env.RETRY_COUNT;
        let retryDelay=process.env.RETRY_DELAY;
        fileStream.on('data', async (data) => {
        // Upload parts concurrently with synchronized partNumber
        const part = await retryUpload(uploadPart, [{ key, path: data }, uploadId, partNumber], retryCount, retryDelay);
        parts.push(part);
        partNumber++;
        });

        fileStream.on('end', async () => {
          const parts = await Promise.all(partPromises);
          const uploadedUrl = await completeMultipartUpload({ key }, uploadId, parts);
          uploadedFileUrls.push(uploadedUrl);
        });
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    })
  );

  return uploadedFileUrls;

};

const getImagesFromS3 = async (imageUrls) => {
  // Logic to fetch images from S3 using image URLs
};

module.exports = {
  uploadToS3,
  getImagesFromS3,
  // other AWS-related methods
};
