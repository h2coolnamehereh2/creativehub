const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/photos - Get all photos (public)
router.get('/', (req, res) => {
  try {
    const photos = db.prepare('SELECT id, url, alt_text FROM photos ORDER BY sort_order ASC, created_at DESC').all();
    res.json(photos);
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/photos/url - Add photo by URL (admin only)
router.post('/url', authenticateToken, (req, res) => {
  try {
    const { url, alt_text } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = db.prepare('INSERT INTO photos (url, alt_text) VALUES (?, ?)').run(url, alt_text || null);

    res.json({
      message: 'Photo added successfully',
      photo: {
        id: result.lastInsertRowid,
        url,
        alt_text
      }
    });
  } catch (error) {
    console.error('Add photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/photos/upload - Upload photo file (admin only)
router.post('/upload', authenticateToken, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const url = `/uploads/${req.file.filename}`;
    const alt_text = req.body.alt_text || null;

    const result = db.prepare('INSERT INTO photos (url, filename, alt_text) VALUES (?, ?, ?)').run(url, req.file.filename, alt_text);

    res.json({
      message: 'Photo uploaded successfully',
      photo: {
        id: result.lastInsertRowid,
        url,
        filename: req.file.filename,
        alt_text
      }
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/photos/:id/order - Update photo sort order (admin only)
router.put('/:id/order', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { sort_order } = req.body;

    db.prepare('UPDATE photos SET sort_order = ? WHERE id = ?').run(sort_order, id);

    res.json({ message: 'Sort order updated' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/photos/:id - Delete photo (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Get photo info first
    const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete from database
    db.prepare('DELETE FROM photos WHERE id = ?').run(id);

    // Delete file if it's a local upload
    if (photo.filename) {
      const filePath = path.join(uploadsDir, photo.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
