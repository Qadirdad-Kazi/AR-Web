import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Model from '../models/Model.js';
import { generateThumbnail } from '../utils/thumbnailGenerator.js';
import { convertToUSDZ } from '../utils/fileConverter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.glb', '.gltf', '.usdz'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only .glb, .gltf, and .usdz files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Upload endpoint
router.post('/', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { name, description, tags } = req.body;
    const file = req.file;
    const fileType = path.extname(file.originalname).toLowerCase().substring(1);

    // Create model record
    const modelData = {
      name: name || path.parse(file.originalname).name,
      description: description || '',
      originalFile: {
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
      },
      fileType,
      fileSize: file.size,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    };

    // Set up file URLs
    const baseURL = `${req.protocol}://${req.get('host')}/uploads`;
    
    if (fileType === 'glb') {
      modelData.glbFile = {
        filename: file.filename,
        path: file.path,
        url: `${baseURL}/${file.filename}`
      };
    } else if (fileType === 'gltf') {
      // For GLTF, we might need to handle associated files
      modelData.glbFile = {
        filename: file.filename,
        path: file.path,
        url: `${baseURL}/${file.filename}`
      };
    } else if (fileType === 'usdz') {
      modelData.usdzFile = {
        filename: file.filename,
        path: file.path,
        url: `${baseURL}/${file.filename}`
      };
    }

    const model = new Model(modelData);
    
    // Generate thumbnail
    try {
      const thumbnailPath = await generateThumbnail(file.path, model._id);
      if (thumbnailPath) {
        const thumbnailFilename = path.basename(thumbnailPath);
        model.thumbnail = {
          filename: thumbnailFilename,
          path: thumbnailPath,
          url: `${baseURL}/${thumbnailFilename}`
        };
      }
    } catch (thumbnailError) {
      console.error('Error generating thumbnail:', thumbnailError);
    }

    // Convert to USDZ if needed
    if (fileType === 'glb' || fileType === 'gltf') {
      try {
        const usdzPath = await convertToUSDZ(file.path, model._id);
        if (usdzPath) {
          const usdzFilename = path.basename(usdzPath);
          model.usdzFile = {
            filename: usdzFilename,
            path: usdzPath,
            url: `${baseURL}/${usdzFilename}`
          };
        }
      } catch (conversionError) {
        console.error('Error converting to USDZ:', conversionError);
      }
    }

    await model.save();

    res.json({
      message: 'Model uploaded successfully',
      model
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if model creation failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      error: error.message || 'Failed to upload model'
    });
  }
});

export default router;