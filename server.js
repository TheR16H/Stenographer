const express = require('express');
const fs = require('fs');
const path = require('path');
const notesRoutes = require('./apiRoutes/notes');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware setup
//app.use('/api/notes', notesRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    console.log("Hit API NOTES route");
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) {
            console.log("Error: ", err);
        }
        console.log("data: ", data);
        res.json(data);
    })
  
   /* fs.promises.readFile('./db/db.json', 'utf8')
        .then(data => {
            console.log("Data: ", data);
            res.json(JSON.parse(data))
        })
        .catch(err => console.log(err)); */
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: Math.floor(Math.random() * 1000) // Generate a unique ID using Math.random()
        };

        console.log("New ", newNote);

        fs.promises.readFile('./db/db.json', 'utf8')
            .then(data => {
                const db = JSON.parse(data);
                db.push(newNote);
                const stringifiedDb = JSON.stringify(db, null, 2);

                fs.writeFile('./db/db.json', stringifiedDb, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`SERVER: SUCCESS! Task for "${newNote.title}" has been written to JSON`);
                    }
                });

                const response = {
                    status: 'Success',
                    body: newNote
                };

                res.json(response);
            })
            .catch(err => console.log(err));
    } else {
        res.status(400).json({ error: 'Title and text are required for a note' });
    }
});

// DELETE Route
app.delete('/apiRoutes/notes/:id', (req, res) => {
    // HOW do we DELETE a record from our DB?
    console.log("ID: ", req.params.id)
    // First we should QUERY for Our CURRENT DATA
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) {
            console.log("Error: ", err);
        }
        console.log("data: ", data);
        let jsData = JSON.parse(data);
        // --> SuCCESS & we have data 
    
        // Next --> WE sort/search through our ARRAY (dataset) for the req.params.id  
        let filteredData = jsData.filter(note => {
            return parseInt(req.params.id) !== note.id;
        });

        console.log("Filtered: ", filteredData);

        // WE NEED TO SAVE the modified dataset 
        // fs.writeFileSync('./db/db.json', JSON.stringify(filteredData));
        fs.writeFile('./db/db.json', JSON.stringify(filteredData), (err) => {
            if (err) {
                console.log("Error writing file: ", err);
                res.status(500).send("Error deleting note.");
            } else {
                res.json({ message: "Note deleted successfully." });
            }
        });
    })

});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

// Start the server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});