import { Component } from "react";
import { Card, CardContent, CardMedia, CardActionArea, Grid, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

import { ISongGroup } from './Gallery';

interface ISongData {
  label: string,
  data: number[],
  backgroundColor: string,
  borderColor: string,
  borderWidth: number
}

interface ISongAnalyticsData {
  labels: string[]
  datasets: ISongData[]
}

interface IResultsViewProps {
    musicData: ISongGroup[]
}

interface IResultsViewState {
  dataToShow?: ISongAnalyticsData,
  isDialogOpen: boolean
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

class ResultsView extends Component<IResultsViewProps, IResultsViewState> {

    constructor(props: IResultsViewProps) {
      super(props)

      // TODO: required or it won't work, why?
      ChartJS.register([RadialLinearScale, PointElement, LineElement, Filler, Tooltip,Legend])

      this.state = {
        dataToShow: undefined,
        isDialogOpen: false
      }

      this.setDataToShow = this.setDataToShow.bind(this);
      this.setIsDialogOpen = this.setIsDialogOpen.bind(this);
    }

    setDataToShow(data: ISongAnalyticsData) {
      this.setState({dataToShow: data})
    }

    setIsDialogOpen(value: boolean) {
      this.setState({isDialogOpen: value});
    }

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
        let energy = (audioFeatures.reduce((total: number, next: any) => total + next.energy, 0) / audioFeatures.length)
        let danceability = (audioFeatures.reduce((total: number, next: any) => total + next.danceability, 0) / audioFeatures.length)
        let acousticness = (audioFeatures.reduce((total: number, next: any) => total + next.acousticness, 0) / audioFeatures.length)
        let instrumentalness = (audioFeatures.reduce((total: number, next: any) => total + next.instrumentalness, 0) / audioFeatures.length)
        let speechiness = (audioFeatures.reduce((total: number, next: any) => total + next.speechiness, 0) / audioFeatures.length)

        
        let analyticsData: ISongAnalyticsData = {
          labels: ['energy', 'danceability', 'acousticness', 'instrumentalness', 'speechiness'],
          datasets: [{
            label: 'Feature Scores',
            data: [energy, danceability, acousticness, instrumentalness, speechiness],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }]
        }

        this.setDataToShow(analyticsData);
        this.setIsDialogOpen(true);

        // step 5: get recommendations? theres an API for that
      }
      

    render() {
        return (
          <>
            <Grid container spacing={4}>
                {this.props.musicData.map((songGroup: ISongGroup, idx) => {
                    return (
                        <Grid item xs={12} sm={6} md={3} key={this.props.musicData.indexOf(songGroup)}>
                            <Card sx={{ maxWidth: 400 }} onClick={() => this.getAudioFeatures(songGroup)}>
                              <CardActionArea>
                                <CardMedia
                                    sx={{ height: 240 }}
                                    image={songGroup.images[0].url}
                                />
                                <CardContent sx={{ height: 45 }}>
                                    <Typography variant="subtitle1"><i>{songGroup.name}</i></Typography>
                                </CardContent>
                              </CardActionArea>                
                            </Card>
                        </Grid>
                    )}
                )}
            </Grid>
            <BootstrapDialog
              onClose={() => this.setIsDialogOpen(false)}
              aria-labelledby="customized-dialog-title"
              open={this.state.isDialogOpen}
            >
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Audio Feature Analysis
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={() => this.setIsDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent>
                <Radar data={this.state.dataToShow!}/>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={() => this.setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogActions>
            </BootstrapDialog>  
          </>
        )
    }
}

export default ResultsView;