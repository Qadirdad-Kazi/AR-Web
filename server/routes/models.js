import express from 'express';
import Model from '../models/Model.js';

const router = express.Router();

// Get all models
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '', tags = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    query.isPublic = true;

    const models = await Model.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Model.countDocuments(query);

    res.json({
      models,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// Get single model
router.get('/:id', async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // Increment view count
    model.viewCount += 1;
    await model.save();

    res.json(model);
  } catch (error) {
    console.error('Error fetching model:', error);
    res.status(500).json({ error: 'Failed to fetch model' });
  }
});

// Update model
router.put('/:id', async (req, res) => {
  try {
    const { name, description, tags, isPublic } = req.body;
    
    const model = await Model.findByIdAndUpdate(
      req.params.id,
      { name, description, tags, isPublic },
      { new: true, runValidators: true }
    );

    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.json(model);
  } catch (error) {
    console.error('Error updating model:', error);
    res.status(500).json({ error: 'Failed to update model' });
  }
});

// Delete model
router.delete('/:id', async (req, res) => {
  try {
    const model = await Model.findByIdAndDelete(req.params.id);
    
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // TODO: Delete associated files from filesystem
    
    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error('Error deleting model:', error);
    res.status(500).json({ error: 'Failed to delete model' });
  }
});

// Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    model.downloadCount += 1;
    await model.save();

    res.json({ message: 'Download count updated' });
  } catch (error) {
    console.error('Error updating download count:', error);
    res.status(500).json({ error: 'Failed to update download count' });
  }
});

export default router;