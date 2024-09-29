const db = require('../utils/db');
const hashPassword = require('../utils/hashPassword');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
const e = require('express');
const { error } = require('console');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateVerificationToken = async () => {
    return crypto.randomBytes(32).toString('hex');
};

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: 'vmedia.noreply@gmail.com',
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const register = async (req, res) => {
    const { recaptchaToken, firstName, lastName, username, password, email, birthDate } = req.body;
    const verificationToken = await generateVerificationToken();
    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;

    var sql = 'SELECT * FROM user WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.log('Error checking if username exists');
            return res.status(500).json({ error: 'Error checking if username exists' });
        }
        if (result.length > 0) {
            console.log('Username already exists');
            return res.status(400).json({ error: 'Username already exists' });
        }

        registerUser();
    });

    const registerUser = async () => {
    try {
        const response = await axios.post(recaptchaUrl);
        const { success } = response.data;

        if (!success) {
            res.json({ error: 'Failed reCAPTCHA verification' });
            return;
        }

        var sql = 'INSERT INTO user (first_name, last_name, username, password, join_date, email, birth_date, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)';
        const hashedPassword = await hashPassword(password);
        db.query(sql, [firstName, lastName, username, hashedPassword, new Date(), email, birthDate, verificationToken], (err, result) => {
            if (err) {
                console.log('Error registering user');
                return;
            }
            console.log('User registered');
            res.send('User registered').status(200);
        });

        const verificationLink = `http://lugeja.eu/verify-email?token=${verificationToken}&email=${email}`;
        const mailOptions = {
            from: 'vmedia.noreply@gmail.com',
            to: email,
            subject: 'Verify your email',
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending verification email', error);
                return;
            }
            console.log('Verification email sent');
            res.status(200).send('Verification email sent');
        });

    } catch (error) {
        console.error('Error during reCAPTCHA validation', error);
        res.status(500).send({ message: 'reCAPTCHA validation failed' });
    }
}

};

const verifyEmail = async (req, res) => {
    const { token, email } = req.query;
    var sql = 'SELECT * FROM user WHERE email = ? AND verification_token = ?';
    db.query(sql, [email, token], (err, result) => {
      if (err || result.length === 0) {
        console.log('Invalid or expired verification token');
        return res.status(400).send({ message: 'Invalid or expired verification token' });
      }
  
      var updateSql = 'UPDATE user SET is_verified = 1 WHERE email = ? AND verification_token = ?';
      db.query(updateSql, [email, token], (err, result) => {
        if (err) {
          console.log('Error verifying email');
          return res.status(500).send({ message: 'Error verifying email' });
        }
  
        console.log('Email verified successfully');
        res.status(200).send({ message: 'Email verified successfully' });
      });
    });
};

const requestResetPassword = async (req, res) => {
    const { username } = req.body;
    var sql = 'SELECT email FROM user WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
        if (err || result.length === 0) {
            console.log('Invalid username');
            return res.status(400).send({ message: 'Invalid username' });
        }

        const email = result[0].email;
        const resetToken = await generateVerificationToken();
        const resetTokenExpiration = new Date(Date.now() + 3600000);

        const updateSql = 'UPDATE user SET reset_token = ?, reset_token_expiry = ? WHERE username = ?';
        db.query(updateSql, [resetToken, resetTokenExpiration, username], (err, result) => {
            if (err) {
                console.log('Error updating reset token');
                return res.status(500).send({ message: 'Error updating reset token' });
            }

            const resetLink = `http://lugeja.eu/reset-password?token=${resetToken}&username=${username}`;
            const mailOptions = {
                from: 'vmedia.noreply@gmail.com',
                to: email,
                subject: 'Reset your password',
                html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending reset password email', error);
                    return;
                }
                console.log('Reset password email sent');
                res.status(200).send('Reset password email sent');
            });
        });
    });
};

const resetPassword = async (req, res) => {
    const { token, username, newPassword } = req.body;

    const sql = 'SELECT * FROM user WHERE username = ? AND reset_token = ? AND reset_token_expiry > ?';
    db.query(sql, [username, token, new Date()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Invalid or expired token');
        }

        const hashedPassword = await hashPassword(newPassword);

        const updateSql = 'UPDATE user SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE username = ?';
        db.query(updateSql, [hashedPassword, username], (updateErr) => {
            if (updateErr) {
                return res.status(500).send('Error resetting password');
            }

            res.status(200).send('Password reset successfully');
        });
    });
};

const login = async (req, res) => {
    var sql = 'SELECT * FROM user WHERE username = ? AND is_verified = 1';
    db.query(sql, [req.body.username], async (err, results) => {
        if (err) {
            console.log('Error logging in');
            return;
        }
        if (results.length === 0) {
            res.json({ error: 'Invalid username or password or user not verified' });
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
    verifyEmail,
    requestResetPassword,
    resetPassword,
    login,
    getUser
};