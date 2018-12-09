import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

export default class FilterDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open
        }
    }

    handleListItemClick(selectedOption) {
        this.props.close(this.props.filterOptions.column, selectedOption);
    }

    // Props are only applied time of construction
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.open != this.props.open) {
            this.setState({open: this.props.open});
        }
    }

    render() {
        return (
            <Dialog
                open={this.state.open}
                aria-labelledby="confirmation-dialog-title"
                style={{ minWidth: '300px' }}>
                <DialogTitle style={{ textAlign: 'center' }}id="confirmation-dialog-title">Apply Filter</DialogTitle>
                    <DialogContent style={{ minWidth: '300px'}}>
                    <List>
                        {this.props.filterOptions.options.map(option => (
                            <ListItem button onClick={() => this.handleListItemClick(option)}>
                                <ListItemText primary={option} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleListItemClick(undefined)} style={ {color:"#009688"} } autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
