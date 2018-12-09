import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#009688' }
    },
});

export default class ProjectDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            sponsor: 'No Sponsor',
            company: 'No Company',
            name: '',
            description: '',
            update: '',
            requestedCompletion: new Date().toISOString().substr(0, 10),
            nameError: false,
            descriptionError: false,
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleProjectCreate = this.handleProjectCreate.bind(this);
    }

    // Props are only applied at time of construction
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevProps.open != this.props.open) {
            this.setState({ open: this.props.open });
        }
    }

    handleClose() {
        this.setState({
            sponsor: 'No Sponsor',
            company: 'No Company'
        });
        this.props.close();
    }

    handleProjectCreate() {

        // Validate required fields
        let exceptions = [];
        if (this.state.name === '') {
            exceptions.push('You need to provide a Project Name');
            this.setState({ nameError: true });
        } else {
            this.setState({ nameError: false });
        }

        if (this.state.description === '') {
            exceptions.push('You need to provide a Project Description');
            this.setState({ descriptionError: true });
        } else {
            this.setState({ descriptionError: false });
        }

        if (exceptions.length > 0) {
            if (exceptions.length > 1) {
                exceptions = exceptions.join('; ');
            } else {
                exceptions = exceptions[0];
            }
            this.props.sendMessage({ type: 'error', message: exceptions });
        } else {

            // Send the data back and close the dialog
            let { sponsor, company, name, description, update, requestedCompletion, status = "New Project" } = this.state;
            this.props.addProject({ sponsor, company, name, description, update, requestedCompletion, status });
            this.props.sendMessage({ type: 'success', message: 'Project created successfully!' });
            this.setState({
                sponsor: 'No Sponsor',
                company: 'No Company',
                name: '',
                description: '',
                update: '',
                requestedCompletion: new Date().toISOString().substr(0, 10)
            });
            this.handleClose();
        }

    }

    handleChange(event, name) {
        this.setState({ [name]: event.target.value })
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <form>
                    <Dialog
                        disableBackdropClick
                        disableEscapeKeyDown
                        open={this.state.open}
                        maxWidth='md'
                        onEntering={this.handleEntering}
                        aria-labelledby="confirmation-dialog-title">
                        <DialogTitle id="confirmation-dialog-title">Create New Project</DialogTitle>
                        <DialogContent style={{ minWidth: '500px', maxWidth: '500px' }}>
                            <TextField
                                autoFocus
                                required
                                id="standard-required"
                                label="Project Name"
                                defaultValue=""
                                margin="normal"
                                onChange={event => this.handleChange(event, 'name')}
                                fullWidth
                                error={this.state.nameError}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="sponsor">Project Sponsor</InputLabel>
                                <Select
                                    value={this.state.sponsor}
                                    onChange={event => this.handleChange(event, 'sponsor')}
                                    IconComponent={props => (<i {...props} className={`material-icons ${props.className}`} style={{ color: 'black' }}>assignment_ind</i>)}
                                    inputProps={{
                                        name: 'sponsor',
                                        id: 'select-sponsor',
                                    }}
                                >
                                    <MenuItem value="No Sponsor"><em>No Sponsor</em></MenuItem>
                                    <MenuItem value={"Kay Tightneck"}>Kay Tightneck</MenuItem>
                                    <MenuItem value={"Dick Weerdly"}>Dick Weerdly</MenuItem>
                                    <MenuItem value={"Scott Chestnut"}>Scott Chestnut</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel htmlFor="company">Company</InputLabel>
                                <Select
                                    value={this.state.company}
                                    onChange={event => this.handleChange(event, 'company')}
                                    inputProps={{
                                        name: 'company',
                                        id: 'select-company',
                                    }}
                                >
                                    <MenuItem value={"No Company"}><em>No Company</em></MenuItem>
                                    <MenuItem value={"Fry Co."}>French Fry Co.</MenuItem>
                                    <MenuItem value={"Transportation Co."}>Transportation Co.</MenuItem>
                                    <MenuItem value={"Tissue Co."}>Tissue Co.</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                id="requested-completion"
                                label="Requested Completion Date"
                                type="date"
                                margin="normal"
                                fullWidth
                                defaultValue={this.state.requestedCompletion}
                                onChange={event => this.handleChange(event, 'requestedCompletion')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                id="project-status"
                                label="Project Status"
                                defaultValue="New Project"
                                margin="normal"
                                fullWidth
                                disabled
                            />
                            <TextField
                                id="project-description"
                                label="Project Description"
                                onChange={event => this.handleChange(event, 'description')}
                                multiline
                                rows="4"
                                margin="normal"
                                fullWidth
                                error={this.state.descriptionError}
                                required
                            />
                            <TextField
                                id="project-update"
                                label="Project Update"
                                placeholder="Provide if applicable"
                                onChange={event => this.handleChange(event, 'update')}
                                multiline
                                rows="4"
                                margin="normal"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">Cancel</Button>
                            <Button onClick={this.handleProjectCreate} color="primary">Create</Button>
                        </DialogActions>
                    </Dialog>
                </form>
            </MuiThemeProvider>
        )
    }
}
