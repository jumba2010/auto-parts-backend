const s3Service = require('../services/aws/s3Service');
const multer = require('multer');
const upload = multer();

const uploadFiles = async (req, res) => {
  try {
    // Multer middleware processes the files from the 'files' field
    upload.array('files')(req, res, async (err) => {
      if (err) {
        console.error('Error handling file upload:', err);
        return res.status(500).send('Error handling file upload.');
      }

      const { files } = req;

      if (!Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ error: 'Invalid input: Please provide one or more files.' });
      }

      const uploadedFileUrls = await s3Service.uploadToS3(files);

      return res.status(200).json({ uploadedFiles: uploadedFileUrls });
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).send('Error handling file upload.');
  }
};

const getImagesFromS3 = async (req, res) => {

  try {
    // Extract data from request
    const {fileNames}  = req.body;

    // Call the carPartService.createCarPart method
    const imageURls = await s3Service.getImagesFromS3(fileNames);

    res.status(200).json(imageURls);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while getting imageURL' });
  }
}

module.exports = {
  uploadFiles,
  getImagesFromS3
};
