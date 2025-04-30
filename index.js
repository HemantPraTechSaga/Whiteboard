const WebSocket = require('ws');
const express = require('express');
const app = express();

// Create WebSocket server
const server = new WebSocket.WebSocketServer({ port: 8080 });

server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received message:', message.toString());

        let data;
        try {
            data = JSON.parse(message.toString());
        } catch (error) {
            console.error('Invalid JSON received:', message);
            return;
        }

        // Handle different message types
        if (data.type === 'draw') {
            // Broadcast drawing data to all connected clients
            server.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }

        // Respond to "hit" messages
        if (data.type === 'hit') {
            const response = { type: 'response', message: 'Hit received!' };
            ws.send(JSON.stringify(response));  // Send response back to the client
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Serve a simple Express endpoint for testing the server
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

// Test endpoint to return a sample response
app.get('/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'This is a test response!',
    });
});

// Start Express server and bind to all interfaces
app.listen(3000, '0.0.0.0', () => {
    console.log('Express server running on http://0.0.0.0:3000');
});

console.log('WebSocket server is running on ws://localhost:8080');
