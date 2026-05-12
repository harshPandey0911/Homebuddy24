const express = require('express');
const router = express.Router();
const { uploadImage } = require('../../middleware/uploadMiddleware');
const { getSignature } = require('../../controllers/cloudinaryController');

// Get signature for direct signed upload
router.get('/upload/sign-signature', getSignature);

// Upload single file to Cloudinary
router.post('/upload', uploadImage, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Handle both Cloudinary and Local Storage
    let imageUrl = req.file.path;
    
    // If it's local storage (multer-disk-storage), req.file.path is a relative filesystem path
    // We want to return a public URL path
    if (req.file.filename && !req.file.path.startsWith('http')) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    res.status(200).json({
      success: true,
      imageUrl,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
});

module.exports = router;
