const express = require('express');
const { db } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/dates - Get all dates (public)
router.get('/', (req, res) => {
  try {
    const dates = db.prepare('SELECT date, status FROM booked_dates ORDER BY date ASC').all();
    
    const booked = dates.filter(d => d.status === 'booked').map(d => d.date);
    const lastAvailable = dates.filter(d => d.status === 'last_available').map(d => d.date);

    res.json({
      bookedDates: booked,
      lastAvailableDates: lastAvailable
    });
  } catch (error) {
    console.error('Get dates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/dates/all - Get all dates with details (admin only)
router.get('/all', authenticateToken, (req, res) => {
  try {
    const dates = db.prepare('SELECT * FROM booked_dates ORDER BY date ASC').all();
    res.json(dates);
  } catch (error) {
    console.error('Get all dates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/dates - Add or update a date (admin only)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { date, status, client_name, client_email, client_phone, notes } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const validStatuses = ['booked', 'last_available'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Upsert (insert or update)
    const existing = db.prepare('SELECT id FROM booked_dates WHERE date = ?').get(date);

    if (existing) {
      db.prepare(`
        UPDATE booked_dates 
        SET status = ?, client_name = ?, client_email = ?, client_phone = ?, notes = ?
        WHERE date = ?
      `).run(status || 'booked', client_name || null, client_email || null, client_phone || null, notes || null, date);
    } else {
      db.prepare(`
        INSERT INTO booked_dates (date, status, client_name, client_email, client_phone, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(date, status || 'booked', client_name || null, client_email || null, client_phone || null, notes || null);
    }

    res.json({ message: 'Date saved successfully', date });
  } catch (error) {
    console.error('Save date error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/dates/:date - Remove a date (admin only)
router.delete('/:date', authenticateToken, (req, res) => {
  try {
    const { date } = req.params;

    const result = db.prepare('DELETE FROM booked_dates WHERE date = ?').run(date);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Date not found' });
    }

    res.json({ message: 'Date removed successfully' });
  } catch (error) {
    console.error('Delete date error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
