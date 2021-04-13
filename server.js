// Dependencies
const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Routes
// Basic route that sends the user first to the AJAX Page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (req, res) => res.json(db));

app.post("/api/notes", (req, res) => {
  console.log("Note received!");
  const newNote = req.body;
  newNote.id = uuidv4();
  console.log(newNote.id);
  fs.readFile("./db/db.json", function (err, data) {
    var list = JSON.parse(data);
    list.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(list), function (err) {
      if (err) throw err;
    });
  });
  res.json("Successfully posted new note");
});

app.delete("/api/notes/:id", (req, res) => {
  console.log(req.params.id);
  const newDb = db.filter((deletedNote) => deletedNote.id != req.params.id);
  fs.writeFile("./db/db.json", JSON.stringify(newDb), (err) => {
    if (err) throw err;
  });
  console.log("The note was deleted successfully");
  res.json("success");
});

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
