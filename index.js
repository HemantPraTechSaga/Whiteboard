const express = require('express');
const app = express();

const PORT = 3000;
const HOST = '127.0.0.1'; // or use '0.0.0.0' for external access

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Express server is running');
});

app.get('/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'This is a test response!',
    });
});

// Example POST endpoint
app.post('/data', (req, res) => {
    const { name, age } = req.body;
    res.json({
        status: 'received',
        data: { name, age }
    });
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`Express server running at http://${HOST}:${PORT}`);
});   
