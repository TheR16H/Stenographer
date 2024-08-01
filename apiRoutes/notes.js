const express = require('express');
const router = express.Router();
const fs = require('fs');

// Load the existing notes from db.json file
let db = require('../db/db.json');

// Function to generate a unique ID for a new note
function noteId() {
  // Implement your logic to generate a unique ID here
  return Math.floor(Math.random() * 1000); // Example: Generate a random number for simplicity
}

// GET /api/notes
router.get('/api/notes', (req, res) => {
  // Read the db.json file and send the notes as a response
  db = JSON.parse(fs.readFileSync("./db/db.json")) || [];
  res.json(db);
});

// POST /api/notes
router.post('/api/notes', (req, res) => {
  console.info(`${req.method} adding a note!!`);
  
  // Extract title and text from the request body
  const { title, text } = req.body;

  // Check if title and text are provided
  if (title && text) {
    // Create a new note object with a unique ID
    const newNote = {
      title,
      text,
      id: noteId()
    };

    // Read the existing notes from db.json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        // Add the new note to the existing notes
        parsedNotes.push(newNote);
        db = parsedNotes;
        
        // Write the updated notes back to db.json file
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
    // Send the new note as a response
    res.status(201).json(response);
  } else {
    // Send an error response if title and text are not provided
    res.status(400).json({ error: 'Title and text are required for a note' });
  }
});

module.exports = router;