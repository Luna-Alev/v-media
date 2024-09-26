const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to DB');
        return;
    }
    console.log('Connection to DB established');
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/user', (req, res) => {
    console.log(req.body);
    res.send('User registered');
});

app.get('/users', (req, res) => {
    var sql = 'SELECT * FROM user';
    db.query(sql, (err, results) => {
        if (err) {
            console.log('Error fetching users');
            return;
        }
        res.json(results);
    });
});

app.listen(3001, () => {
  console.log('server running on port 3001');
});