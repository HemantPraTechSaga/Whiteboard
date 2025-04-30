const express = require('express');
const { WebSocketServer } = require('ws');

const HTTP_PORT = 3000;
const WS_PORT = 8080;
const HOST = '127.0.0.1'; // localhost only

const app = express();

// ===========================
// Express Server
// ===========================
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

app.get('/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'This is a test response!',
    });
});

app.listen(HTTP_PORT, HOST, () => {
    console.log(`Express server running on http://${HOST}:${HTTP_PORT}`);
});

// ===========================
// WebSocket Server
// ===========================
const wss = new WebSocketServer({ port: WS_PORT, host: HOST });

wss.on('connection', (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    console.log(`Client connected from ${clientIP}`);

    ws.on('message', (rawMessage) => {
        const message = rawMessage.toString();
        console.log('Received message:', message);

        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.error('Invalid JSON received:', message);
            return;
        }

        switch (data.type) {
            case 'draw':
                broadcastExceptSender(ws, JSON.stringify(data));
                break;

            case 'hit':
                ws.send(JSON.stringify({
                    type: 'response',
                    message: 'Hit received!',
                }));
                break;

            default:
                console.warn('Unhandled message type:', data.type);
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${clientIP}`);
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err.message);
    });
});

function broadcastExceptSender(sender, message) {
    wss.clients.forEach((client) => {
        if (client !== sender && client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}

console.log(`WebSocket server running on ws://${HOST}:${WS_PORT}`);
