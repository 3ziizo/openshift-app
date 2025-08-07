const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  host: process.env.POSTGRESQL_SERVICE_HOST || 'localhost',
  port: process.env.POSTGRESQL_SERVICE_PORT || 5432,
  database: process.env.POSTGRESQL_DATABASE || 'sampledb',
  user: process.env.POSTGRESQL_USER || 'user',
  password: process.env.POSTGRESQL_PASSWORD || 'password'
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new item
app.post('/api/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Initialize database table
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert sample data if table is empty
    const result = await pool.query('SELECT COUNT(*) FROM items');
    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO items (name, description) VALUES 
        ('Sample Item 1', 'This is the first sample item'),
        ('Sample Item 2', 'This is the second sample item'),
        ('Sample Item 3', 'This is the third sample item')
      `);
      console.log('Sample data inserted');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Start server
app.listen(port, '0.0.0.0', async () => {
  console.log(`Backend server running on port ${port}`);
  await initializeDatabase();
});

module.exports = app;