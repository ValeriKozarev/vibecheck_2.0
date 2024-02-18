import { Component } from "react";
import { Button, ButtonGroup, TextField } from '@mui/material';
import { ISongGroup } from "./Gallery";
import FilterButton from './FilterButton';
import './SearchBar.css';

interface ISearchBarProps {
    musicDataUpdate: (musicData: ISongGroup[]) => void;
}

interface ISearchBarState { 
    searchInput: string,
    filter: string,
}


class SearchBar extends Component<ISearchBarProps, ISearchBarState> {
    constructor(props: ISearchBarProps) {
        super(props);
    
        this.state = {
          searchInput: '',
          filter: 'album,playlist'
        };

        this.setSearchInput = this.setSearchInput.bind(this);
        this.setSearchFilter = this.setSearchFilter.bind(this);
    }

    setSearchInput(inputVal: string) {
        this.setState({searchInput: inputVal})
    }

    setSearchFilter(filterVal: string) {
        this.setState({filter: filterVal})
    }

    updateFilterOnSearch(filter: string) {
        this.setSearchFilter(filter);
        this.searchOnSpotify(filter);
    }

    // main way to interact with Spotify is here
    // find artist based on search, and then use artistID to list albums
    async searchOnSpotify(filter?: string) {
        let searchParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem("token")
        }
        }

        let call = undefined;
        
        if (filter) {
            call = 'https://api.spotify.com/v1/search?q=' + this.state.searchInput + '&type=' + filter
        } else {
            call = 'https://api.spotify.com/v1/search?q=' + this.state.searchInput + '&type=album,playlist'
        }

        await fetch(call, searchParams)
        .then(result => result.json())
        .then(data => { 
            if (filter === 'album') {
                this.props.musicDataUpdate(data.albums.items.filter((album: any) => album.album_type !== 'single'))
            } else if (filter === 'playlist') {
                this.props.musicDataUpdate(data.playlists.items)
            } else {
                this.props.musicDataUpdate(data.albums.items.filter((album: any) => album.album_type !== 'single').concat(data.playlists.items))
            }
        })
    }

    render() {
        return (
            <div className='searchbar'>
                <div className='top-row'>
                    <TextField 
                        className="text-field"
                        label="Search" 
                        variant="outlined" 
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                this.searchOnSpotify();
                            }
                        }}
                        onChange={(event) => {
                            this.setSearchInput(event.target.value)
                            event.preventDefault();
                            }
                        }
                    />
                    
                    <Button 
                        className="btn"
                        variant="contained"
                        onClick={() => this.searchOnSpotify()}>Search
                    </Button>
                </div>

                <div className='secondary-row'>
                    <ButtonGroup variant="outlined" aria-label="Basic button group">
                        <FilterButton isSelected={this.state.filter === 'album' ? true : false} onSelect={() => this.updateFilterOnSearch('album')}>
                            Albums
                        </FilterButton>
                        <FilterButton isSelected={this.state.filter === 'playlist' ? true : false} onSelect={() => this.updateFilterOnSearch('playlist')}>
                            Playlists
                        </FilterButton>
                        <FilterButton isSelected={this.state.filter === 'album,playlist' ? true : false} onSelect={() => this.updateFilterOnSearch('album,playlist')}>
                            Both
                        </FilterButton>
                    </ButtonGroup>
                </div>
            </div>
        )
    }
}

export default SearchBar;