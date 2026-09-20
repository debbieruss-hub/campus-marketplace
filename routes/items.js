const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // <--- Import multer middleware

// GET ALL ACTIVE ITEMS (Public Marketplace Feed)
router.get('/', async (req, res) => {
  try {
    const items = await pool.query(`
      SELECT i.*, c.name as category_name, u.full_name as seller_name, u.whatsapp_number 
      FROM items i
      JOIN categories c ON i.category_id = c.id
      JOIN users u ON i.seller_id = u.id
      WHERE i.is_deleted = FALSE AND i.status = 'Active'
      ORDER BY i.created_at DESC
    `);
    res.json(items.rows);
  } catch (err) {
    console.error('Fetch Items Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE A NEW ITEM LISTING (Protected Route with Image Upload)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price_mur, 
      item_condition, 
      campus_location, 
      category_id 
    } = req.body;
    
    const seller_id = req.user.id;

    if (!title || !description || !price_mur || !item_condition || !category_id) {
      return res.status(400).json({ error: 'Please provide title, description, price_mur, item_condition, and category_id.' });
    }

    // Determine image URL: use uploaded file path if present, otherwise fallback
    const image_url = req.file ? `/uploads/${req.file.filename}` : (req.body.image_url || 'https://via.placeholder.com/150');

    const newItem = await pool.query(
      `INSERT INTO items (
        title, description, price_mur, item_condition, image_url, campus_location, category_id, seller_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        title, 
        description, 
        price_mur, 
        item_condition, 
        image_url, 
        campus_location || 'Beau Plan', 
        category_id, 
        seller_id
      ]
    );

    res.status(201).json({
      message: 'Item listed successfully',
      item: newItem.rows[0]
    });
  } catch (err) {
    console.error('Create Item Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// SOFT DELETE AN ITEM (Protected Route - Seller Only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;

    const itemCheck = await pool.query('SELECT * FROM items WHERE id = $1', [itemId]);
    
    if (itemCheck.rows.length ===0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (itemCheck.rows[0].seller_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own items' });
    }

    const deletedItem = await pool.query(
      `UPDATE items 
       SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [itemId]
    );

    res.json({
      message: 'Item successfully deleted',
      item: deletedItem.rows[0]
    });
  } catch (err) {
    console.error('Delete Item Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;