const express = require('express');
const cors = require('cors');
const path = require('path');

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

    socket.on('login', (userID) => {
        users[userID] = socket.id;  // Map userId to socketId
        console.log(`${userID} logged in`);
    });

    socket.on('private_message', ({ from, to, content }) => {
        console.log(`Private message from ${from} to ${to}: ${content}`);
        const recipientSocketId = users[to];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private_message', { from, content });
        }
    });

    socket.on('disconnect', () => {
        for (let userID in users) {
            if (users[userID] === socket.id) {
                delete users[userID];
                console.log(`${userID} disconnected`);
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