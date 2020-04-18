// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const uuid = require("uuid");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// importing db.json
const dbjson = require('./db/db.json');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// holds user data
let notes = [];

// Basic route that sends the user first to the Index Page

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", function (req, res) {
  // read db json file using fs and then:
readFileAsync("./db/db.json", "utf8").then (data => {
  const notesJSON = JSON.parse(data)
  // parse when reading, stringify while writing
    console.log(notesJSON)
    res.json(notesJSON)
  })
});

app.post("/api/notes", function (req, res) {
  let newNote = req.body
  let id = uuid.v4
  newNote.id = `${id}`
  readFileAsync("./db/db.json", "utf8").then (data =>{
    const notesJSON = JSON.parse(data);
    notesJSON.push(newNote);

    writeFileAsync("./db/db.json", JSON.stringify(notesJSON)).then(() => {
      res.json(newNote);
    })
  })
});

app.delete("/api/notes/:id", function (req, res) {
  dbjson.delete(req.body)
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});