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

app.post('/update-grid', async (req, res) => {
    const { title, gridId, itemId, type } = req.body;

    const db = new sqlite3.Database('./gridData.db');
    db.run(`CREATE TABLE IF NOT EXISTS gridData (title TEXT, gridId TEXT, itemId TEXT, type TEXT)`);
    
    let stmt = db.prepare(`INSERT INTO gridData VALUES (?, ?, ?, ?)`);
    stmt.run(title, gridId, itemId, type);
    stmt.finalize();
    
    db.close();
    
    res.sendStatus(200);
});



app.listen(3000, function() {
    console.log('App listening on port 3000');
});

