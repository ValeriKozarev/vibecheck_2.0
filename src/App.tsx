import { useEffect, useState } from 'react';
import {CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, RESPONSE_TYPE} from './keys'
import Gallery from './components/Gallery'

import './App.css';

function App() {
  // token for our session with the Spotify APIs that we want to keep in state
  const [token, setToken] = useState("")

  // NOTE: runs once at start to handle spotify auth
  useEffect(() => {
    const hash = window.location.hash
    let token: any = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split('&').find((elem) => elem.startsWith("access_token"))?.split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
      setToken(token)
    }

  }, [])

  // configure our URL for authenticating with Spotify
  const spotify_auth_url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`

  return (
    <div className="App">
      <h1>Vibecheck 2.0</h1>
      {!token ? 
        <a href={spotify_auth_url}>Login to Spotify</a>
        :
        <Gallery accessToken={token}/>
      }
    </div>
  );
}

export default App;
