const express = require('express');
const mysql = require('mysql2');
const app = express();
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to DB');
        return;
    }
    console.log('Connection to DB established');
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
  console.log('server running on port 3000');
});