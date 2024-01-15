document.addEventListener('DOMContentLoaded', function () {
    var auth0 = new auth0.WebAuth({
      domain: 'your-auth0-domain',
      clientID: 'your-client-id',
      redirectUri: 'http://127.0.0.1:3000/goals_app/callback', // Set your actual callback URL
      responseType: 'token id_token',
      scope: 'openid profile email',
    });
  
    document.getElementById('login-button').addEventListener('click', function () {
      auth0.authorize();
    });
  });
  