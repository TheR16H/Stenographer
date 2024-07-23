const express = require('express');
const router = express.Router();
const fs = require('fs');
let db = require('../db/db.json');

// GET /api/notes
router.get('/api/notes', (req, res) => {
  db = JSON.parse(fs.readFileSync("./db/db.json")) || [];
  res.json(db);
});

// POST /api/notes
router.post('/api/notes', (req, res) => {
  console.info(`${req.method} adding a note!!`);
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: noteId()
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        db = parsedNotes;
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
          } else {
            console.info('Successfully updated notes');
          }
        });
      }
    });

    const response = {
      status: 'success',
      body: newNote
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(400).json({ error: 'Title and text are required for a note' });
  }
});

module.exports = router;