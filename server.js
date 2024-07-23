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