// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const uuid = require("uuid");

// Methods to allow promisify async functions to be used
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Route that sends the user to the Notes Page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// Reads db json file and returns all saved notes as json
app.get("/api/notes", function (req, res) {
readFileAsync("./db/db.json", "utf8")
.then (data => {
  let notesJSON = JSON.parse(data)
    res.json(notesJSON)
  })
});

// Receive new notes to save and adds it to the db.json file, and then return the new note to the user.
app.post("/api/notes", function (req, res) {
  let newNote = req.body
  let id = uuid.v4()
  newNote.id = id
  readFileAsync("./db/db.json", "utf8").then (data =>{
    let notesJSON = JSON.parse(data);
    notesJSON.push(newNote);
    writeFileAsync("./db/db.json", JSON.stringify(notesJSON)).then(() => {
      res.json(newNote);
    });
  });
});

// Deletes selected note from the db json file and rewrites/return remaining notes to user.
app.delete("/api/notes/:id", function (req, res) {
  readFileAsync("./db/db.json", "utf8").then (data =>{
    let notesJSON = JSON.parse(data);
    let remainNotes = notesJSON.filter(note => note.id !== req.params.id);
    notesJSON = remainNotes;
    writeFileAsync("./db/db.json", JSON.stringify(notesJSON)).then(() => {
      res.json(notesJSON);
    });
  });
});

// Route that sends user to home/index page
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Starts the server to begin listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});