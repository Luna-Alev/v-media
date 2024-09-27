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

app.get('/posts', (req, res) => {
    var sql = 'SELECT article.ID, article.title, article.body, article.date, user.username, COUNT(likes.post_id) AS likes FROM article INNER JOIN user ON article.author_id = user.ID LEFT JOIN likes ON article.ID = likes.post_id GROUP BY article.ID LIMIT 10';
    db.query(sql, async (err, results) => {
        if (err) {
            console.log('Error fetching posts');
            return;
        }
        res.json(results);
    });
});

app.post('/like', (req, res) => {
    var sql = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';
    db.query(sql, [req.body.postID, req.body.userID], (err, results) => {
        if (err) {
            console.log('Error checking if post is liked');
            return;
        }
        if (results.length > 0) {
            var sql = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
            db.query(sql, [req.body.postID, req.body.userID], (err, result) => {
                if (err) {
                    console.log('Error unliking post');
                    return;
                }
                res.send('Post unliked').status(200);
            });
        }
        else {
            var sql = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
            db.query(sql, [req.body.postID, req.body.userID], (err, result) => {
                if (err) {
                    console.log('Error liking post');
                    return;
                }
                res.send('Post liked').status(200);
            });
        }

    });
});

app.get('/user/:username', (req, res) => {
    var sql = 'SELECT username, first_name, last_name, email, birth_date, join_date FROM user WHERE username = ?';
    db.query(sql, [req.params.username], (err, results) => {
        if (err) {
            console.log('Error fetching user');
            return;
        } 
        if (results.length === 0) {
            res.json({ error: 'User not found' }).status(404);
            return;
        }
        res.json(results);
    });
});

app.post('/follow', (req, res) => {
    var sql = 'SELECT * FROM follow WHERE follower_id = ? AND followee_id = (SELECT id FROM user WHERE username = ?)';
    db.query(sql, [req.body.follower, req.body.followee], (err, results) => {
        if (err) {
            console.log('Error checking if user is followed');
            return;
        }
        if (results.length > 0) {
            var sql = 'DELETE FROM follow WHERE follower_id = ? AND followee_id = (SELECT id FROM user WHERE username = ?)';
            db.query(sql, [req.body.follower, req.body.followee], (err, result) => {
                if (err) {
                    console.log('Error unfollowing user');
                    return;
                }
                res.send('User unfollowed').status(200);
            });
        }
        else {
            var sql = 'INSERT INTO follow (follower_id, followee_id) VALUES (?, (SELECT id FROM user WHERE username = ?))';
            db.query(sql, [req.body.follower, req.body.followee], (err, result) => {
                if (err) {
                    console.log('Error following user');
                    return;
                }
                res.send('User followed').status(200);
            });
        }
    });
});

app.listen(3001, () => {
  console.log('server running on port 3001');
});