const db = require('../utils/db');
const hashPassword = require('../utils/hashPassword');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
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
};

const login = async (req, res) => {
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
};

const getUser = async (req, res) => {
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
};

module.exports = {
    register,
    login,
    getUser
};