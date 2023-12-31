import { Component } from "react";
import { Button, Card, CardContent, CardMedia, Container, Grid, TextField, Typography } from '@mui/material';
import './Gallery.css'

interface ISongGroup {
  name: string
  images: any[]
  id: string
  isAlbum?: boolean
}

interface IGalleryProps {
  accessToken: string
}

interface IGalleryState {
  searchInput: string,
  songGroups: ISongGroup[]
}

class Gallery extends Component<IGalleryProps, IGalleryState> {
  constructor(props: IGalleryProps) {
    super(props);

    this.state = {
      searchInput: '',
      songGroups: []
    };

    this.setSearchInput = this.setSearchInput.bind(this);
  }

  setSearchInput(inputVal: string) {
    this.setState({searchInput: inputVal})
  }

  setSongGroups(songGroupArray: ISongGroup[]) {
    this.setState({songGroups: songGroupArray})
  }

  async getAudioFeatures(songGroup: ISongGroup) {
    let searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    }
    let isAlbum = false;
    
    // step 1: determine if its an album or a playlist so we hit the right API
    if ('album_type' in songGroup) {
      if (songGroup.album_type === "album") {
        isAlbum = true;
      }
    }

    // step 2: get the list of tracks for the album or playlist (different endpoints same logic)
    // https://api.spotify.com/v1/playlists/{playlist_id}/tracks
    // https://api.spotify.com/v1/albums/{id}/tracks
    let songData: string[] = []

    if (isAlbum) {
      songData = await fetch('https://api.spotify.com/v1/albums/' + songGroup.id + '/tracks', searchParams)
      .then(result => result.json())
      .then(data => {
        return data.items.map((item: { id: string; }) => item.id)
      })
    } else {
      songData = await fetch('https://api.spotify.com/v1/playlists/' + songGroup.id + '/tracks', searchParams)
      .then(result => result.json())
      .then(data => {
        return data.items.map((item: { track: any; }) => item.track.id)
      })      
    }

    // step 3: get the audio features for the list of tracks 
    // https://api.spotify.com/v1/audio-features?ids=<comma separated list of IDs>
    let audioFeatures = await fetch('https://api.spotify.com/v1/audio-features?ids=' + songData.toString(), searchParams)
      .then(result => result.json())
      .then(data => { return data.audio_features })

    // step 4: parse/analyze audio features
    console.log('Summary Stats for ' + songGroup.name)
    console.log('avg energy: ' + (audioFeatures.reduce((total: number, next: any) => total + next.energy, 0) / audioFeatures.length))
    console.log('avg danceability: ' + (audioFeatures.reduce((total: number, next: any) => total + next.danceability, 0) / audioFeatures.length))
    console.log('avg acousticness: ' + (audioFeatures.reduce((total: number, next: any) => total + next.acousticness, 0) / audioFeatures.length))
    console.log('avg instrumentalness: ' + (audioFeatures.reduce((total: number, next: any) => total + next.instrumentalness, 0) / audioFeatures.length))


    // step 5: get recommendations? theres an aPI for that
  }
  
  // helper function for shuffling our array
  shuffleArray(array: ISongGroup[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
  // main way to interact with Spotify is here
  // find artist based on search, and then use artistID to list albums
  async searchOnSpotify() {
    let searchParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    }

    await fetch('https://api.spotify.com/v1/search?q=' + this.state.searchInput + '&type=album,playlist', searchParams)
       .then(result => result.json())
       .then(data => { 
        // build out one big array of albums and playlists and shuffle it
        let resArr = data.albums.items.concat(data.playlists.items)
        this.shuffleArray(resArr)

        console.log(resArr)

        this.setSongGroups(resArr)
      })
  }

  render() {
    return (
      <Container>
        <div className='searchbar'>
          <TextField 
            className="text-field"
            label="Search" 
            variant="standard" 
            onKeyDown={event => {
              if (event.key === 'Enter') {
                this.searchOnSpotify();
              }
            }}
            onChange={(event) => this.setSearchInput(event.target.value)}
          />
          <Button 
            className="btn"
            variant="contained"
            onClick={() => this.searchOnSpotify()}>Search
          </Button>
        </div>
        
        <Grid container spacing={4}>
          {this.state.songGroups.map((songGroup: ISongGroup, idx) => {

            return (
              <Grid item xs={12} sm={6} md={3} key={this.state.songGroups.indexOf(songGroup)}>
                <Card sx={{ maxWidth: 400 }} onClick={() => this.getAudioFeatures(songGroup)}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={songGroup.images[0].url}
                  />
                  <CardContent>
                    <Typography variant="subtitle1"><i>{songGroup.name}</i></Typography>
                  </CardContent>
                  
                </Card>
              </Grid>
            )}
          )}
        </Grid>
      </Container>
    )
  }
}

export default Gallery;