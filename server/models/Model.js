import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  originalFile: {
    filename: String,
    path: String,
    mimetype: String,
    size: Number
  },
  glbFile: {
    filename: String,
    path: String,
    url: String
  },
  usdzFile: {
    filename: String,
    path: String,
    url: String
  },
  thumbnail: {
    filename: String,
    path: String,
    url: String
  },
  fileType: {
    type: String,
    enum: ['glb', 'gltf', 'usdz'],
    required: true
  },
  dimensions: {
    width: Number,
    height: Number,
    depth: Number
  },
  polygonCount: {
    type: Number,
    default: 0
  },
  fileSize: {
    type: Number,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

modelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Model', modelSchema);