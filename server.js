const Ably = require("ably");
const rest = new Ably.Rest({ key:"fxMQpw.aEr0EA:05niu43Es5EVvgeh7pa_p6MDFqzraDVbhFnBe8crcGY"});
const express = require('express'),
      app = express();

app.get('/', function(req, res) {
    res.send('Hello, I am a very simple server');
})

app.get("/auth", (req, res) => {
    let tokenParams;
    // Check if the user is logged in
    if (req.cookies.username) {
      /* Issue a token with pub & sub privileges for all channels and
        configure the token with an client ID */
      tokenParams = {
        capability: { "*": ["publish", "subscribe"] },
        clientId: req.cookies.username,
      };
    } else {
      /* Issue a token request with sub privileges restricted to one channel
        and configure the token without a client ID (anonymous) */
      tokenParams = {
        capability: { notifications: ["subscribe"] },
      };
    }
});

app.listen(5500, function() {
    console.log('Web server listening on port 5500');
});