const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
require('dotenv').config();

const hashPassword = require('./hashPassword');

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
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

app.post('/register', async (req, res) => {
    const hashedPassword = await hashPassword(req.body.password);
    var sql = 'INSERT INTO user (first_name, last_name, username, password, join_date, email, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [req.body.firstName, req.body.lastName, req.body.username, hashedPassword, new Date(), req.body.email, req.body.birthDate], (err, result) => {
        if (err) {
            console.log('Error registering user');
            return;
        }
        console.log('User registered');
        res.send('User registered').status(200);
    });
});

app.post('/login', (req, res) => {
    var sql = 'SELECT * FROM user WHERE username = ?';
    db.query(sql, [req.body.username], async (err, results) => {
        if (err) {
            console.log('Error logging in');
            return;
        }
        if (results.length === 0) {
            res.json({ error: 'Invalid username or password' });
            return;
        }
        bcrypt.compare(req.body.password, results[0].password, (err, result) => {
            if (err) throw err;
            if (result) {
                const token = jwt.sign({ username: req.body.username, id: results[0].ID }, JWT_SECRET, {
                    expiresIn: '1h'
                });
                res.json({ token });
            } else {
                res.json({ error: 'Invalid username or password' });
            }
        });
    });
});

app.post('/new_post', async (req, res) => {
    console.log(req.body);
    var sql = 'INSERT INTO article (title, body, theme, author_id, date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [req.body.title, req.body.body, req.body.theme, req.body.author, new Date()], (err, result) => {
        if (err) {
            console.log('Error creating post');
            return;
        }
        console.log('Post created');
        res.send('Post created').status(200);
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