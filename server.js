// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Create an instance of the Express application
const app = express();
const PORT = 3000; // Specify the port number

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(express.static(__dirname));

// In-memory database to store lobbies (replace with a real database in production)
const lobbies = [];

// Route to handle POST requests to create a new lobby
app.post('/lobbies', (req, res) => {
    // Extract data from the request body
    const { lobbyname } = req.body;

    // Create a new lobby object
    const newLobby = {
        id: uuidv4(), // Generate unique ID
        lobbyname: lobbyname,
        createdAt: new Date()
    };

    // Add the new lobby to the in-memory database
    lobbies.push(newLobby);

    // Respond with the newly created lobby
    res.json(newLobby);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/goal.html', (req, res) => {
    res.sendFile(__dirname + '/goal.html');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
