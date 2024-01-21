// _app.js
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth0Config } from 'D:/Workspace/Repositories/GoalTrackerApp/goals_app/HTMLauth0-config';

function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain={Auth0Config.domain}
      clientId={Auth0Config.clientId}
      redirectUri={Auth0Config.redirectUri}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );
}

export default MyApp;
