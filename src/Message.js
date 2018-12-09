import React from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import green from '@material-ui/core/colors/green';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
      primary: {main: '#009688'}
    },
    success: green[600]
  });

export default class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSnackBar: this.props.open
        }
        this.handleClose = this.handleClose.bind(this);
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.open != this.props.open) {
            this.setState({showSnackBar: this.props.open});
        }
    }

    handleClose() {
        this.props.close();
    }

    // Snackbar disappears on click, so no need to queue.
    render() {

        if (this.state.showSnackBar === false) {
            return('');
        } else {

            let icon;
            if (this.props.snackBarObj.type === 'error') {
                icon = <ErrorIcon />
            } else {
                icon = <CheckCircleIcon />
            }
            icon.props.style = {opacity: 0.9, marginRight: theme.spacing.unit};

            return (
                <MuiThemeProvider theme={theme}>
                    <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    open={this.state.showSnackBar}
                    >
                        <SnackbarContent
                            aria-describedby="client-snackbar"
                            style={{backgroundColor: this.props.snackBarObj.type === 'error' ? theme.palette.error.dark : green[600]}}
                            message={
                                <span id="client-snackbar" style={{display: 'flex', alignItems: 'center'}}>
                                    {icon}
                                    {this.props.snackBarObj.message}
                                </span>
                            }
                        >
                        </SnackbarContent>
                    </Snackbar>
                 </MuiThemeProvider>
            )
        } 
    }
}
