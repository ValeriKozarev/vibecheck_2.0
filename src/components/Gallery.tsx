import { Component } from "react";
import { Button, Card, CardContent, CardMedia, Container, Grid, TextField, Typography } from '@mui/material';
import './Gallery.css'

interface IAlbum {
  name: string
  images: any[]
}

interface IGalleryProps {
  accessToken: string
}

interface IGalleryState {
  searchInput: string,
  albums: IAlbum[]
}

class Gallery extends Component<IGalleryProps, IGalleryState> {
  constructor(props: IGalleryProps) {
    super(props);

    this.state = {
      searchInput: '',
      albums: []
    };

    this.setSearchInput = this.setSearchInput.bind(this);
  }

  setSearchInput(inputVal: string) {
    this.setState({searchInput: inputVal})
  }

  setAlbums(albumArray: IAlbum[]) {
    this.setState({albums: albumArray})
  }
  
  shuffleArray(array: IAlbum[]) {
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
        this.setAlbums(resArr)
      })

    // to get a list of an artist's albums, we need to do a few queries in a row
    // let artistID = await fetch('https://api.spotify.com/v1/search?q=' + this.state.searchInput + '&type=artist', searchParams)
    //   .then(result => result.json())
    //   .then(data => { return data.artists.items[0].id })

    // await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums?include_groups=album,single', searchParams)
    //   .then(result => result.json())
    //   .then(data => {
    //     console.log(data.items)
    //     this.setAlbums(data.items)
    //   })
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
          {this.state.albums.map((album: any, idx) => {

            return (
              <Grid item xs={12} sm={6} md={3} key={this.state.albums.indexOf(album)}>
                <Card sx={{ maxWidth: 400 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={album.images[0].url}
                  />
                  <CardContent>
                    <Typography variant="subtitle1"><i>{album.name}</i></Typography>
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