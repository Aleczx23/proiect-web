const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("contacte.db");

db.exec(`CREATE TABLE IF NOT EXISTS contacte (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nume TEXT NOT NULL,
  prenume TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT NOT NULL
)`);

app.use(express.json());
app.use(express.static("public"));

function valideaza(d) {
  const erori = [];
  if (!d.nume || d.nume.trim().length < 2) erori.push("nume invalid");
  if (!d.prenume || d.prenume.trim().length < 2) erori.push("prenume invalid");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || "")) erori.push("email invalid");
  if (!/^07\d{8}$/.test(d.telefon || "")) erori.push("telefon invalid");
  return erori;
}

// READ – toate
app.get("/api/contacte", (req, res) => {
  const rows = db.prepare("SELECT * FROM contacte ORDER BY id DESC").all();
  res.status(200).json(rows);
});

// READ – unul
app.get("/api/contacte/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM contacte WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ eroare: "Contactul nu există" });
  res.json(row);
});

// CREATE
app.post("/api/contacte", (req, res) => {
  const erori = valideaza(req.body);
  if (erori.length) return res.status(400).json({ erori });
  const { nume, prenume, email, telefon } = req.body;
  const info = db
    .prepare("INSERT INTO contacte (nume, prenume, email, telefon) VALUES (?, ?, ?, ?)")
    .run(nume, prenume, email, telefon);
  res.status(201).json({ id: info.lastInsertRowid, nume, prenume, email, telefon });
});

// UPDATE
app.put("/api/contacte/:id", (req, res) => {
  const erori = valideaza(req.body);
  if (erori.length) return res.status(400).json({ erori });
  const { nume, prenume, email, telefon } = req.body;
  const info = db
    .prepare("UPDATE contacte SET nume=?, prenume=?, email=?, telefon=? WHERE id=?")
    .run(nume, prenume, email, telefon, req.params.id);
  if (info.changes === 0) return res.status(404).json({ eroare: "Contactul nu există" });
  res.json({ id: Number(req.params.id), nume, prenume, email, telefon });
});

// DELETE
app.delete("/api/contacte/:id", (req, res) => {
  const info = db.prepare("DELETE FROM contacte WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ eroare: "Contactul nu există" });
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pornit pe http://localhost:${PORT}`));