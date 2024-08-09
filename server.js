// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const notesRoutes = require('./apiRoutes/notes');

// const PORT = process.env.PORT || 3001;
// const app = express();

// // Middleware setup
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));


// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/index.html'));
// });

// app.get('/notes', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/notes.html'));
// });
// app.get('/apiRoutes/notes', (req, res) => {
//     fs.promises.readFile('./db/db.json', 'utf8')
//         .then(data => res.json(JSON.parse(data)))
//         .catch(err => console.log(err));
// });

// app.post('/apiRoutes/notes', (req, res) => {
//     const { title, text } = req.body;

//     if (req.body && title && text) {
//         const newNote = {
//             title,
//             text,
//             id: uuid()
//         };

//         fs.promises.readFile('./db/db.json', 'utf8')
//             .then(Db => {
//                 let newDb = JSON.parse(Db);
//                 newDb.push(newNote);
//                 const stringifiedDb = JSON.stringify(newDb);

//                 fs.writeFile('./db/db.json', stringifiedDb, (err) => {
//                     if (err) {
//                         console.log(error);
//                     } else {
//                         console.log(`SERVER: SUCCESS! Task for "${newNote.title} has been written to JSON"`);
//                     }
//                 });

//                 let response = {
//                     status: 'Success',
//                     body: newDb
//                 };

//                 res.json(response);
//             })
//             .catch(err => console.log(err));
//     } else {
//         res.json('client: ERROR Request body must at least contain a title');
//     }
// });

// // Additional routes from notesRoutes if needed

// // Start the server
// app.use('/', notesRoutes);
// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`);
// });

//re written code below 

const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid'); // Import the uuid module for generating unique IDs
const notesRoutes = require('./apiRoutes/notes');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware setup
app.use('/api/notes', notesRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// why isnt this bringing up the notes html? 

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });

app.get('/apiRoutes/notes', (req, res) => {
    fs.promises.readFile('./db/db.json', 'utf8')
        .then(data => res.json(JSON.parse(data)))
        .catch(err => console.log(err));
});

app.post('/apiRoutes/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid.v4() // Generate a unique ID for the new note i think
            // use math.random if doesn work
        };

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

// Additional routes from notesRoutes if needed

// Start the server
// app.use('/', notesRoutes);
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});