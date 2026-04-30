const express = require('express');
const { db } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/contact - Submit contact form (public)
router.post('/', (req, res) => {
  try {
    const { name, email, phone, wedding_date, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const result = db.prepare(`
      INSERT INTO contact_submissions (name, email, phone, wedding_date, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, phone || null, wedding_date || null, message || null);

    res.json({
      message: 'Thank you! Your message has been sent.',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/contact - Get all submissions (admin only)
router.get('/', authenticateToken, (req, res) => {
  try {
    const submissions = db.prepare(`
      SELECT * FROM contact_submissions 
      ORDER BY created_at DESC
    `).all();

    const unreadCount = db.prepare('SELECT COUNT(*) as count FROM contact_submissions WHERE read = 0').get().count;

    res.json({
      submissions,
      unreadCount
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/contact/:id/read - Mark as read (admin only)
router.put('/:id/read', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    db.prepare('UPDATE contact_submissions SET read = 1 WHERE id = ?').run(id);

    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/contact/:id - Delete submission (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM contact_submissions WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ message: 'Submission deleted' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
