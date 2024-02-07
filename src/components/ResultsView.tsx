import { Component } from "react";
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { ISongGroup } from './Gallery';

interface IResultsViewProps {
    musicData: ISongGroup[]
}

class ResultsView extends Component<IResultsViewProps> {

    async getAudioFeatures(songGroup: ISongGroup) {
        let searchParams = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem("token")
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
      

    render() {
        return (
            <Grid container spacing={4}>
                {this.props.musicData.map((songGroup: ISongGroup, idx) => {

                    return (
                        <Grid item xs={12} sm={6} md={3} key={this.props.musicData.indexOf(songGroup)}>
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
        )
    }
}

export default ResultsView;