import { Component } from "react";
import SearchBar from './SearchBar'
import ResultsView from './ResultsView'
import { Container } from '@mui/material';
import './Gallery.css'

export interface ISongGroup {
  name: string
  images: any[]
  id: string
  isAlbum?: boolean
}

interface IGalleryProps {
  accessToken: string
}

interface IGalleryState {
  songGroups: ISongGroup[]
}

/**
 * The Gallery handles coordinating between the SearchBar and ResultsView
 * The state lives here and the Gallery is concerned with passing it back and forth
 */
class Gallery extends Component<IGalleryProps, IGalleryState> {
  constructor(props: IGalleryProps) {
    super(props);

    this.state = {
      songGroups: []
    };

    this.setSongGroups = this.setSongGroups.bind(this)
  }

  setSongGroups(songGroupArray: ISongGroup[]) {
    console.log("state update")
    this.setState({songGroups: songGroupArray})
  }

  render() {
    return (
      <Container>
        <SearchBar musicDataUpdate={this.setSongGroups}/>
        <ResultsView musicData={this.state.songGroups}/>
      </Container>
    )
  }
}

export default Gallery;