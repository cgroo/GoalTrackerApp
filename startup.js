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
        return response.json();
    })
    .then(data => {
        // Handle the response from the server
        console.log(data);
        // Redirect the user to goal.html with the lobby ID/name
        window.location.href = `/goal.html?lobbyId=${data.id}&lobbyName=${data.lobbyname}`;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors or display error messages to the user
    });
}

// Add event listener to the form for submission
document.getElementById("join-lobby-form").addEventListener("submit", handleFormSubmission);
