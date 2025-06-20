import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import modelRoutes from './routes/models.js';
import uploadRoutes from './routes/upload.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/models', modelRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In production, serve static files from the Vite build output directory
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(process.cwd(), 'dist');
  
  // Serve static files from dist
  app.use(express.static(clientPath));
  
  // Handle client-side routing - return index.html for all other requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error loading the application');
      }
    });
  });
}

// Export the Express API
export default app;

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'favicon.ico'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webarstudio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/models', modelRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Web AR Studio API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});