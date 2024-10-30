const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let users = {};

wss.on('connection', function connection(ws) {
    console.log('connected');
  ws.on('message', (data) => {
    const message = JSON.parse(data);

    switch (message.type) {
        case 'LOGIN':
            users[message.username] = ws;
            ws.userId = message.userId;
            console.log(`User ${message.username} logged in`);
            break;

        case 'PRIVATE_MESSAGE':
            const recipientWs = users[message.to];
            if (recipientWs) {
                recipientWs.send(JSON.stringify({
                    type: 'PRIVATE_MESSAGE',
                    from: message.from,
                    content: message.content
                }));
            }
            break;
        default:
            console.log('Unknown message type:', message.type);
    }
  });
  ws.on('close', () => {
    if (ws.userId) {
        delete users[ws.userId];
        console.log(`${ws.userId} disconnected`);
    }
    });
});

module.exports = wss;