const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./utils/db');

const app = express();
const routes = require('./routes/routes');

const http = require('http');
const socketIo = require('socket.io');

app.use(cors());
app.use(express.json());

app.use('/api', routes);

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'https://localhost:3001',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
});

let users = {};

io.on('connection', (socket) => {
    console.log('A new client connected');

    socket.on('login', (username) => {
        users[username] = socket.id;  // Map userId to socketId
        console.log(`${username} logged in`);
    });

    socket.on('private_message', ({ from, to, content }) => {
        console.log(`Private message from ${from} to ${to}: ${content}`);
        const recipientSocketId = users[to];
        const sql = `INSERT INTO directmessage (from_id, to_id, content, time) VALUES ((SELECT id FROM user WHERE username = ?), (SELECT id FROM user WHERE username = ?), ?, NOW())`;
        db.query(sql, [from, to, content], (err, result) => {
            if (err) {
                console.log(err);
            }
        });
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private_message', { from, content });
        }

    });

    socket.on('disconnect', () => {
        for (let username in users) {
            if (users[username] === socket.id) {
                delete users[username];
                console.log(`${username} disconnected`);
                break;
            }
        }
    });
});

//app.use(express.static('/var/www/lugeja'));
//app.get('/*', (req, res) => {
//  res.sendFile(path.join('/var/www/lugeja', 'index.html'));
//});

server.listen(8080, () => {
    console.log("Socket.IO server running on http://localhost:8080");
});

app.listen(3001, () => {
  console.log('server running on port 3001');
});