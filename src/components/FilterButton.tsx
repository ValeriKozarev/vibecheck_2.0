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
        console.log('filter button: ' + this.props.children + ' isSelected: ' + this.props.isSelected)
        return (
            <Button className={this.props.isSelected ? 'active' : ''} onClick={this.props.onSelect}>
                {this.props.children}
            </Button>
        )
    }
}

export default FilterButton;