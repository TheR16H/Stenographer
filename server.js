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













// You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).


// * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.


// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, 
// and then return the new note to the client. 
app.post("", function(req,res) {
    //push to the body?
    
});

// * `DELETE /api/notes/:id
app.delete("", function(req,res) {
    // we may need to check the length since it was originally an array

});

