// Dependencies
const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("./db/db.json");

const fs = require("fs");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  console.log(newNote);
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;
  console.log(db[id]);
  db.splice(id, 1);
  console.log(db);
  res.json("success");
});

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
