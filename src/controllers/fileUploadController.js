const s3Service = require('../services/aws/s3Service');

const uploadFiles = async (req, res) => {
  try {
    // Extract data from request
    const { files } = req.body;

    if (!Array.isArray(files)) {
      res.status(400).send('Invalid input: Please provide an array of files.');
      return;
    }

    const uploadedFileUrls = await s3Service.uploadToS3(files);

    res.status(200).json({ uploadedFiles: uploadedFileUrls });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).send('Error handling file upload.');
  }
};


module.exports = {
  uploadFiles
};
