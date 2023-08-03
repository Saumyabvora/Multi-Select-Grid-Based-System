const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let db = new sqlite3.Database('./gridData.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS grid (id TEXT, type TEXT, value TEXT)`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

app.post('/update-grid', function(req, res) {
    db.run(`INSERT OR REPLACE INTO grid(id, type, value) VALUES(?, ?, ?)`, [req.body.id, req.body.type, req.body.value], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

    res.send('Grid Updated');
});

app.listen(3000, function() {
    console.log('App listening on port 3000');
});

