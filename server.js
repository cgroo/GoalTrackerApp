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

// Route to handle POST requests to create or join a lobby
app.post('/lobbies', (req, res) => {
    // Extract data from the request body
    const { username, lobbyname } = req.body;

    // Check if a lobby with the same name already exists
    const existingLobby = lobbies.find(lobby => lobby.lobbyname === lobbyname);

    if (existingLobby) {
        // If the lobby exists, respond with the existing lobby details
        console.log('Existing lobby found:', existingLobby);
        res.json(existingLobby);
    } else {
        // If the lobby does not exist, create a new lobby
        console.log('No existing lobby found, creating new lobby:', lobbyname);
        const newLobby = {
            id: uuidv4(),
            lobbyname: lobbyname,
            createdAt: new Date()
        };
        console.log('New lobby:', newLobby);
        lobbies.push(newLobby);
        res.status(201).json(newLobby); // Send a 201 status code indicating successful creation
    }
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