import { Component } from "react";
import { Button } from '@mui/material';
import './FilterButton.css'


interface IFilterButtonProps {
    isSelected: boolean;
    children: string;
    onSelect: () => void;
}

class FilterButton extends Component<IFilterButtonProps> {
    render() {
        // TODO: switch to ToggleButton
        return (
            <Button id={this.props.isSelected ? 'val-active-btn' : ''} onClick={this.props.onSelect}>
                {this.props.children}
            </Button>
        )
    }
}

export default FilterButton;