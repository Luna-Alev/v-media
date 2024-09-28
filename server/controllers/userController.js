const db = require('../utils/db');
const hashPassword = require('../utils/hashPassword');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { recaptchaToken, firstName, lastName, username, password, email, birthDate } = req.body;
    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;

    try {
        const response = await axios.post(recaptchaUrl);
        const { success } = response.data;

        if (!success) {
            res.json({ error: 'Failed reCAPTCHA verification' });
            return;
        }
        var sql = 'INSERT INTO user (first_name, last_name, username, password, join_date, email, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const hashedPassword = await hashPassword(password);
        db.query(sql, [firstName, lastName, username, hashedPassword, new Date(), email, birthDate], (err, result) => {
            if (err) {
                console.log('Error registering user');
                return;
            }
            console.log('User registered');
            res.send('User registered').status(200);
        });

    } catch (error) {
        console.error('Error during reCAPTCHA validation', error);
        res.status(500).send({ message: 'reCAPTCHA validation failed' });
    }

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