import { CLIENT_ID, CLIENT_SECRET } from '../keys';

export default function spotify_auth(): string {
    let receivedAccessToken = '';

    let spotifyAuthParams = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
      }
  
      fetch('https://accounts.spotify.com/api/token', spotifyAuthParams)
        .then(result => result.json())
        .then(data => receivedAccessToken = data.access_token)

      return receivedAccessToken;
}