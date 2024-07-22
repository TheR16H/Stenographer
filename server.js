const express = require("express");
const fs = reqiuire("fs");
let db = require('./db/db.json');
const apiRoutes = require('./apiRoutes'); 
const path = require('path');
const app = express();

app.use('/', apiRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));













// You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).


// * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.

app.get("/api/notes", (req, res) => {
    db = JSON.parse(fs.readFileSync("./db/db.json")) || []
        res.JSON(db)
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, 
// and then return the new note to the client. 
app.post("", function(req,res) { 
    console.info(`${req.method} adding a note!!`);
    const { title, text } = req.body;
    if ( title && text ) { 
        const newNote = {
            title,
            text,
            id: noteId() //,
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              const parsedNotes = JSON.parse(data)
              console.log(data)
              parsedNotes.push(newNote)
              db = parsedNotes
              fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) =>
                writeErr
                  ? console.error(writeErr)
                  : console.info('Successfully updated notes')
                );
              
            
            }
          });

    //push to the body?
    }
});

// * `DELETE /api/notes/:id
app.delete("", function(req,res) {
    // we may need to check the length since it was originally an array

});

const response = {
    status: "success",
    body: newNote,
  };

  console.log(response);
  res.status(201).json(response);



