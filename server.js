const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5500; // Use port 5500

// Serve static files from the 'goals_app/HTML' directory
app.use(express.static(path.join(__dirname, 'goals_app', 'HTML')));

// Log server start message
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Log requests to the server
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

// Serve the HTML file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'goals_app', 'HTML', 'setup.html'));
});

// Redirect to goals.html after joining a space
app.get('/join-space', (req, res) => {
    res.redirect('/file.html');
});
