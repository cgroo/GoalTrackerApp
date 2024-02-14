// Define existingLobbies array globally
const existingLobbies = [];

// Function to check if a lobby exists
function checkLobbyExists(lobbyName) {
    // Assume some logic to check if the lobby exists
    return existingLobbies.includes(lobbyName);
}

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get the input values
    const username = document.getElementById("username").value;
    const lobbyname = document.getElementById("lobbyname").value;
    
    // Data to send in the POST request
    const data = {
        username: username,
        lobbyname: lobbyname
    };

    // Make a POST request to the server
    fetch('/lobbies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Response received:', response); // Log the response
        return response.json();
    })
    .then(data => {
        // Handle the response from the server
        console.log(data);
        // You can redirect the user to the lobby page or perform other actions based on the response
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors or display error messages to the user
    });
    
}
// Add event listener to the form for submission
document.getElementById("join-lobby-form").addEventListener("submit", handleFormSubmission);
