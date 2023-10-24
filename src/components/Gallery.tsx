import { Component } from "react";
import { Button, Card, CardContent, CardMedia, Container, Grid, TextField, Typography } from '@mui/material';
import './Gallery.css'

interface ISongGroup {
  name: string
  images: any[]
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

  getAudioFeatures(album: ISongGroup) {
    console.log('testing spongebob!')
    console.log(album)
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
        let resArr = data.albums.items.concat(data.playlists.items)
        this.shuffleArray(resArr)
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