const express = require('express');
const router = express.Router();

module.exports = function(app) {
app.get("/", function(req, res) {

    res.sendFile(path.join(__dirname, "/public/index.html"))
});

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  );

  return app;

};