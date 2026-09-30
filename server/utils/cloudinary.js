require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

let uploadMiddleware;

if (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)) {
  // Use Cloudinary if credentials exist
  if (!process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'aunqa_uploads',
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
    }
  });

  uploadMiddleware = multer({ storage });
  console.log('Using Cloudinary for file uploads');
} else {
  // Fallback to local storage
  const path = require('path');
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  uploadMiddleware = multer({ storage });
  console.log('Using local disk storage for file uploads (Cloudinary not configured)');
}

module.exports = { upload: uploadMiddleware, cloudinary };
