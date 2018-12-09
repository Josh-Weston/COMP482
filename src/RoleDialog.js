import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import blue from '@material-ui/core/colors/blue';
import styled, { css } from 'styled-components';

const XAvatar = styled(Avatar)`
    && {
        background-color: ${blue[100]};
        color: ${blue[600]};
    }
`;

const Note = styled.span`
    font-style: italic;
    width: 90%;
    text-align: center;
    margin: 0 auto;
    font-size: 12px;
    margin-bottom: 10px;
    margin-top: 10px;
`;

export default class RoleDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open
        }
    }

    handleListItemClick(selectedRole) {
        this.props.close(selectedRole);
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
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="xs"
                open={this.state.open}
                onEntering={this.handleEntering}
                aria-labelledby="confirmation-dialog-title">
                <DialogTitle id="confirmation-dialog-title">Select User Role</DialogTitle>
                <List>
                    {this.props.roles.map(role => (
                    <ListItem button onClick={() => this.handleListItemClick(role)}>
                        <ListItemAvatar>
                            <XAvatar>
                                <PersonIcon />
                            </XAvatar>
                        </ListItemAvatar>
                        <ListItemText primary={role} />
                    </ListItem>
                    ))}
                </List>
                <Note>
                    Note: This selection is required for testing, but will be handled automatically in production
                </Note>
            </Dialog>
        )
    }
}
