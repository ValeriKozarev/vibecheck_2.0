import { Component } from "react";
import { Button, TextField } from '@mui/material';
import { ISongGroup } from "./Gallery";

interface ISearchBarProps {
    musicDataUpdate: (musicData: ISongGroup[]) => void;
}

interface ISearchBarState { 
    searchInput: string,
}

class SearchBar extends Component<ISearchBarProps, ISearchBarState> {
    constructor(props: ISearchBarProps) {
        super(props);
    
        this.state = {
          searchInput: '',
        };

        this.setSearchInput = this.setSearchInput.bind(this);
    }

    setSearchInput(inputVal: string) {
        this.setState({searchInput: inputVal})
    }

    // main way to interact with Spotify is here
    // find artist based on search, and then use artistID to list albums
    async searchOnSpotify() {
        let searchParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem("token")
        }
        }

        console.log('search function, search string: ', this.state.searchInput)

        await fetch('https://api.spotify.com/v1/search?q=' + this.state.searchInput + '&type=album,playlist', searchParams)
        .then(result => result.json())
        .then(data => { 
            // build out one big array of albums and playlists and shuffle it
            let resArr = data.albums.items.concat(data.playlists.items)

            console.log("returning this data: ", resArr)

            this.props.musicDataUpdate(resArr)
        })
    }

    render() {
        return (
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
        )
    }
}

export default SearchBar;