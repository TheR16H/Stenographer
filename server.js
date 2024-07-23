const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Import the routes from notes.js
const notesRoutes = require('./apiRoutes/notes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Use the imported routes in the Express app
app.use('/', notesRoutes);

// Other routes or server setup code can go here

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
And here's how the notes.js file might look:

// notes.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
let db = require('../db/db.json');
const noteId = require('../public/helpers/id');

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