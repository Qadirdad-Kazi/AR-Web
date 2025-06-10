import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Model from '../models/Model.js';
import path from 'path';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ar-models',
    resource_type: 'auto',
    public_id: (req, file) => {
      const originalName = path.parse(file.originalname).name;
      return `${originalName.replace(/\s+/g, '_')}-${Date.now()}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.glb', '.gltf', '.usdz'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only .glb, .gltf, and .usdz are supported.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload endpoint
router.post('/', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file type is invalid.' });
    }

    const { name, description, tags } = req.body;
    const uploadedFile = req.file;

    // Construct URLs for derivatives using Cloudinary transformations
    const glbUrl = uploadedFile.path;
    const usdzUrl = cloudinary.url(uploadedFile.filename, { resource_type: 'raw', fetch_format: 'usdz' });
    const thumbnailUrl = cloudinary.url(uploadedFile.filename, { 
      resource_type: 'image', 
      fetch_format: 'png',
      width: 400, 
      height: 300, 
      crop: 'fit' 
    });

    const model = new Model({
      name: name || path.parse(uploadedFile.originalname).name,
      description: description || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      fileSize: uploadedFile.size,
      fileType: path.extname(uploadedFile.originalname).substring(1),
      
      // Cloudinary asset info
      cloudinary: {
        public_id: uploadedFile.filename,
        secure_url: uploadedFile.path,
        resource_type: uploadedFile.resource_type,
        format: uploadedFile.format,
        bytes: uploadedFile.size,
      },

      // URLs for the frontend
      glbFile: {
        public_id: uploadedFile.filename,
        secure_url: glbUrl,
      },
      usdzFile: {
        public_id: uploadedFile.filename, // Same public_id
        secure_url: usdzUrl,
      },
      thumbnail: {
        public_id: uploadedFile.filename, // Same public_id
        secure_url: thumbnailUrl,
      },
    });

    await model.save();

    res.status(201).json({ 
      message: 'Model uploaded and processed successfully!',
      model 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload model.', details: error.message });
  }
});

export default router;