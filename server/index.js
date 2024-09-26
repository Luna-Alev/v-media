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
    var sql = 'INSERT INTO user (first_name, last_name, username, password, join_date, email, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [req.body.firstName, req.body.lastName, req.body.username, req.body.password, new Date(), req.body.email, req.body.birthDate], (err, result) => {
        if (err) {
            console.log('Error registering user');
            return;
        }
        console.log('User registered');
        res.send('User registered').status(200);
    });
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