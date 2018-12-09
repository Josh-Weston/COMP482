import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#009688' }
    },
});

export default class DeleteDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
        this.handleDelete = this.handleDelete.bind(this);
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.open != this.props.open) {
            this.setState({ open: this.props.open });
        }
    }

    handleDelete(res) {
        this.props.close();
        this.props.response(res);
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Dialog
                    open={this.state.open}
                    onClose={() => this.handleDelete(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Delete project?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you would like to delete this project? This action cannot be reversed.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleDelete(true)} color="secondary">
                            Delete
                        </Button>
                        <Button onClick={() => this.handleDelete(false)} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        )
    }
}
