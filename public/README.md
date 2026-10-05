# Proiect Web – Profil, căutare cărți și API de contacte

Aplicație web cu:
- pagină de profil responsive (HTML/CSS) și formular validat în JavaScript
- căutare de cărți după titlu prin Open Library API
- API REST CRUD propriu (Express + SQLite) pentru contacte, apelat din front-end

## Tehnologii
HTML, CSS, JavaScript, Node.js, Express, SQLite (better-sqlite3)

## Cerințe
- Node.js 18 sau mai nou
- Git

## Pași de rulare
```bash
git clone https://github.com/Aleczx23/proiect-web.git
cd proiect-web
npm install
npm start
```
Apoi deschide http://localhost:3000 în browser.

Baza de date `contacte.db` se creează automat la prima pornire.

## Endpoint-uri API

| Metodă | Rută | Descriere | Răspuns |
|---|---|---|---|
| GET | /api/contacte | Lista contactelor | 200 |
| GET | /api/contacte/:id | Un contact | 200 / 404 |
| POST | /api/contacte | Adaugă contact | 201 / 400 |
| PUT | /api/contacte/:id | Modifică contact | 200 / 400 / 404 |
| DELETE | /api/contacte/:id | Șterge contact | 204 / 404 |

Exemplu corp JSON pentru POST/PUT:
```json
{ "nume": "Popescu", "prenume": "Ion", "email": "ion@test.com", "telefon": "0722111222" }
```

## Structura proiectului
```
public/        front-end (index.html, style.css, app.js, carti.js)
server.js      serverul Express și rutele API
package.json   dependențe și scriptul de pornire
```