const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // Replace with your MySQL password
  database: 'notes_app'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Get all notes
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Add a new note
app.post('/notes', (req, res) => {
  const { content } = req.body;
  db.query('INSERT INTO notes (content) VALUES (?)', [content], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.json({ id: result.insertId, content });
    }
  });
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.json({ message: 'Note deleted successfully!' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
