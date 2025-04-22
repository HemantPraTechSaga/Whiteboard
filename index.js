const WebSocket = require('ws');
const express = require('express');
const app = express();

const server = new WebSocket.WebSocketServer({ port: 8080 });

server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(message.toString());

        let data;
        try {
            data = JSON.parse(message.toString());
        } catch (error) {
            console.error('Invalid JSON received:', message);
            return;
        }
        // if (data.type === 'draw') {
        // Broadcast drawing data to all connected clients
        server.clients.forEach((client) => {
            // if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
            // }
        });
        // }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');