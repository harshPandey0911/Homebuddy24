const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Check if Cloudinary is properly configured (simple check for placeholders)
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'h' && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== '638952';

// 1. Cloudinary Storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Homebuddy24',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0];
      return `${name}-${Date.now()}`;
    }
  }
});

// 2. Local Disk Storage (Fallback)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Use Cloudinary if configured, otherwise fallback to local disk
const activeStorage = isCloudinaryConfigured ? cloudinaryStorage : diskStorage;

// File filter - only images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter - images and documents
const documentFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF/DOC files are allowed!'), false);
  }
};

// Generic Image Upload (Cloudinary or Local) - Expecting 'file' field
const uploadImage = multer({
  storage: activeStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('file');

// Profile photo upload (legacy/specific) - Expecting 'photo' field
const uploadProfilePhoto = multer({
  storage: activeStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single('photo');

// Document upload (multiple files)
const uploadDocuments = multer({
  storage: activeStorage, // Fallback to activeStorage for docs too
  fileFilter: documentFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).fields([
  { name: 'aadhar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'otherDocuments', maxCount: 5 }
]);

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = {
  uploadImage,
  uploadProfilePhoto,
  uploadDocuments,
  handleMulterError
};
