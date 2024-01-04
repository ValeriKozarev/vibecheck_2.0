import React, { useEffect, useState } from 'react';
import Gallery from './components/Gallery'
import spotify_auth from './helpers/spotify_auth';

import './App.css';

function App() {
  // data we will want to keep track of in the session
  const [accessToken, setAccessToken] = useState("")

  // NOTE: runs once at start to handle spotify auth
  useEffect(() => {
    const receivedAccessToken: string = spotify_auth();
    setAccessToken(receivedAccessToken)
  }, [])

  return (
    <div className="App">
      <Gallery accessToken={accessToken}/>
    </div>
  );
}

export default App;
