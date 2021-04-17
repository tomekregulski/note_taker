// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up Express middleware to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets up Express middleware for static pages
app.use(express.static(path.join(__dirname, "public")));

// Routes
// Index page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

// Notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// Get the DB JSON file
app.get("/api/notes", (req, res) => res.json(db));

// Post requests for adding new notes
app.post("/api/notes", (req, res) => {
  console.log("Note received!");
  const newNote = req.body;
  newNote.id = uuidv4();
  console.log(newNote.id);
  db.push(newNote);
  console.log(
    `"title": "${newNote.title}", "text": "${newNote.text}"  "id": "${newNote.id}" posted to db.json`
  );
  fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
    if (err) throw err;
    console.log("Posted new note!");
  });
  res.json(newNote);
});

// Delete requests for deleting notes
app.delete("/api/notes/:id", (req, res) => {
  for (index of db) {
    if (index.id == req.params.id) {
      const removedIndex = db.indexOf(index);
      db.splice(removedIndex, 1);
      fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
        if (err) throw err;
      });
      console.log("Note deleted and saved notes updated!");
    }
  }
  res.json();
});

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
