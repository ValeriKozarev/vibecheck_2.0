import React, { useEffect, useState } from 'react';
import Gallery from './components/Gallery'
import { CLIENT_ID, CLIENT_SECRET } from './keys';
import './App.css';

function App() {
  // data we will want to keep track of in the session
  const [accessToken, setAccessToken] = useState("")

  // NOTE: runs once at start to handle spotify auth
  useEffect(() => {
    let spotifyAuthParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', spotifyAuthParams)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  return (
    <div className="App">
      <Gallery accessToken={accessToken}/>
    </div>
  );
}

export default App;
