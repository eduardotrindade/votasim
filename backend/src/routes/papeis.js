import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM papel ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;