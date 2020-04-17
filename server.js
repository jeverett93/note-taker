// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require('fs');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT ||3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// holds user data
let notes = [];

// Basic route that sends the user first to the AJAX Page
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public","index.html"));
  });

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public","notes.html"));
  });

app.post("/api/notes", function(req, res) {
//   return res.json(reservations);
  });

app.delete("/api/notes/:id", function(req, res) {
//  return res.json(waitList);
  });



// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });